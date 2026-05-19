# Architecture Specification (Feature-based / Android)

## Tech Stack (v1)
- Kotlin
- Jetpack Compose
- AndroidX Navigation (Compose)
- Room (SQLite)
- Kotlin Coroutines + Flow
- MVVM（公式推奨）

---

## 1. フォルダ構成（Feature ベース / Android）

### ルート構成の前提
- ルート直下は Android Studio プロジェクト
- 実際のアプリコードは `app/` モジュール配下

```
app/
 └── src/main/java/com/example/garagenote/
     ├── app/
     │   ├── navigation/
     │   ├── di/
     │   └── theme/
     │
     ├── features/
     │   ├── fuel/
     │   │   ├── domain/
     │   │   ├── data/
     │   │   └── ui/
     │   ├── maintenance/
     │   │   ├── domain/
     │   │   ├── data/
     │   │   └── ui/
     │   ├── expiration/
     │   │   ├── domain/
     │   │   ├── data/
     │   │   └── ui/
     │   ├── analytics/
     │   │   ├── domain/
     │   │   ├── data/
     │   │   └── ui/
     │   └── settings/
     │       ├── domain/
     │       ├── data/
     │       └── ui/
     │
     ├── shared/
     │   ├── domain/
     │   ├── data/
     │   └── ui/
     │
     └── infrastructure/
         ├── db/
         └── notifications/
```

### ルール
- 各 `feature` は `domain / data / ui` を持つ
- `domain` は純粋な型・ルール・UseCase
- `data` は Repository 実装と Room/DAO
- `ui` は Compose 画面・ViewModel
- `shared` は横断利用のみ
- `infrastructure` はDB/通知など外部I/O

---

## 1.1 アーキテクチャ方針（MVVM + Clean寄り）

### 役割の対応
- **View**: `features/*/ui`（Compose Screens）
- **ViewModel**: `features/*/ui/*ViewModel`
- **Model**: `features/*/domain` + `features/*/data` + `infrastructure`
- **UseCase**: `features/*/domain/usecase`

### 依存関係
`ui` → `usecase` → `data (Repository)` → `infrastructure (Room/Notifications)`

---

## 2. ドメインレイヤー

### Entities
- `Vehicle`
- `FuelLog`
- `MaintenanceLog`
- `ExpirationItem`
- `MonthlySummary`（派生）

### Value Objects / Enums
- `FuelType`（REGULAR | PREMIUM | DIESEL）
- `ExpirationType`（VEHICLE_INSPECTION | INSURANCE | TIRE_REPLACEMENT、表示名: 車検日 / 保険 / タイヤ交換）

### Domain Rules
- 燃費は「走行距離 ÷ 給油量」で計算
- 給油量が0以下の場合は燃費算出不可
- 期限リマインドは30日前固定（v1）

---

## 3. Repository インターフェース

### FuelRepository
- `suspend fun list(): List<FuelLog>`
- `suspend fun get(id: String): FuelLog?`
- `suspend fun create(input: FuelLogInput): FuelLog`
- `suspend fun update(id: String, input: FuelLogInput): FuelLog`
- `suspend fun remove(id: String)`

### MaintenanceRepository
- `suspend fun list(): List<MaintenanceLog>`
- `suspend fun get(id: String): MaintenanceLog?`
- `suspend fun create(input: MaintenanceLogInput): MaintenanceLog`
- `suspend fun update(id: String, input: MaintenanceLogInput): MaintenanceLog`
- `suspend fun remove(id: String)`

### ExpirationRepository
- `suspend fun list(): List<ExpirationItem>`
- `suspend fun getByType(type: ExpirationType): ExpirationItem?`
- `suspend fun upsert(type: ExpirationType, date: LocalDate, notificationsEnabled: Boolean = true): ExpirationItem`

### AnalyticsRepository
- `suspend fun getMonthlySummary(month: YearMonth): MonthlySummary`
- `suspend fun getMonthlySeries(range: ClosedRange<YearMonth>): List<MonthlySummary>`

---

## 4. データベーススキーマ（Room/SQLite）

### vehicles
- `id` TEXT PRIMARY KEY
- `name` TEXT
- `created_at` TEXT NOT NULL

### fuel_logs
- `id` TEXT PRIMARY KEY
- `date` TEXT NOT NULL
- `mileage` INTEGER NOT NULL
- `fuel_amount` REAL NOT NULL
- `fuel_cost` INTEGER NOT NULL
- `fuel_type` TEXT NOT NULL
- `fuel_efficiency` REAL
- `created_at` TEXT NOT NULL

### maintenance_logs
- `id` TEXT PRIMARY KEY
- `maintenance_type` TEXT NOT NULL
- `date` TEXT NOT NULL
- `mileage` INTEGER NOT NULL
- `cost` INTEGER NOT NULL
- `memo` TEXT
- `photo_uri` TEXT
- `created_at` TEXT NOT NULL

### expiration_items
- `id` TEXT PRIMARY KEY
- `type` TEXT NOT NULL UNIQUE
- `expiration_date` TEXT NOT NULL
- `reminder_date` TEXT NOT NULL
- `created_at` TEXT NOT NULL

### インデックス
- `fuel_logs(date)`
- `maintenance_logs(date)`
- `expiration_items(type)`

---

## 5. 通知フロー（30日前リマインド）

1. 期限（車検／保険／タイヤ）を保存
2. `reminder_date = expiration_date - 30日` を算出して保存
3. 通知権限を確認（Android 13+ では POST_NOTIFICATIONS）
4. 設定で通知がONの場合のみスケジュール
5. `reminder_date` にローカル通知をスケジュール（WorkManager など）
6. アプリ起動時に以下を検証しリスケジュール
   - 期限変更・削除
   - 端末再起動や通知消失
7. 期限当日が過ぎたら「期限切れ」状態で表示
