export type MaintenanceLog = {
  id: string;
  maintenanceType: string;
  date: string;
  mileage: number;
  cost: number;
  memo?: string | null;
  photoUri?: string | null;
  createdAt: string;
};

export type MaintenanceLogInput = Omit<MaintenanceLog, 'id' | 'createdAt'>;
