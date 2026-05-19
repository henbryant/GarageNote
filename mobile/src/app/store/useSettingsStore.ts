import { create } from 'zustand';
import { ExpirationRepository } from '../../features/expiration/data/ExpirationRepository';
import {
  cancelExpirationNotification,
  getNotificationPermission,
  scheduleExpirationNotification,
} from '../../infrastructure/notifications/notifications';
import { ExpirationType } from '../../features/expiration/domain/types';

type FuelUnit = 'kmPerL' | 'lPer100km';
type PermissionStatus = 'granted' | 'denied' | 'undetermined';

type SettingsState = {
  notificationsEnabled: boolean;
  fuelUnit: FuelUnit;
  permissionStatus: PermissionStatus;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setFuelUnit: (unit: FuelUnit) => void;
  refreshPermissionStatus: () => Promise<void>;
};

const labels: Record<ExpirationType, string> = {
  vehicleInspection: '車検',
  insurance: '保険',
  tireReplacement: 'タイヤ交換',
};

export const useSettingsStore = create<SettingsState>((set) => ({
  notificationsEnabled: true,
  fuelUnit: 'kmPerL',
  permissionStatus: 'undetermined',
  setNotificationsEnabled: async (enabled) => {
    // 権限がない場合はONにできない
    if (enabled) {
      const status = await getNotificationPermission();
      if (status !== 'granted') {
        set({ notificationsEnabled: false, permissionStatus: status });
        return;
      }
    }
    set({ notificationsEnabled: enabled });
    const items = await ExpirationRepository.list();
    if (!enabled) {
      // OFF時は全通知キャンセル
      await Promise.all(items.map((item) => cancelExpirationNotification(item.id)));
      return;
    }
    // ON時は全通知を再スケジュール
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
  },
  setFuelUnit: (unit) => set({ fuelUnit: unit }),
  refreshPermissionStatus: async () => {
    const status = await getNotificationPermission();
    set({ permissionStatus: status });
  },
}));
