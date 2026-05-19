# GarageNote Android 実装サマリー（構造・MVVM・責務）

本ドキュメントは「どのように実装を進めたか」「どのファイルがどの責務を持つか」を把握するためのまとめです。  
Kotlin + Jetpack Compose + 公式推奨MVVM（ViewModel + Repository + UseCase）で構成しています。

---

## 1. 全体アプローチ（実装の進め方）

1. **ドメイン定義**（Fuel/Maintenance/Expiration/MonthlySummary）
2. **DB（Room）設計**（Entity/DAO/Database）
3. **Repository 実装**（CRUD + 集計 + 通知連携）
4. **UseCase 実装**（画面から呼ばれる操作の単位化）
5. **ViewModel 実装**（UIState・ロード・保存・削除）
6. **UI（Compose）実装**（一覧/詳細/作成/編集/設定/分析）
7. **通知（WorkManager）**（期限通知 + 再スケジュール）

---

## 2. フォルダ構造（Feature分割）

```
app/src/main/java/com/garagenote_android/
├─ app/                    # Application / DI / Routes / Nav
├─ features/
│  ├─ fuel/                # 給油記録
│  ├─ maintenance/         # 整備記録
│  ├─ expiration/          # 期限管理
│  ├─ analytics/           # 分析
│  └─ settings/            # 設定
├─ infrastructure/
│  ├─ db/                  # Room Database / DAO / Entity
│  └─ notification/        # 通知/WorkManager
└─ shared/
   └─ domain/              # Domain Model / Enum / 共通型
```

---

## 3. MVVM アーキテクチャ対応

### View（Compose UI）
- 画面は `features/*/ui/*Screen.kt`
- 例：
  - `features/logs/ui/LogsHomeScreen.kt`
  - `features/fuel/ui/FuelLogCreateScreen.kt`
  - `features/expiration/ui/ExpirationEditScreen.kt`

### ViewModel
- 画面状態と操作を集約。`features/*/ui/*ViewModel.kt`
- 例：
  - `features/fuel/ui/FuelLogViewModel.kt`
  - `features/maintenance/ui/MaintenanceLogViewModel.kt`
  - `features/expiration/ui/ExpirationViewModel.kt`
  - `features/analytics/ui/AnalyticsViewModel.kt`
  - `features/settings/ui/SettingsViewModel.kt`

### Model / Domain
- `shared/domain/*` にドメイン型・Enum
- `features/*/domain` に UseCase / Repository Interface / Input

---

## 4. Repository / UseCase / UIState の対応

### 4.1 Repository

| 機能 | Interface | 実装 |
|---|---|---|
| 給油 | `features/fuel/domain/FuelRepository.kt` | `features/fuel/data/FuelRepositoryImpl.kt` |
| 整備 | `features/maintenance/domain/MaintenanceRepository.kt` | `features/maintenance/data/MaintenanceRepositoryImpl.kt` |
| 期限 | `features/expiration/domain/ExpirationRepository.kt` | `features/expiration/data/ExpirationRepositoryImpl.kt` |
| 分析 | `features/analytics/domain/AnalyticsRepository.kt` | `features/analytics/data/AnalyticsRepositoryImpl.kt` |

**Repository の責務**
- DBアクセス（DAO）を使用して CRUD と集計
- 燃費計算、期限リマインド日計算などのドメインルール
- 期限更新時に通知スケジューリングを実行

### 4.2 UseCase

| 機能 | UseCase | ファイル |
|---|---|---|
| 給油 | list / get / create / update / delete | `features/fuel/domain/usecase/*` |
| 整備 | list / get / create / update / delete | `features/maintenance/domain/usecase/*` |
| 期限 | list / update | `features/expiration/domain/usecase/*` |
| 分析 | getMonthlySummary / getMonthlySeries | `features/analytics/domain/usecase/*` |
| 通知 | schedule / cancel / reschedule | `features/expiration/domain/usecase/*` |

UseCaseは「画面操作の単位」で切り出し、ViewModelから呼び出します。

