import { enableScreens } from 'react-native-screens';
import { initializeDatabase } from '../infrastructure/db/database';
import { initializeNotifications } from '../infrastructure/notifications/notifications';
import { syncExpirationNotifications } from './notifications/syncExpirationNotifications';

export const bootstrapApp = async () => {
  // 画面のパフォーマンス最適化（RN Screens）
  enableScreens();
  // DB初期化（スキーマ適用）
  await initializeDatabase();
  // 通知権限の初期化
  await initializeNotifications();
  // 期限通知の再同期
  await syncExpirationNotifications();
};
