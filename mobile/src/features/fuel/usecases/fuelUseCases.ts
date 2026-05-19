import { FuelRepository } from '../data/FuelRepository';
import { FuelLog, FuelLogInput } from '../domain/types';

// FuelLog一覧取得
export const getFuelLogs = async (): Promise<FuelLog[]> => {
  return FuelRepository.list();
};

// FuelLog単体取得
export const getFuelLogById = async (id: string): Promise<FuelLog | null> => {
  return FuelRepository.get(id);
};

// FuelLog作成
export const createFuelLog = async (input: FuelLogInput): Promise<FuelLog> => {
  return FuelRepository.create(input);
};

// FuelLog更新
export const updateFuelLog = async (id: string, input: FuelLogInput): Promise<FuelLog> => {
  return FuelRepository.update(id, input);
};

// FuelLog削除
export const deleteFuelLog = async (id: string): Promise<void> => {
  return FuelRepository.remove(id);
};
