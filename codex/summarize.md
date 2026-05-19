# GarageNote 実装サマリー（Androidネイティブ開発者向け）

## 1. 今回の実装方針（何をどう進めたか）
- 仕様（`codex/*`）を元に、**Expo（React Native + TypeScript）** でモバイルアプリを構築
- 既存のAndroidネイティブ `app/` は削除し、**RNアプリを `mobile/` 配下に新規作成**
- Featureベースのアーキテクチャで、**Domain / Data / UI / Usecase** を分離

---

## 2. ファイル構造（重要な場所）

```
GarageNote/
  mobile/
    App.tsx
    package.json
    src/
      app/
        navigation/     # React Navigation（画面遷移）
        store/          # Zustand（状態管理）
        notifications/  # 通知同期
        bootstrap.ts    # 起動時初期化
      features/
        fuel/
        maintenance/
        expiration/
        analytics/
        settings/
      infrastructure/
        db/             # SQLite初期化/スキーマ
        notifications/  # Expo Notifications
      shared/
        components/
        domain/
        utils/
```

**Android StudioでのKotlin開発との違い**
- Kotlin/Java → `app/src/main/java/...`
- RN/Expo → JS/TSで `mobile/src` を編集

---

## 3. 仕組み（ざっくり流れ）

### 3.1 起動時
- `App.tsx` → `bootstrapApp()` を呼ぶ
- `bootstrapApp` 内で以下を初期化
  - SQLite DB
  - 通知権限
  - 期限通知の再スケジュール

### 3.2 画面
React Navigation構成：
- Bottom Tabs: **記録 / 期限 / 分析 / 設定**
- Modal/Stack: **追加・編集・詳細**

### 3.3 データ
- SQLiteを使用（`expo-sqlite`）
- RepositoryがDBアクセスを担当
- Zustandが画面状態（一覧・追加・削除など）を管理

---

## 4. ExpoとAndroidの関係

### Expoとは
React Nativeアプリ開発を簡略化するツールチェーン。
- 依存関係管理（expo install）
- Android/iOSのビルド支援
- 通知/SQLiteなどのAPI提供

### Androidネイティブとの関係
- Kotlinコードは基本不要
- ただし最終的に**Androidアプリとしてビルド可能**
- ビルドは2パターン：
  1. **Expo Managed**（推奨）  
     - `expo start` で開発
     - `eas build -p android` でAPK/AAB生成
  2. **Prebuild（eject）**  
     - `npx expo prebuild` → `android/` フォルダ生成
     - Android Studioで通常のGradleビルドが可能

---

## 5. 現状の実装完了状態

### 実装済み
- SQLite初期化・スキーマ・マイグレーション
- Repository全種（Fuel / Maintenance / Expiration / Analytics）
- Zustand Store全種
- 画面（CRUD + 分析 + 設定）
- 期限通知スケジュール（ON/OFF連動）
- 円グラフ・月次トレンド表示
- エッジケース対応（初回給油燃費非表示 / 期限切れ表示）

### 未実装（残タスク）
- 写真添付（任意：除外予定）
- 共通UIテーマ整備（P1）

---

## 6. Androidアプリとして落とし込む方法

### 方法A: Expo Managed（推奨）
1. `cd mobile`
2. `npm install`
3. `npm run android` でエミュレータ起動
4. 本番は `eas build -p android` → APK/AAB生成

### 方法B: Android Studioでビルドしたい場合
1. `cd mobile`
2. `npx expo prebuild`
3. `mobile/android/` が生成される
4. Android Studioで開いてGradleビルド可能

#### Android Studio での手順（詳細）
1. **Prebuild実行**
   - `cd mobile`
   - `npx expo prebuild`
2. **Android Studioで開く**
   - Android Studio → **Open** → `mobile/android/`
3. **Gradle Sync**
   - 初回は自動でSyncされる
   - 失敗した場合は右上の **Sync Now**
4. **エミュレータ/実機**
   - AVD Manager でエミュレータ作成
   - 実機ならUSBデバッグON
5. **Run**
   - Run ▶︎ でアプリ起動

#### 注意点
- Prebuildは **生成物を上書き** するため、`android/` 直編集は避ける
- ネイティブ拡張が必要な場合は `app.config.js` で設定

---

## 7. Kotlin開発者向け補足

| Kotlin/Android | React Native/Expo |
| --- | --- |
| Activity / Fragment | Screen (React Component) |
| ViewModel | Zustand Store |
| Room | SQLite（expo-sqlite） |
| Navigation Component | React Navigation |
| NotificationManager | Expo Notifications |

### 追加対応表（より詳細）

| Kotlin/Android | React Native/Expo | 説明 |
| --- | --- | --- |
| XML Layout | JSX | UI構成をコードで記述 |
| LiveData / Flow | Zustand / useState | 状態更新をリアクティブに |
| Repository | Repository | 同じ概念（DB操作を集約） |
| UseCase | UseCase / Hooks | ビジネスロジック層 |
| Coroutine | async/await | 非同期処理 |
| Retrofit | fetch / axios | API通信（※v1は不要） |
| SharedPreferences | AsyncStorage | 永続設定（通知ON/OFFなど） |
| WorkManager | Background Task / Notification Scheduler | バックグラウンド処理 |

---

## 9. RN/Expo開発でよく使うコマンド
- `npm run android` : Androidエミュレータで起動
- `npm run ios` : iOSシミュレータで起動
- `npm run web` : Webで起動（簡易確認）
- `npx expo prebuild` : Android/iOSネイティブ生成
- `eas build -p android` : APK/AABビルド