### 4.3 UIState

UI状態は各 ViewModel 内で `StateFlow` で管理。

例：
- `FuelLogViewModel` が `items: StateFlow<List<FuelLog>>` を持つ
- `ExpirationViewModel` が `items: StateFlow<List<ExpirationItem>>` を持つ
- `SettingsViewModel` が `notificationEnabled: StateFlow<Boolean>` などを持つ

---

## 5. 主要ファイルの役割

### 5.1 アプリ共通
- `app/GarageNoteApplication.kt`  
  - Application起動時に通知チャンネル生成、再スケジュール実行
- `app/AppContainer.kt`  
  - Repository/UseCase のDIコンテナ
- `app/AppViewModelFactory.kt`  
  - ViewModelへUseCaseを注入
- `app/Routes.kt` / `app/MainNavHost.kt`  
  - 画面ルーティングとタブ構成

### 5.2 DB / Infra
- `infrastructure/db/GarageNoteDatabase.kt`  
  - Room Database
- `infrastructure/db/dao/*Dao.kt`  
  - 各テーブルのDAO
- `infrastructure/db/entity/*Entity.kt`  
  - Fuel/Maintenance/Expiration Entities
- `infrastructure/notification/ReminderWorker.kt`  
  - WorkManager通知送信
- `infrastructure/notification/NotificationScheduler.kt`  
  - 期限通知のスケジュール/キャンセル

### 5.3 画面と連携
| 画面 | ViewModel | UseCase |
|---|---|---|
| LogsHome | `FuelLogViewModel`, `MaintenanceLogViewModel` | list |
| FuelCreate/Edit | `FuelLogViewModel` | create/update |
| MaintenanceCreate/Edit | `MaintenanceLogViewModel` | create/update |
| ExpirationEdit | `ExpirationViewModel` | update |
| MonthlyAnalytics | `AnalyticsViewModel` | getMonthlySummary |
| Settings | `SettingsViewModel` | settings usecases |

---

## 6. UI仕様対応（どの画面で何を扱うか）

- **記録タブ**  
  `features/logs/ui/LogsHomeScreen.kt`  
  給油/整備の一覧表示、燃費・単価表示、詳細遷移

- **給油 詳細/追加/編集**  
  `features/fuel/ui/*Screen.kt`  
  入力項目：日付/走行距離/給油量/金額/燃料種別（チップ）

- **整備 詳細/追加/編集**  
  `features/maintenance/ui/*Screen.kt`  
  入力項目：日付/整備種別/走行距離/金額/メモ/写真（任意）

- **期限管理**  
  `features/expiration/ui/*Screen.kt`  
  車検日/保険/タイヤ交換カード表示と期限編集

- **分析**  
  `features/analytics/ui/MonthlyAnalyticsScreen.kt`  
  月間コスト/平均燃費の表示

- **設定**  
  `features/settings/ui/SettingsHomeScreen.kt`  
  通知ON/OFF、燃費単位切替、初期化

---

## 7. 燃費・単価・分析の扱い

- 燃費: **走行距離 ÷ 給油量**  
  - 保存時に `FuelRepositoryImpl` で計算  
  - 画面側でも `FuelLog.fuelAmount` から再計算し表示
- 単価: `fuelCost / fuelAmount`
- 分析: `AnalyticsRepositoryImpl` で月次平均燃費を集計

---

## 8. 通知フロー

1. 期限更新（ExpirationEdit）
2. UseCase → Repository → `NotificationScheduler`
3. WorkManager で `ReminderWorker` が発火
4. App起動時に再スケジュール（設定OFFならスキップ）

---

## 9. 主要ドキュメント

- `codexAndroid/ArchitectureSpec.md`（技術設計）
- `codexAndroid/design.md`（仕様・UI）
- `codexAndroid/NavigationSpec.md`（遷移仕様）
- `codexAndroid/DatabaseMigrationSpec.md`（DB仕様）
- `codexAndroid/QA.md`（QAチェック）
- `codexAndroid/task.md`（実装進捗）

