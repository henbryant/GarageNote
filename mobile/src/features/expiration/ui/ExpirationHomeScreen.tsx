import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Screen } from '../../../shared/components/Screen';
import { useExpirationStore } from '../../../app/store/useExpirationStore';
import { RootStackParamList } from '../../../app/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ExpirationType } from '../domain/types';

const labels: Record<ExpirationType, string> = {
  vehicleInspection: '車検',
  insurance: '保険',
  tireReplacement: 'タイヤ交換',
};

const daysUntil = (dateString: string) => {
  const today = new Date();
  const target = new Date(dateString);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};

export const ExpirationHomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { items, load } = useExpirationStore();

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  // 種別ごとの期限情報を取得
  const getItem = (type: ExpirationType) => items.find((item) => item.type === type);

  return (
    <Screen>
      {(['vehicleInspection', 'insurance', 'tireReplacement'] as ExpirationType[]).map((type) => {
        const item = getItem(type);
        return (
          <TouchableOpacity key={type} onPress={() => navigation.navigate('ExpirationEdit', { type })}>
            <View style={styles.card}>
              <Text style={styles.title}>{labels[type]}</Text>
              <Text style={styles.meta}>{item?.expirationDate ?? '未設定'}</Text>
              {item?.expirationDate ? (
                <>
                  <Text style={styles.meta}>リマインド: {item.reminderDate}</Text>
                  <Text style={[styles.meta, daysUntil(item.expirationDate) < 0 && styles.expired]}>
                    {daysUntil(item.expirationDate) < 0
                      ? '期限切れ'
                      : `残り ${daysUntil(item.expirationDate)} 日`}
                  </Text>
                </>
              ) : null}
            </View>
          </TouchableOpacity>
        );
      })}
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    color: '#666',
    marginTop: 4,
  },
  expired: {
    color: '#dc2626',
    fontWeight: '600',
  },
});
