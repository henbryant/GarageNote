# Architecture Specification (Feature-based)

## Tech Stack (v1)
- React Native
- TypeScript
- SQLite
- Zustand
- React Navigation

---

## 1. フォルダ構成（Feature ベース / Expo）

### ルート構成の前提
- ルート直下はExpoプロジェクトではない
- 実際のExpoアプリは `mobile/` 配下に配置する

```
mobile/
 ├── App.tsx
 ├── package.json
 └── src/
     ├── app/
     │    ├── navigation/
     │    ├── store/        # ViewModel相当（Zustand）
     │    └── theme/
     │
     ├── features/
     │    ├── fuel/
     │    │   ├── components/
     │    │   ├── domain/
     │    │   ├── data/
     │    │   ├── ui/
     │    │   └── usecases/
     │    ├── maintenance/
     │    │   ├── components/
     │    │   ├── domain/
     │    │   ├── data/
     │    │   ├── ui/
     │    │   └── usecases/
     │    ├── expiration/
     │    │   ├── components/
     │    │   ├── domain/
     │    │   ├── data/
     │    │   ├── ui/
     │    │   └── usecases/
     │    ├── analytics/
     │    │   ├── components/
     │    │   ├── domain/
     │    │   ├── data/
     │    │   ├── ui/
     │    │   └── usecases/
     │    └── settings/
     │        ├── components/
     │        ├── domain/
     │        ├── data/
     │        ├── ui/
     │        └── usecases/
     │
     ├── shared/
     │    ├── components/
     │    ├── domain/
     │    ├── data/
     │    └── utils/
     │
     └── infrastructure/
          ├── db/
          └── notifications/
```

### ルール
- 各 `feature` は `domain / data / usecases / ui` を持つ
- `domain` は純粋な型・ルールのみ
- `data` は Repository 実装とSQLiteアクセス
- `usecases` はアプリケーションロジック（ユースケース）
- `ui` は画面・UIコンポーネント
- `shared` は横断利用のみ
- `infrastructure` はDB/通知など外部I/O

---

## 1.1 アーキテクチャ方針（MVVM + Clean寄り）

### 役割の対応
- **View**: `features/*/ui`（React Components）
- **ViewModel**: `app/store`（Zustand Store）
- **Model**: `features/*/domain` + `features/*/data` + `infrastructure`
- **UseCase**: `features/*/usecases`（画面とRepositoryの間）

### 依存関係
`ui` → `store` → `usecases` → `data (Repository)` → `infrastructure`

※ これにより、Android MVVMでの View → ViewModel → UseCase/Repository に近い構造になる

---

## 2. ドメインレイヤー

### Entities
- `Vehicle`
- `FuelLog`
- `MaintenanceLog`
- `ExpirationItem`
- `MonthlySummary`（派生）

### Value Objects / Enums
- `FuelType`（regular | premium | diesel）
- `ExpirationType`（vehicleInspection | insurance | tireReplacement）

### Domain Rules
- 燃費は満タン法（前回走行距離との差 ÷ 給油量）で計算
- 初回給油・給油量が0以下は燃費算出不可
- 期限リマインドは30日前固定（v1）

---

## 3. Repository インターフェース

### FuelRepository
- `list(): Promise<FuelLog[]>`
- `get(id: string): Promise<FuelLog | null>`
- `create(input: FuelLogInput): Promise<FuelLog>`
- `update(id: string, input: FuelLogInput): Promise<FuelLog>`
- `remove(id: string): Promise<void>`

### MaintenanceRepository
- `list(): Promise<MaintenanceLog[]>`
- `get(id: string): Promise<MaintenanceLog | null>`
- `create(input: MaintenanceLogInput): Promise<MaintenanceLog>`
- `update(id: string, input: MaintenanceLogInput): Promise<MaintenanceLog>`
- `remove(id: string): Promise<void>`

### ExpirationRepository
- `list(): Promise<ExpirationItem[]>`
- `getByType(type: ExpirationType): Promise<ExpirationItem | null>`
- `upsert(type: ExpirationType, date: string, options?: { notificationsEnabled?: boolean }): Promise<ExpirationItem>`

### AnalyticsRepository
- `getMonthlySummary(month: string): Promise<MonthlySummary>`
- `getMonthlySeries(range: { from: string; to: string }): Promise<MonthlySummary[]>`

---

## 4. データベーススキーマ（SQLite）

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
3. 通知権限を確認（未許可なら警告・スケジュールしない）
4. 設定で通知がONの場合のみスケジュール
5. `reminder_date` にローカル通知をスケジュール
6. アプリ起動時に以下を検証しリスケジュール
   - 期限変更・削除
   - 端末再起動や通知消失
7. 期限当日が過ぎたら「期限切れ」状態で表示
