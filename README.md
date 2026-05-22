# GarageNote

GarageNote は、車の給油・整備・期限・月間コストを管理するためのローカルファーストなモバイルアプリです。

アプリ本体は `mobile/` 配下の Expo / React Native プロジェクトとして実装されています。リポジトリ直下の `codex/` には、仕様・設計・QA・実装タスクのドキュメントがあります。

## 主な機能

- 給油記録の作成・表示・更新・削除
- 整備記録の作成・表示・更新・削除
- 車検、保険、タイヤ交換の期限管理
- 期限30日前のローカル通知
- 給油費・整備費の月間分析
- SQLite によるオフライン保存
- 通知設定と燃費単位の切り替え

## スコープ

GarageNote v1 は、1台の車を管理する個人ユーザー向けです。

含むもの:

- 端末内だけで完結するデータ保存
- SQLite スキーマとマイグレーション管理
- 満タン法による燃費計算
- 月間コストの集計と推移表示
- 期限リマインドのローカル通知

v1 では含まないもの:

- バックエンドやクラウド同期
- 複数車両対応
- 年次推移や予測などの高度な分析
- インポート / エクスポート

## 技術スタック

- Expo
- React Native
- TypeScript
- `expo-sqlite`
- Expo Notifications
- React Navigation
- Zustand

## プロジェクト構成

```text
GarageNote/
  codex/
    design.md                 プロダクト仕様
    ArchitectureSpec.md       Feature ベースのアーキテクチャ
    DatabaseMigrationSpec.md  SQLite マイグレーション方針
    NavigationSpec.md         ナビゲーション設計
    QA.md                     手動 QA チェックリスト
    task.md                   実装タスク一覧
    summarize.md              実装サマリー

  mobile/
    App.tsx
    index.ts
    package.json
    app.json
    src/
      app/
        navigation/           Root Stack と Bottom Tabs
        store/                Zustand Store
        notifications/        通知同期
        bootstrap.ts          アプリ起動時の初期化
      features/
        fuel/
        maintenance/
        expiration/
        analytics/
        settings/
      infrastructure/
        db/                   SQLite 初期化とスキーマ
        notifications/        通知権限とスケジュール
      shared/
        components/
        domain/
        utils/
```

## アーキテクチャ

Feature ベースの構成を採用し、MVVM + Clean Architecture に近い責務分離にしています。

```text
UI Screen
  -> Zustand Store
  -> UseCase
  -> Repository
  -> Infrastructure
```

各レイヤーの役割:

- `features/*/ui`: 画面と UI コンポーネント
- `app/store`: ViewModel 相当の状態と画面向けアクション
- `features/*/usecases`: アプリケーションロジック
- `features/*/data`: Repository 実装
- `features/*/domain`: ドメイン型、定数、ルール
- `infrastructure`: SQLite や通知などの外部 I/O
- `shared`: 複数 Feature で使う共通部品とユーティリティ

## データモデル

主要なエンティティ:

- `Vehicle`
- `FuelLog`
- `MaintenanceLog`
- `ExpirationItem`
- `MonthlySummary`

SQLite テーブル:

- `vehicles`
- `fuel_logs`
- `maintenance_logs`
- `expiration_items`

スキーマ変更は SQLite の `PRAGMA user_version` で管理します。マイグレーションはアプリ起動時に適用し、原則として破壊的変更を避けます。

## ナビゲーション

主要画面は Bottom Tabs で切り替えます。

- 記録
- 期限
- 分析
- 設定

詳細・追加・編集画面は Root Stack Navigator で管理します。

## セットアップ

依存関係をインストールして Expo アプリを起動します。

```sh
cd mobile
npm install
npm run android
```

その他のよく使うコマンド:

```sh
npm run ios
npm run web
npx expo prebuild
```

Android Studio でビルドしたい場合は、`npx expo prebuild` を実行してから `mobile/android/` を開きます。

## QA

手動 QA 項目は `codex/QA.md` にあります。主な確認観点は以下です。

- Android、iOS、Web で起動できる
- 空データ時の表示が正しい
- 給油・整備の CRUD が動作する
- 初回給油の燃費が未表示になる
- 過去日の期限が「期限切れ」表示になる
- 未来日の期限が「残りX日」表示になる
- 通知権限と通知 ON/OFF が正しく動作する
- 月間分析の合計とグラフがデータに応じて更新される

## 開発メモ

- Expo アプリは `mobile/` 配下にあります。npm コマンドは `mobile/` で実行してください。
- `package-lock.json` の取得元 URL は public npm registry を使います。
- Expo prebuild で生成される native フォルダは、基本的に直接編集しないでください。
- Feature 実装は既存の `domain / data / usecases / ui` 構成に合わせてください。
