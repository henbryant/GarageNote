import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './MainTabs';
import { RootStackParamList } from './types';
import { FuelLogCreateScreen } from '../../features/fuel/ui/FuelLogCreateScreen';
import { FuelLogDetailScreen } from '../../features/fuel/ui/FuelLogDetailScreen';
import { FuelLogEditScreen } from '../../features/fuel/ui/FuelLogEditScreen';
import { MaintenanceLogCreateScreen } from '../../features/maintenance/ui/MaintenanceLogCreateScreen';
import { MaintenanceLogDetailScreen } from '../../features/maintenance/ui/MaintenanceLogDetailScreen';
import { MaintenanceLogEditScreen } from '../../features/maintenance/ui/MaintenanceLogEditScreen';
import { ExpirationEditScreen } from '../../features/expiration/ui/ExpirationEditScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* メインタブ（記録/期限/分析/設定） */}
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        {/* 詳細/作成/編集はStackで遷移 */}
        <Stack.Screen name="FuelLogDetail" component={FuelLogDetailScreen} options={{ title: '給油詳細' }} />
        <Stack.Screen name="FuelLogCreate" component={FuelLogCreateScreen} options={{ title: '給油を追加' }} />
        <Stack.Screen name="FuelLogEdit" component={FuelLogEditScreen} options={{ title: '給油を編集' }} />
        <Stack.Screen name="MaintenanceLogDetail" component={MaintenanceLogDetailScreen} options={{ title: '整備詳細' }} />
        <Stack.Screen
          name="MaintenanceLogCreate"
          component={MaintenanceLogCreateScreen}
          options={{ title: '整備を追加' }}
        />
        <Stack.Screen
          name="MaintenanceLogEdit"
          component={MaintenanceLogEditScreen}
          options={{ title: '整備を編集' }}
        />
        <Stack.Screen name="ExpirationEdit" component={ExpirationEditScreen} options={{ title: '期限を編集' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
