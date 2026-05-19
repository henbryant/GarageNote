import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../../../shared/components/Screen';
import { RootStackParamList } from '../../../app/navigation/types';
import { useMaintenanceStore } from '../../../app/store/useMaintenanceStore';
import { toDateOnlyString } from '../../../shared/utils/date';

export const MaintenanceLogCreateScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { create } = useMaintenanceStore();
  const [date, setDate] = useState(toDateOnlyString(new Date()));
  const [maintenanceType, setMaintenanceType] = useState('');
  const [mileage, setMileage] = useState('');
  const [cost, setCost] = useState('');
  const [memo, setMemo] = useState('');
  const [photoUri, setPhotoUri] = useState('');

  const onSubmit = async () => {
    const mileageValue = Number(mileage);
    const costValue = Number(cost);
    if (!date || !maintenanceType || mileageValue <= 0 || costValue <= 0) {
      Alert.alert('入力エラー', '日付、整備種別、走行距離、金額を正しく入力してください。');
      return;
    }
    await create({
      date,
      maintenanceType,
      mileage: mileageValue,
      cost: costValue,
      memo: memo || null,
      photoUri: photoUri || null,
    });
    navigation.goBack();
  };

  return (
    <Screen>
      <View style={styles.block}>
        <Text style={styles.label}>日付 (YYYY-MM-DD)</Text>
        <TextInput style={styles.input} value={date} onChangeText={setDate} />
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>整備種別</Text>
        <TextInput style={styles.input} value={maintenanceType} onChangeText={setMaintenanceType} />
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>走行距離 (km)</Text>
        <TextInput style={styles.input} value={mileage} onChangeText={setMileage} keyboardType="numeric" />
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>金額 (円)</Text>
        <TextInput style={styles.input} value={cost} onChangeText={setCost} keyboardType="numeric" />
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>メモ</Text>
        <TextInput style={styles.input} value={memo} onChangeText={setMemo} />
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>写真URI（任意）</Text>
        <TextInput style={styles.input} value={photoUri} onChangeText={setPhotoUri} />
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
