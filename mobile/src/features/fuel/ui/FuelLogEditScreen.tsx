import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../../../shared/components/Screen';
import { RootStackParamList } from '../../../app/navigation/types';
import { useFuelStore } from '../../../app/store/useFuelStore';
import { FuelType } from '../domain/types';

export const FuelLogEditScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'FuelLogEdit'>>();
  const { id } = route.params;
  const { items, load, update } = useFuelStore();
  const item = items.find((log) => log.id === id);

  const [date, setDate] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelAmount, setFuelAmount] = useState('');
  const [fuelCost, setFuelCost] = useState('');
  const [fuelType, setFuelType] = useState<FuelType>('regular');

  useEffect(() => {
    if (!item) {
      load();
      return;
    }
    setDate(item.date);
    setMileage(String(item.mileage));
    setFuelAmount(String(item.fuelAmount));
    setFuelCost(String(item.fuelCost));
    setFuelType(item.fuelType);
  }, [item, load]);

  const onSubmit = async () => {
    const mileageValue = Number(mileage);
    const fuelAmountValue = Number(fuelAmount);
    const fuelCostValue = Number(fuelCost);
    if (!date || mileageValue <= 0 || fuelAmountValue <= 0 || fuelCostValue <= 0) {
      Alert.alert('入力エラー', '日付、走行距離、給油量、金額を正しく入力してください。');
      return;
    }
    await update(id, {
      date,
      mileage: mileageValue,
      fuelAmount: fuelAmountValue,
      fuelCost: fuelCostValue,
      fuelType,
    });
    navigation.goBack();
  };

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
        <Text style={styles.label}>日付 (YYYY-MM-DD)</Text>
        <TextInput style={styles.input} value={date} onChangeText={setDate} />
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>走行距離 (km)</Text>
        <TextInput style={styles.input} value={mileage} onChangeText={setMileage} keyboardType="numeric" />
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>給油量 (L)</Text>
        <TextInput style={styles.input} value={fuelAmount} onChangeText={setFuelAmount} keyboardType="numeric" />
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>金額 (円)</Text>
        <TextInput style={styles.input} value={fuelCost} onChangeText={setFuelCost} keyboardType="numeric" />
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>燃料種別</Text>
        <View style={styles.row}>
          {(['regular', 'premium', 'diesel'] as FuelType[]).map((type) => (
            <TouchableOpacity key={type} onPress={() => setFuelType(type)}>
              <Text style={[styles.chip, fuelType === type && styles.chipActive]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>保存</Text>
      </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
  },
  chipActive: {
    backgroundColor: '#007aff',
    color: '#fff',
    borderColor: '#007aff',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#007aff',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
