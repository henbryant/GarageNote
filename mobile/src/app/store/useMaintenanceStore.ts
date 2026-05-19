import { create } from 'zustand';
import { MaintenanceLog, MaintenanceLogInput } from '../../features/maintenance/domain/types';
import {
  createMaintenanceLog,
  deleteMaintenanceLog,
  getMaintenanceLogs,
  updateMaintenanceLog,
} from '../../features/maintenance/usecases/maintenanceUseCases';

type MaintenanceState = {
  items: MaintenanceLog[];
  loading: boolean;
  load: () => Promise<void>;
  create: (input: MaintenanceLogInput) => Promise<void>;
  update: (id: string, input: MaintenanceLogInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export const useMaintenanceStore = create<MaintenanceState>((set) => ({
  items: [],
  loading: false,
  load: async () => {
    set({ loading: true });
    // 一覧取得（UseCase経由）
    const items = await getMaintenanceLogs();
    set({ items, loading: false });
  },
  create: async (input) => {
    set({ loading: true });
    await createMaintenanceLog(input);
    const items = await getMaintenanceLogs();
    set({ items, loading: false });
  },
  update: async (id, input) => {
    set({ loading: true });
    await updateMaintenanceLog(id, input);
    const items = await getMaintenanceLogs();
    set({ items, loading: false });
  },
  remove: async (id) => {
    set({ loading: true });
    await deleteMaintenanceLog(id);
    const items = await getMaintenanceLogs();
    set({ items, loading: false });
  },
}));
