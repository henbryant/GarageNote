# Implementation Tasks (v1) with Priority

## Priority Legend
- P0: MVPに必須
- P1: あると便利（MVP後半）

## P0 実装順（推奨）
1. 基盤準備（依存関係 + フォルダ構成）
2. DB初期化・スキーマ・マイグレーション
3. ドメイン定義 + ユースケース基礎ロジック
4. Repository 実装
5. Zustand Store 実装
6. Navigation 構築
7. Logs UI（給油・整備）CRUD
8. Expiration UI + 通知スケジュール
9. Analytics UI + 集計
10. エッジケース対応 & QA

## 0. 基盤準備
- [x] (P0) `mobile/` をExpo + TypeScriptで初期化
- [x] (P0) `mobile/src/` 配下の Feature ベース構成を作成
- [x] (P0) 依存関係追加（SQLite / Zustand / React Navigation / Expo Notifications）
- [ ] (P1) 共通UI・テーマ・フォーマッタ設定を整備

---

## 1. Domain / Usecase 設計
- [x] (P0) ドメイン型定義（Vehicle / FuelLog / MaintenanceLog / ExpirationItem / MonthlySummary）
- [x] (P0) Enum定義（FuelType / ExpirationType）
- [x] (P0) 燃費計算ロジック（満タン法、初回は算出不可）
- [x] (P0) 期限リマインド日算出（-30日固定）
- [x] (P0) UseCase層を導入（CRUD/集計/通知）

---

## 2. Database / Migration
- [x] (P0) SQLite初期化（接続・PRAGMA）
- [x] (P0) schema_version 管理（user_version）
- [x] (P0) v1スキーマ生成SQLの実装
- [x] (P0) マイグレーション適用ロジック（順次適用）
- [x] (P0) インデックス作成

---

## 3. Repository 実装
- [x] (P0) FuelRepository 実装（CRUD + 燃費算出）
- [x] (P0) MaintenanceRepository 実装（CRUD）
- [x] (P0) ExpirationRepository 実装（type別 upsert）
- [x] (P0) AnalyticsRepository 実装（集計・月次シリーズ）

---

## 4. Notification
- [x] (P0) Expo Notifications 権限確認と保存
- [x] (P0) 期限保存時に reminder_date 通知をスケジュール
- [x] (P0) アプリ起動時の再スケジュール処理
- [x] (P1) 通知無効時の警告表示

---

## 5. State Management（Zustand）
- [x] (P0) FuelLog store（一覧 / 追加 / 更新 / 削除）
- [x] (P0) MaintenanceLog store（一覧 / 追加 / 更新 / 削除）
- [x] (P0) Expiration store（取得 / 更新）
- [x] (P0) Analytics store（読み込み）
- [x] (P1) Settings store（通知・単位設定）
## 5.1 ViewModel / UseCase 結線
- [x] (P0) StoreからRepository直接呼び出しをUseCase経由へ移行

---

## 6. Navigation
- [x] (P0) RootNavigator + MainTabs + ModalStack 構築
- [x] (P0) 画面ParamList定義
- [x] (P0) 遷移フローの結線（ログ詳細 → 編集）

---

## 7. UI 実装（Feature別）

### 7.1 Logs
- [x] (P0) LogsHomeScreen（給油・整備一覧）
- [x] (P0) FuelLogDetailScreen
- [x] (P0) MaintenanceLogDetailScreen
- [x] (P0) FuelLogCreate/EditScreen（入力＋バリデーション）
- [x] (P0) MaintenanceLogCreate/EditScreen（入力＋写真）
- [x] (P0) 給油一覧に燃費と単価を表示

### 7.2 Expiration
- [x] (P0) ExpirationHomeScreen（カード + 残日数）
- [x] (P0) ExpirationEditScreen（期限設定）

### 7.3 Analytics
- [x] (P0) MonthlyAnalyticsScreen
- [x] (P0) 円グラフ（内訳）
- [x] (P0) トレンドグラフ（月次）

### 7.4 Settings
- [x] (P1) SettingsHomeScreen（通知・単位・初期化）

---

## 8. Validation / Edge Cases
- [x] (P0) 初回給油は燃費非表示
- [x] (P0) 期限が過去日の場合は期限切れ表示
- [x] (P0) 通知権限拒否時のガード
- [ ] (P1) 写真権限拒否時のフォールバック

---

## 9. QA / Manual Test
- [x] (P0) 空データ時のUI確認
- [x] (P0) 給油・整備のCRUD動作確認
- [x] (P0) 期限通知が30日前に発火することを検証
