import { create } from 'zustand';
import { FuelLog, FuelLogInput } from '../../features/fuel/domain/types';
import { createFuelLog, deleteFuelLog, getFuelLogs, updateFuelLog } from '../../features/fuel/usecases/fuelUseCases';

type FuelState = {
  items: FuelLog[];
  loading: boolean;
  load: () => Promise<void>;
  create: (input: FuelLogInput) => Promise<void>;
  update: (id: string, input: FuelLogInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export const useFuelStore = create<FuelState>((set) => ({
  items: [],
  loading: false,
  load: async () => {
    set({ loading: true });
    // 一覧取得（UseCase経由）
    const items = await getFuelLogs();
    set({ items, loading: false });
  },
  create: async (input) => {
    set({ loading: true });
    await createFuelLog(input);
    const items = await getFuelLogs();
    set({ items, loading: false });
  },
  update: async (id, input) => {
    set({ loading: true });
    await updateFuelLog(id, input);
    const items = await getFuelLogs();
    set({ items, loading: false });
  },
  remove: async (id) => {
    set({ loading: true });
    await deleteFuelLog(id);
    const items = await getFuelLogs();
    set({ items, loading: false });
  },
}));
