import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../../shared/components/Screen';
import { useAnalyticsStore } from '../../../app/store/useAnalyticsStore';
import { toDateOnlyString } from '../../../shared/utils/date';
import { PieChart } from './components/PieChart';

export const MonthlyAnalyticsScreen = () => {
  const { summary, series, loadSummary, loadSeries } = useAnalyticsStore();

  useFocusEffect(
    useCallback(() => {
      // 当月の集計と系列を取得
      const now = new Date();
      const month = toDateOnlyString(now).slice(0, 7);
      const start = `${month}-01`;
      const end = toDateOnlyString(now);
      loadSummary(month);
      loadSeries({ from: `${month}-01`, to: end });
    }, [loadSummary, loadSeries]),
  );

  return (
    <Screen>
      <Text style={styles.title}>月間費用</Text>
      <View style={styles.card}>
        <Text>給油: ¥{summary?.fuelCostTotal ?? 0}</Text>
        <Text>整備: ¥{summary?.maintenanceCostTotal ?? 0}</Text>
        <Text>合計: ¥{summary?.totalCost ?? 0}</Text>
      </View>

      <Text style={styles.title}>内訳（円グラフ）</Text>
      <View style={styles.chartRow}>
        <PieChart
          slices={[
            { value: summary?.fuelCostTotal ?? 0, color: '#3b82f6' },
            { value: summary?.maintenanceCostTotal ?? 0, color: '#10b981' },
          ]}
        />
        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
            <Text>給油</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
            <Text>整備</Text>
          </View>
        </View>
      </View>

      <Text style={styles.title}>月次トレンド</Text>
      {series.length === 0 ? (
        <Text style={styles.empty}>データがありません</Text>
      ) : (
        series.map((item) => (
          <View key={item.month} style={styles.row}>
            <Text style={styles.month}>{item.month}</Text>
            <Text style={styles.amount}>¥{item.totalCost}</Text>
          </View>
        ))
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  empty: {
    color: '#666',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  legend: {
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  month: {
    fontWeight: '600',
  },
  amount: {
    color: '#333',
  },
});