---

## 10. React Native + TypeScript 初心者向けの一般情報

### 10.1 基本的な考え方
- **UIは関数コンポーネントで構成**（`function Screen() { return <View /> }`）
- **状態はHooksで管理**（`useState`, `useEffect`）
- **画面遷移はNavigator**（スタック/タブ）

### 10.2 型安全のポイント
- `type` / `interface` でデータ構造を定義
- `useState<number | null>()` のように明示
- React Navigationの `ParamList` を定義して型安全に遷移

### 10.3 よく使う基本UI
- `View` = レイアウト
- `Text` = テキスト
- `TextInput` = 入力
- `TouchableOpacity` = ボタン
- `FlatList` = リスト表示

### 10.4 デバッグの考え方
- **Console.log** が有効（JS）
- エミュレータでは `expo start` でホットリロード
- Android Studioでネイティブのログを見ることも可能

### 10.5 典型的な開発フロー
1. 仕様を決める
2. Domain/Repository/Storeを用意
3. 画面を作る
4. 画面とStoreを結線
5. 動作確認

### 10.6 よくあるつまずき
- **型エラー**：`tsc --noEmit` で早期検知
- **ナビゲーション型**：`RouteProp` / `ParamList` を使う
- **Android/ iOS差分**：プラットフォーム依存は `Platform` で分岐

### 10.7 Reactの基礎（props / state）
- **props**：親から子へ渡す値（不変）
- **state**：コンポーネント内で変化する値（`useState`）
- 親が `props` を更新すると子が再描画される

例（簡易）：
```
type Props = { title: string };
const MyCard = ({ title }: Props) => {
  const [count, setCount] = useState(0);
  return (
    <View>
      <Text>{title}</Text>
      <Button title="+" onPress={() => setCount(count + 1)} />
    </View>
  );
};
```

### 10.8 TypeScriptの型設計の勘所
- **Domain型を先に定義**（FuelLogなど）
- **Input型はOmitで作る**（`Omit<FuelLog, "id">`）
- **null/undefinedを明示**（`string | null`）
- **ユニオン型で状態を表す**（`"idle" | "loading" | "error"`）

### 10.9 Zustandの使い方（超簡易）
- `create()` でストア作成
- `useStore()` で読み取り・更新
- 小規模アプリに向いた軽量設計

例（簡易）：
```
type CounterState = {
  count: number;
  inc: () => void;
};
export const useCounter = create<CounterState>((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}));
```

### 10.10 React Navigationの型付け例
- `ParamList` を定義して `useNavigation` / `useRoute` を型安全に

例（簡易）：
```
type RootStackParamList = {
  Detail: { id: string };
};
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
const route = useRoute<RouteProp<RootStackParamList, "Detail">>();
```

---

## 8. 次にやること（推奨）
- QA（`codex/QA.md`）に沿った動作確認
- UIデザイン調整
- 必要ならPrebuildでAndroid Studio運用へ移行


# Summary Update

## UseCase導入の反映
- Store → UseCase → Repository の依存構造に変更
- Android MVVMに近い責務分離を明確化

## 実装反映
- UseCase追加（Fuel / Maintenance / Expiration / Analytics）
- StoreのRepository直呼びを廃止してUseCase経由へ移行

## 型チェック
- `npx tsc --noEmit` 成功

---

## ファイルの役割（主要）

### アプリ起動
- `mobile/App.tsx`：アプリのエントリ。`bootstrapApp()` を呼び、`RootNavigator` を描画
- `mobile/src/app/bootstrap.ts`：DB・通知初期化、通知同期を実行

### ナビゲーション
- `mobile/src/app/navigation/RootNavigator.tsx`：Stack構成
- `mobile/src/app/navigation/MainTabs.tsx`：タブ構成
- `mobile/src/app/navigation/types.ts`：画面パラメータ定義（型安全な遷移）

### Store（ViewModel相当）
- `mobile/src/app/store/*`：Zustand Store。画面が直接使うAPI

### UseCase
- `mobile/src/features/*/usecases/*`：ユースケース（CRUD/集計/通知）

### Repository（Data）
- `mobile/src/features/*/data/*`：DBアクセス、通知スケジュール

### Domain
- `mobile/src/features/*/domain/*`：型・定数・ルール

### Infrastructure
- `mobile/src/infrastructure/db/*`：SQLite初期化/マイグレーション
- `mobile/src/infrastructure/notifications/*`：通知の権限・スケジュール

### UI
- `mobile/src/features/*/ui/*`：画面とUI
- `mobile/src/shared/components/*`：共通UI

---

## 関係・依存関係（構造）

```
UI (Screen)
  ↓
Store (Zustand / ViewModel)
  ↓
UseCase
  ↓
Repository (DB / Notifications)
  ↓
Infrastructure (SQLite / Expo Notifications)
```

---

## データフロー（例）

### 給油記録の追加
1. `FuelLogCreateScreen` が `useFuelStore.create()` を呼ぶ
2. Store が `createFuelLog()` UseCase を実行
3. UseCase が `FuelRepository.create()` を呼ぶ
4. Repository が SQLite に INSERT
5. Store が `getFuelLogs()` で再取得 → UI再描画

### 期限の更新
1. `ExpirationEditScreen` が `useExpirationStore.upsert()` を呼ぶ
2. Store が `upsertExpiration()` UseCase を実行
3. UseCase が Repository へ委譲
4. Repository が DB更新 + 通知スケジュール
5. Store が一覧を再取得 → UI再描画
