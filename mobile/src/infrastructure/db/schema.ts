export const schemaVersion = 1;

export const migrations: Record<number, string[]> = {
  1: [
    `CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY,
      name TEXT,
      created_at TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS fuel_logs (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      mileage INTEGER NOT NULL,
      fuel_amount REAL NOT NULL,
      fuel_cost INTEGER NOT NULL,
      fuel_type TEXT NOT NULL,
      fuel_efficiency REAL,
      created_at TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS maintenance_logs (
      id TEXT PRIMARY KEY,
      maintenance_type TEXT NOT NULL,
      date TEXT NOT NULL,
      mileage INTEGER NOT NULL,
      cost INTEGER NOT NULL,
      memo TEXT,
      photo_uri TEXT,
      created_at TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS expiration_items (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL UNIQUE,
      expiration_date TEXT NOT NULL,
      reminder_date TEXT NOT NULL,
      created_at TEXT NOT NULL
    );`,
    `CREATE INDEX IF NOT EXISTS idx_fuel_logs_date ON fuel_logs(date);`,
    `CREATE INDEX IF NOT EXISTS idx_maintenance_logs_date ON maintenance_logs(date);`,
    `CREATE INDEX IF NOT EXISTS idx_expiration_items_type ON expiration_items(type);`,
  ],
};
