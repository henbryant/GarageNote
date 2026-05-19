import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../../../shared/components/Screen';
import { RootStackParamList } from '../../../app/navigation/types';
import { useFuelStore } from '../../../app/store/useFuelStore';

export const FuelLogDetailScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'FuelLogDetail'>>();
  const { id } = route.params;
  const { items, load, remove } = useFuelStore();
  const item = items.find((log) => log.id === id);

  useEffect(() => {
    if (!item) {
      load();
    }
  }, [item, load]);

  if (!item) {
    return (
      <Screen>
        <Text>読み込み中...</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.block}>
        <Text style={styles.label}>日付</Text>
        <Text>{item.date}</Text>
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>走行距離</Text>
        <Text>{item.mileage} km</Text>
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>給油量</Text>
        <Text>{item.fuelAmount} L</Text>
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>金額</Text>
        <Text>¥{item.fuelCost}</Text>
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>燃料種別</Text>
        <Text>{item.fuelType}</Text>
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>燃費</Text>
        <Text>{item.fuelEfficiency ? `${item.fuelEfficiency} km/L` : '-'}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => navigation.navigate('FuelLogEdit', { id })}>
          <Text style={styles.link}>編集</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Alert.alert('削除しますか？', 'この給油記録を削除します。', [
              { text: 'キャンセル', style: 'cancel' },
              {
                text: '削除',
                style: 'destructive',
                onPress: async () => {
                  await remove(id);
                  navigation.goBack();
                },
              },
            ])
          }
        >
          <Text style={styles.delete}>削除</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  block: {
    marginBottom: 12,
  },
  label: {
    color: '#666',
    marginBottom: 4,
  },
  buttonRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: {
    color: '#007aff',
  },
  delete: {
    color: '#ff3b30',
  },
});
