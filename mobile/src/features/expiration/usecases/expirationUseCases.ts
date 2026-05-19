import { ExpirationRepository } from '../data/ExpirationRepository';
import { ExpirationItem, ExpirationType } from '../domain/types';

// 期限一覧取得
export const getExpirationItems = async (): Promise<ExpirationItem[]> => {
  return ExpirationRepository.list();
};

// 種別で期限取得
export const getExpirationByType = async (type: ExpirationType): Promise<ExpirationItem | null> => {
  return ExpirationRepository.getByType(type);
};

// 期限の作成/更新
export const upsertExpiration = async (
  type: ExpirationType,
  expirationDate: string,
  options?: { notificationsEnabled?: boolean },
): Promise<ExpirationItem> => {
  return ExpirationRepository.upsert(type, expirationDate, options);
};
