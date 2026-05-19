import { executeQuery } from '../../../infrastructure/db/database';
import { MonthlySummary } from '../domain/types';

const buildSummary = (month: string, fuelCostTotal: number, maintenanceCostTotal: number): MonthlySummary => ({
  month,
  fuelCostTotal,
  maintenanceCostTotal,
  totalCost: fuelCostTotal + maintenanceCostTotal,
});

export const AnalyticsRepository = {
  async getMonthlySummary(month: string): Promise<MonthlySummary> {
    const fuelRows = await executeQuery<{ total: number }>(
      `SELECT COALESCE(SUM(fuel_cost), 0) as total FROM fuel_logs WHERE strftime('%Y-%m', date) = ?;`,
      [month],
    );
    const maintenanceRows = await executeQuery<{ total: number }>(
      `SELECT COALESCE(SUM(cost), 0) as total FROM maintenance_logs WHERE strftime('%Y-%m', date) = ?;`,
      [month],
    );
    const fuelTotal = fuelRows[0]?.total ?? 0;
    const maintenanceTotal = maintenanceRows[0]?.total ?? 0;
    return buildSummary(month, fuelTotal, maintenanceTotal);
  },

  async getMonthlySeries(range: { from: string; to: string }): Promise<MonthlySummary[]> {
    const fuelRows = await executeQuery<{ month: string; total: number }>(
      `SELECT strftime('%Y-%m', date) as month, COALESCE(SUM(fuel_cost), 0) as total
       FROM fuel_logs
       WHERE date BETWEEN ? AND ?
       GROUP BY strftime('%Y-%m', date)
       ORDER BY month ASC;`,
      [range.from, range.to],
    );
    const maintenanceRows = await executeQuery<{ month: string; total: number }>(
      `SELECT strftime('%Y-%m', date) as month, COALESCE(SUM(cost), 0) as total
       FROM maintenance_logs
       WHERE date BETWEEN ? AND ?
       GROUP BY strftime('%Y-%m', date)
       ORDER BY month ASC;`,
      [range.from, range.to],
    );

    const fuelMap = new Map<string, number>();
    fuelRows.forEach((row) => fuelMap.set(row.month, row.total));

    const maintenanceMap = new Map<string, number>();
    maintenanceRows.forEach((row) => maintenanceMap.set(row.month, row.total));

    const monthSet = new Set<string>([...fuelMap.keys(), ...maintenanceMap.keys()]);
    const months = Array.from(monthSet).sort();
    return months.map((month) => buildSummary(month, fuelMap.get(month) ?? 0, maintenanceMap.get(month) ?? 0));
  },
};
