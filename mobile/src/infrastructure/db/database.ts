import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';
import { migrations, schemaVersion } from './schema';

let database: SQLiteDatabase | null = null;

const getDatabase = async () => {
  if (!database) {
    database = await openDatabaseAsync('garagenote.db');
  }
  return database;
};

export const executeQuery = async <T>(sql: string, params: any[] = []) => {
  // SELECT系（結果を配列で返す）
  const db = await getDatabase();
  return db.getAllAsync<T>(sql, params as any);
};

export const executeRun = async (sql: string, params: any[] = []) => {
  // INSERT/UPDATE/DELETE系
  const db = await getDatabase();
  return db.runAsync(sql, params as any);
};

const getUserVersion = async () => {
  const rows = await executeQuery<{ user_version?: number }>('PRAGMA user_version;');
  return rows[0]?.user_version ?? 0;
};

const setUserVersion = async (version: number) => {
  await executeRun(`PRAGMA user_version = ${version};`);
};

const applyMigrations = async () => {
  const currentVersion = await getUserVersion();
  if (currentVersion >= schemaVersion) {
    return;
  }

  for (let version = currentVersion + 1; version <= schemaVersion; version += 1) {
    const statements = migrations[version] ?? [];
    for (const statement of statements) {
      await executeRun(statement);
    }
    await setUserVersion(version);
  }
};

export const initializeDatabase = async () => {
  await executeRun('PRAGMA foreign_keys = ON;');
  await applyMigrations();
};

export { getDatabase };
