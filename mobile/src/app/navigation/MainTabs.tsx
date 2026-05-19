import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LogsHomeScreen } from '../../features/fuel/ui/LogsHomeScreen';
import { ExpirationHomeScreen } from '../../features/expiration/ui/ExpirationHomeScreen';
import { MonthlyAnalyticsScreen } from '../../features/analytics/ui/MonthlyAnalyticsScreen';
import { SettingsHomeScreen } from '../../features/settings/ui/SettingsHomeScreen';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="LogsTab" component={LogsHomeScreen} options={{ title: '記録' }} />
      <Tab.Screen name="ExpirationTab" component={ExpirationHomeScreen} options={{ title: '期限' }} />
      <Tab.Screen name="AnalyticsTab" component={MonthlyAnalyticsScreen} options={{ title: '分析' }} />
      <Tab.Screen name="SettingsTab" component={SettingsHomeScreen} options={{ title: '設定' }} />
    </Tab.Navigator>
  );
};
