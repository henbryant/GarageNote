import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../../../shared/components/Screen';
import { useExpirationStore } from '../../../app/store/useExpirationStore';
import { ExpirationType } from '../domain/types';
import { RootStackParamList } from '../../../app/navigation/types';

const labels: Record<ExpirationType, string> = {
  vehicleInspection: '車検',
  insurance: '保険',
  tireReplacement: 'タイヤ交換',
};

export const ExpirationEditScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { upsert } = useExpirationStore();
  const route = useRoute<RouteProp<RootStackParamList, 'ExpirationEdit'>>();
  const [type, setType] = useState<ExpirationType>(route.params?.type ?? 'vehicleInspection');
  const [date, setDate] = useState('');

  const onSubmit = async () => {
    if (!date) {
      Alert.alert('入力エラー', '期限日を入力してください。');
      return;
    }
    await upsert(type, date);
    navigation.goBack();
  };

  return (
    <Screen>
      <View style={styles.block}>
        <Text style={styles.label}>種類</Text>
        <View style={styles.row}>
          {(['vehicleInspection', 'insurance', 'tireReplacement'] as ExpirationType[]).map((key) => (
            <TouchableOpacity key={key} onPress={() => setType(key)}>
              <Text style={[styles.chip, type === key && styles.chipActive]}>{labels[key]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>期限日 (YYYY-MM-DD)</Text>
        <TextInput style={styles.input} value={date} onChangeText={setDate} />
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
