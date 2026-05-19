# Implementation Tasks (v1) with Priority / Android

## Priority Legend
- P0: MVPに必須
- P1: あると便利（MVP後半）

## P0 実装順（推奨）
1. 基盤準備（依存関係 + フォルダ構成）
2. DB初期化・スキーマ・マイグレーション
3. ドメイン定義 + ユースケース基礎ロジック
4. Repository 実装
5. ViewModel 実装
6. Navigation 構築
7. Logs UI（給油・整備）CRUD
8. Expiration UI + 通知スケジュール
9. Analytics UI + 集計
10. エッジケース対応 & QA

## 0. 基盤準備
- [x] (P0) Compose 有効化と依存関係追加（Navigation / Room / WorkManager）
- [x] (P0) `app/src/main/java/...` 配下の Feature ベース構成を作成
- [ ] (P1) 共通UI・テーマ・フォーマッタ設定を整備

---

## 1. Domain / UseCase 設計
- [x] (P0) ドメイン型定義（Vehicle / FuelLog / MaintenanceLog / ExpirationItem / MonthlySummary）
- [x] (P0) Enum定義（FuelType / ExpirationType）
- [x] (P0) 燃費計算ロジック（走行距離 ÷ 給油量）
- [x] (P0) 期限リマインド日算出（-30日固定）
- [x] (P0) UseCase層を導入（CRUD/集計/通知）

---

## 2. Database / Migration
- [x] (P0) Room 初期化（Database/DAO/Entities）
- [x] (P0) schema_version 管理（Room version）
- [ ] (P0) v1スキーマ生成SQLの実装
- [ ] (P0) マイグレーション適用ロジック（Migration）
- [x] (P0) インデックス作成

---

## 3. Repository 実装
- [x] (P0) FuelRepository 実装（CRUD + 燃費算出）
- [x] (P0) MaintenanceRepository 実装（CRUD）
- [x] (P0) ExpirationRepository 実装（type別 upsert）
- [x] (P0) AnalyticsRepository 実装（集計・月次シリーズ）

---

## 4. Notification
- [x] (P0) 通知権限確認（Android 13+）
- [x] (P0) 期限保存時に reminder_date 通知をスケジュール
- [x] (P0) アプリ起動時の再スケジュール処理
- [x] (P1) 通知無効時の警告表示

---

## 5. State Management（ViewModel）
- [ ] (P0) FuelLog ViewModel（一覧 / 追加 / 更新 / 削除）
- [ ] (P0) MaintenanceLog ViewModel（一覧 / 追加 / 更新 / 削除）
- [ ] (P0) Expiration ViewModel（取得 / 更新）
- [ ] (P0) Analytics ViewModel（読み込み）
- [ ] (P1) Settings ViewModel（通知・単位設定）

---

## 6. Navigation
- [x] (P0) NavHost + MainTabs 構築
- [x] (P0) 画面Route定義
- [x] (P0) 遷移フローの結線（ログ詳細 → 編集）

---

## 7. UI 実装（Feature別）

### 7.1 Logs
- [x] (P0) LogsHomeScreen（給油・整備一覧）
- [x] (P0) FuelLogDetailScreen
- [x] (P0) MaintenanceLogDetailScreen
- [x] (P0) FuelLogCreate/EditScreen（入力＋バリデーション）
- [x] (P0) MaintenanceLogCreate/EditScreen（入力＋写真）

### 7.2 Expiration
- [x] (P0) ExpirationHomeScreen（カード + 残日数）
- [x] (P0) ExpirationEditScreen（期限設定）

### 7.3 Analytics
- [x] (P0) MonthlyAnalyticsScreen
- [ ] (P0) 円グラフ（内訳）
- [ ] (P0) トレンドグラフ（月次）

### 7.4 Settings
- [x] (P1) SettingsHomeScreen（通知・単位・初期化）

---

## 8. Validation / Edge Cases
- [ ] (P0) 初回給油は燃費非表示
- [ ] (P0) 期限が過去日の場合は期限切れ表示
- [ ] (P0) 通知権限拒否時のガード
- [ ] (P1) 写真権限拒否時のフォールバック

---

## 9. QA / Manual Test
- [ ] (P0) 空データ時のUI確認
- [ ] (P0) 給油・整備のCRUD動作確認
- [ ] (P0) 期限通知が30日前に発火することを検証
