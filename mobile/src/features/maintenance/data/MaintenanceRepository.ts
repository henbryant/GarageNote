import { executeQuery, executeRun } from '../../../infrastructure/db/database';
import { createId } from '../../../shared/utils/id';
import { MaintenanceLog, MaintenanceLogInput } from '../domain/types';

const mapRow = (row: any): MaintenanceLog => ({
  id: row.id,
  maintenanceType: row.maintenance_type,
  date: row.date,
  mileage: row.mileage,
  cost: row.cost,
  memo: row.memo,
  photoUri: row.photo_uri,
  createdAt: row.created_at,
});

export const MaintenanceRepository = {
  async list(): Promise<MaintenanceLog[]> {
    const rows = await executeQuery<any>(`SELECT * FROM maintenance_logs ORDER BY date DESC, created_at DESC;`);
    return rows.map(mapRow);
  },

  async get(id: string): Promise<MaintenanceLog | null> {
    const rows = await executeQuery<any>(`SELECT * FROM maintenance_logs WHERE id = ? LIMIT 1;`, [id]);
    if (rows.length === 0) return null;
    return mapRow(rows[0]);
  },

  async create(input: MaintenanceLogInput): Promise<MaintenanceLog> {
    const id = createId();
    const createdAt = new Date().toISOString();
    await executeRun(
      `INSERT INTO maintenance_logs (id, maintenance_type, date, mileage, cost, memo, photo_uri, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [id, input.maintenanceType, input.date, input.mileage, input.cost, input.memo ?? null, input.photoUri ?? null, createdAt],
    );
    return {
      id,
      createdAt,
      ...input,
    };
  },

  async update(id: string, input: MaintenanceLogInput): Promise<MaintenanceLog> {
    await executeRun(
      `UPDATE maintenance_logs
       SET maintenance_type = ?, date = ?, mileage = ?, cost = ?, memo = ?, photo_uri = ?
       WHERE id = ?;`,
      [input.maintenanceType, input.date, input.mileage, input.cost, input.memo ?? null, input.photoUri ?? null, id],
    );
    const updated = await MaintenanceRepository.get(id);
    if (!updated) {
      throw new Error('Maintenance log not found after update');
    }
    return updated;
  },

  async remove(id: string): Promise<void> {
    await executeRun(`DELETE FROM maintenance_logs WHERE id = ?;`, [id]);
  },
};
