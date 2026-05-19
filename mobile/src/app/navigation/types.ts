export type RootStackParamList = {
  MainTabs: undefined;
  FuelLogDetail: { id: string };
  FuelLogCreate: undefined;
  FuelLogEdit: { id: string };
  MaintenanceLogDetail: { id: string };
  MaintenanceLogCreate: undefined;
  MaintenanceLogEdit: { id: string };
  ExpirationEdit: { type?: 'vehicleInspection' | 'insurance' | 'tireReplacement' } | undefined;
};

export type MainTabParamList = {
  LogsTab: undefined;
  ExpirationTab: undefined;
  AnalyticsTab: undefined;
  SettingsTab: undefined;
};

export type LogsStackParamList = {
  LogsHome: undefined;
  FuelLogDetail: { id: string };
  MaintenanceLogDetail: { id: string };
};
