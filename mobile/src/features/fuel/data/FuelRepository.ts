import { executeQuery, executeRun } from '../../../infrastructure/db/database';
import { createId } from '../../../shared/utils/id';
import { FuelLog, FuelLogInput } from '../domain/types';

const mapRow = (row: any): FuelLog => ({
  id: row.id,
  date: row.date,
  mileage: row.mileage,
  fuelAmount: row.fuel_amount,
  fuelCost: row.fuel_cost,
  fuelType: row.fuel_type,
  fuelEfficiency: row.fuel_efficiency,
  createdAt: row.created_at,
});

const getPreviousMileage = async (mileage: number) => {
  const rows = await executeQuery<{ mileage: number }>(
    `SELECT mileage FROM fuel_logs WHERE mileage < ? ORDER BY mileage DESC LIMIT 1;`,
    [mileage],
  );
  if (rows.length === 0) return null;
  return rows[0].mileage;
};

const calculateEfficiency = (previousMileage: number | null, currentMileage: number, fuelAmount: number) => {
  if (previousMileage === null) return null;
  const distance = currentMileage - previousMileage;
  if (distance <= 0 || fuelAmount <= 0) return null;
  return Number((distance / fuelAmount).toFixed(2));
};

export const FuelRepository = {
  async list(): Promise<FuelLog[]> {
    const rows = await executeQuery<any>(`SELECT * FROM fuel_logs ORDER BY date DESC, created_at DESC;`);
    const logs = rows.map(mapRow);
    if (logs.length === 0) return logs;
    const sorted = [...logs].sort((a, b) => a.mileage - b.mileage);
    const efficiencyMap = new Map<string, number | null>();
    let previous: FuelLog | null = null;
    for (const log of sorted) {
      if (!previous) {
        efficiencyMap.set(log.id, null);
      } else {
        const distance = log.mileage - previous.mileage;
        const value = distance > 0 && log.fuelAmount > 0 ? Number((distance / log.fuelAmount).toFixed(2)) : null;
        efficiencyMap.set(log.id, value);
      }
      previous = log;
    }
    return logs.map((log) => ({ ...log, fuelEfficiency: efficiencyMap.get(log.id) ?? null }));
  },

  async get(id: string): Promise<FuelLog | null> {
    const all = await FuelRepository.list();
    return all.find((log) => log.id === id) ?? null;
  },

  async create(input: FuelLogInput): Promise<FuelLog> {
    const id = createId();
    const createdAt = new Date().toISOString();
    const previousMileage = await getPreviousMileage(input.mileage);
    const fuelEfficiency = calculateEfficiency(previousMileage, input.mileage, input.fuelAmount);
    await executeRun(
      `INSERT INTO fuel_logs (id, date, mileage, fuel_amount, fuel_cost, fuel_type, fuel_efficiency, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        id,
        input.date,
        input.mileage,
        input.fuelAmount,
        input.fuelCost,
        input.fuelType,
        fuelEfficiency,
        createdAt,
      ],
    );
    return {
      id,
      createdAt,
      fuelEfficiency,
      ...input,
    };
  },

  async update(id: string, input: FuelLogInput): Promise<FuelLog> {
    const previousMileage = await getPreviousMileage(input.mileage);
    const fuelEfficiency = calculateEfficiency(previousMileage, input.mileage, input.fuelAmount);
    await executeRun(
      `UPDATE fuel_logs
       SET date = ?, mileage = ?, fuel_amount = ?, fuel_cost = ?, fuel_type = ?, fuel_efficiency = ?
       WHERE id = ?;`,
      [
        input.date,
        input.mileage,
        input.fuelAmount,
        input.fuelCost,
        input.fuelType,
        fuelEfficiency,
        id,
      ],
    );
    const updated = await FuelRepository.get(id);
    if (!updated) {
      throw new Error('Fuel log not found after update');
    }
    return updated;
  },

  async remove(id: string): Promise<void> {
    await executeRun(`DELETE FROM fuel_logs WHERE id = ?;`, [id]);
  },
};
