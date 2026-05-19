export type ExpirationType = 'vehicleInspection' | 'insurance' | 'tireReplacement';

export type ExpirationItem = {
  id: string;
  type: ExpirationType;
  expirationDate: string;
  reminderDate: string;
  createdAt: string;
};
