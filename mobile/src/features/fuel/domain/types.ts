export type FuelType = 'regular' | 'premium' | 'diesel';

export type FuelLog = {
  id: string;
  date: string;
  mileage: number;
  fuelAmount: number;
  fuelCost: number;
  fuelType: FuelType;
  fuelEfficiency?: number | null;
  createdAt: string;
};

export type FuelLogInput = Omit<FuelLog, 'id' | 'createdAt' | 'fuelEfficiency'>;
