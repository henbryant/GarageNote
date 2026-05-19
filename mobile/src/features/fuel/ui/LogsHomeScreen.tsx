import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Screen } from '../../../shared/components/Screen';
import { useFuelStore } from '../../../app/store/useFuelStore';
import { useMaintenanceStore } from '../../../app/store/useMaintenanceStore';
import { RootStackParamList } from '../../../app/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const LogsHomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const fuelStore = useFuelStore();
  const maintenanceStore = useMaintenanceStore();

  useFocusEffect(
    useCallback(() => {
      // 画面表示時に最新の一覧を取得
      fuelStore.load();
      maintenanceStore.load();
    }, [fuelStore, maintenanceStore]),
  );

  return (
    <Screen>
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>給油記録</Text>
          <TouchableOpacity onPress={() => navigation.navigate('FuelLogCreate')}>
            <Text style={styles.link}>追加</Text>
          </TouchableOpacity>
        </View>
        {fuelStore.items.length === 0 ? (
          <Text style={styles.empty}>給油記録がありません</Text>
        ) : (
          <FlatList
            data={fuelStore.items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('FuelLogDetail', { id: item.id })}>
                <View style={styles.listItem}>
                  <Text style={styles.itemTitle}>{item.date}</Text>
                  <Text style={styles.itemMeta}>
                    {item.mileage} km / {item.fuelAmount} L / ¥{item.fuelCost}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>整備記録</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MaintenanceLogCreate')}>
            <Text style={styles.link}>追加</Text>
          </TouchableOpacity>
        </View>
        {maintenanceStore.items.length === 0 ? (
          <Text style={styles.empty}>整備記録がありません</Text>
        ) : (
          <FlatList
            data={maintenanceStore.items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('MaintenanceLogDetail', { id: item.id })}>
                <View style={styles.listItem}>
                  <Text style={styles.itemTitle}>{item.date}</Text>
                  <Text style={styles.itemMeta}>
                    {item.maintenanceType} / {item.mileage} km / ¥{item.cost}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    color: '#007aff',
  },
  empty: {
    color: '#666',
  },
  listItem: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  itemTitle: {
    fontSize: 16,
  },
  itemMeta: {
    color: '#666',
    marginTop: 2,
  },
});
