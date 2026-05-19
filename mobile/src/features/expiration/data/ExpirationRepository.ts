import { createId } from '../../../shared/utils/id';
import { addDays } from '../../../shared/utils/date';
import { cancelExpirationNotification, scheduleExpirationNotification } from '../../../infrastructure/notifications/notifications';
import { executeQuery, executeRun } from '../../../infrastructure/db/database';
import { ExpirationItem, ExpirationType } from '../domain/types';

const labels: Record<ExpirationType, string> = {
  vehicleInspection: '車検',
  insurance: '保険',
  tireReplacement: 'タイヤ交換',
};

const mapRow = (row: any): ExpirationItem => ({
  id: row.id,
  type: row.type,
  expirationDate: row.expiration_date,
  reminderDate: row.reminder_date,
  createdAt: row.created_at,
});

const getReminderDate = (expirationDate: string) => addDays(expirationDate, -30);

export const ExpirationRepository = {
  async list(): Promise<ExpirationItem[]> {
    const rows = await executeQuery<any>(`SELECT * FROM expiration_items ORDER BY expiration_date ASC;`);
    return rows.map(mapRow);
  },

  async getByType(type: ExpirationType): Promise<ExpirationItem | null> {
    const rows = await executeQuery<any>(`SELECT * FROM expiration_items WHERE type = ? LIMIT 1;`, [type]);
    if (rows.length === 0) return null;
    return mapRow(rows[0]);
  },

  async upsert(
    type: ExpirationType,
    expirationDate: string,
    options?: { notificationsEnabled?: boolean },
  ): Promise<ExpirationItem> {
    const existing = await ExpirationRepository.getByType(type);
    const reminderDate = getReminderDate(expirationDate);
    const createdAt = new Date().toISOString();
    const notificationsEnabled = options?.notificationsEnabled ?? true;

    if (!existing) {
      const id = createId();
      await executeRun(
        `INSERT INTO expiration_items (id, type, expiration_date, reminder_date, created_at)
         VALUES (?, ?, ?, ?, ?);`,
        [id, type, expirationDate, reminderDate, createdAt],
      );
      if (notificationsEnabled) {
        await scheduleExpirationNotification(
          id,
          '期限リマインド',
          reminderDate,
          `${labels[type]}の期限が近づいています`,
        );
      }
      return { id, type, expirationDate, reminderDate, createdAt };
    }

    await executeRun(
      `UPDATE expiration_items SET expiration_date = ?, reminder_date = ? WHERE type = ?;`,
      [expirationDate, reminderDate, type],
    );

    await cancelExpirationNotification(existing.id);
    if (notificationsEnabled) {
      await scheduleExpirationNotification(
        existing.id,
        '期限リマインド',
        reminderDate,
        `${labels[type]}の期限が近づいています`,
      );
    }

    const updated = await ExpirationRepository.getByType(type);
    if (!updated) {
      throw new Error('Expiration item not found after update');
    }
    return updated;
  },
};
