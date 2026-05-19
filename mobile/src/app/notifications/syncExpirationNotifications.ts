import { ExpirationRepository } from '../../features/expiration/data/ExpirationRepository';
import {
  cancelExpirationNotification,
  getNotificationPermission,
  scheduleExpirationNotification,
} from '../../infrastructure/notifications/notifications';
import { useSettingsStore } from '../store/useSettingsStore';
import { ExpirationType } from '../../features/expiration/domain/types';

const labels: Record<ExpirationType, string> = {
  vehicleInspection: '車検',
  insurance: '保険',
  tireReplacement: 'タイヤ交換',
};

export const syncExpirationNotifications = async () => {
  const { notificationsEnabled } = useSettingsStore.getState();
  const items = await ExpirationRepository.list();
  if (!notificationsEnabled) {
    await Promise.all(items.map((item) => cancelExpirationNotification(item.id)));
    return;
  }
  const permission = await getNotificationPermission();
  if (permission !== 'granted') {
    await Promise.all(items.map((item) => cancelExpirationNotification(item.id)));
    return;
  }
  await Promise.all(
    items.map((item) =>
      scheduleExpirationNotification(
        item.id,
        '期限リマインド',
        item.reminderDate,
        `${labels[item.type]}の期限が近づいています`,
      ),
    ),
  );
};
