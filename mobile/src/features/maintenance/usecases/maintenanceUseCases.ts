import { MaintenanceRepository } from '../data/MaintenanceRepository';
import { MaintenanceLog, MaintenanceLogInput } from '../domain/types';

// MaintenanceLog一覧取得
export const getMaintenanceLogs = async (): Promise<MaintenanceLog[]> => {
  return MaintenanceRepository.list();
};

// MaintenanceLog単体取得
export const getMaintenanceLogById = async (id: string): Promise<MaintenanceLog | null> => {
  return MaintenanceRepository.get(id);
};

// MaintenanceLog作成
export const createMaintenanceLog = async (input: MaintenanceLogInput): Promise<MaintenanceLog> => {
  return MaintenanceRepository.create(input);
};

// MaintenanceLog更新
export const updateMaintenanceLog = async (id: string, input: MaintenanceLogInput): Promise<MaintenanceLog> => {
  return MaintenanceRepository.update(id, input);
};

// MaintenanceLog削除
export const deleteMaintenanceLog = async (id: string): Promise<void> => {
  return MaintenanceRepository.remove(id);
};
