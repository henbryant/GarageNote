# Navigation Specification (Jetpack Compose)

## 前提
- 1台の車両前提
- 主要導線は「記録」「期限」「分析」
- 追加は各一覧画面の「追加」リンクから行う

---

## ナビゲーション構成

### Root
- `NavHost`
  - `MainTabs`（Bottom Navigation）
  - `Detail/Create/Edit Screens`（NavGraphで管理）

### MainTabs（Bottom）
1. `LogsTab`（記録）
2. `ExpirationTab`（期限）
3. `AnalyticsTab`（分析）
4. `SettingsTab`（設定）

---

## 画面一覧（主要）

### LogsTab
- `LogsHomeScreen`
  - 給油記録の一覧（最新順）
  - 整備記録の一覧（最新順）
  - 追加ボタン（給油/整備選択）
- `FuelLogDetailScreen`
- `MaintenanceLogDetailScreen`

### ExpirationTab
- `ExpirationHomeScreen`
  - 車検/保険/タイヤ交換の期限カード
  - 期限切れ・残日数表示
- `ExpirationEditScreen`

### AnalyticsTab
- `MonthlyAnalyticsScreen`
  - 月間費用（給油・整備）
  - 円グラフ（内訳）
  - トレンドグラフ（月次推移）

### SettingsTab
- `SettingsHomeScreen`
  - 通知設定（権限/有効無効）
  - 燃費単位（km/L or L/100km）
  - データ初期化（v1 optional）

---

## 画面遷移フロー

### 給油記録
`LogsHome` → `FuelLogDetail` → `FuelLogEdit`

### 整備記録
`LogsHome` → `MaintenanceLogDetail` → `MaintenanceLogEdit`

### 期限管理
`ExpirationHome` → `ExpirationEdit(type)`

### 分析
`MonthlyAnalytics`（読み取りのみ、遷移なし）

---

## ルート命名規約
- NavGraph: `XGraph`
- Tabs: `MainTabs`
- Routes: `PascalCaseRoute`
- Params: `XxxArgs`
