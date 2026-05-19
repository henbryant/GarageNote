import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Screen } from '../../../shared/components/Screen';
import { useSettingsStore } from '../../../app/store/useSettingsStore';

export const SettingsHomeScreen = () => {
  const { notificationsEnabled, fuelUnit, permissionStatus, setFuelUnit, setNotificationsEnabled, refreshPermissionStatus } =
    useSettingsStore();

  useFocusEffect(
    useCallback(() => {
      refreshPermissionStatus();
    }, [refreshPermissionStatus]),
  );

  return (
    <Screen>
      <View style={styles.section}>
        <Text style={styles.title}>通知</Text>
        {permissionStatus !== 'granted' ? (
          <Text style={styles.warning}>通知が許可されていません。端末設定で許可してください。</Text>
        ) : null}
        <View style={styles.row}>
          <Text>期限リマインド</Text>
          <Switch value={notificationsEnabled} onValueChange={(value) => void setNotificationsEnabled(value)} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>燃費単位</Text>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => setFuelUnit('kmPerL')}>
            <Text style={[styles.chip, fuelUnit === 'kmPerL' && styles.chipActive]}>km/L</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFuelUnit('lPer100km')}>
            <Text style={[styles.chip, fuelUnit === 'lPer100km' && styles.chipActive]}>L/100km</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  warning: {
    color: '#d97706',
    marginBottom: 8,
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
});
