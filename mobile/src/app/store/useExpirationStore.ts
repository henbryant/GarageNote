import { create } from 'zustand';
import { ExpirationItem, ExpirationType } from '../../features/expiration/domain/types';
import { useSettingsStore } from './useSettingsStore';
import { getExpirationItems, upsertExpiration } from '../../features/expiration/usecases/expirationUseCases';

type ExpirationState = {
  items: ExpirationItem[];
  loading: boolean;
  load: () => Promise<void>;
  upsert: (type: ExpirationType, expirationDate: string) => Promise<void>;
};

export const useExpirationStore = create<ExpirationState>((set) => ({
  items: [],
  loading: false,
  load: async () => {
    set({ loading: true });
    // 期限一覧取得（UseCase経由）
    const items = await getExpirationItems();
    set({ items, loading: false });
  },
  upsert: async (type, expirationDate) => {
    set({ loading: true });
    // 通知ON/OFFはSettingsの状態に従う
    const notificationsEnabled = useSettingsStore.getState().notificationsEnabled;
    await upsertExpiration(type, expirationDate, { notificationsEnabled });
    const items = await getExpirationItems();
    set({ items, loading: false });
  },
}));
