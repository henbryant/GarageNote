import { create } from 'zustand';
import { MonthlySummary } from '../../features/analytics/domain/types';
import { getMonthlySeries, getMonthlySummary } from '../../features/analytics/usecases/analyticsUseCases';

type AnalyticsState = {
  summary: MonthlySummary | null;
  series: MonthlySummary[];
  loading: boolean;
  loadSummary: (month: string) => Promise<void>;
  loadSeries: (range: { from: string; to: string }) => Promise<void>;
};

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  summary: null,
  series: [],
  loading: false,
  loadSummary: async (month) => {
    set({ loading: true });
    // 単月の集計取得
    const summary = await getMonthlySummary(month);
    set({ summary, loading: false });
  },
  loadSeries: async (range) => {
    set({ loading: true });
    // 期間内の月次系列取得
    const series = await getMonthlySeries(range);
    set({ series, loading: false });
  },
}));
