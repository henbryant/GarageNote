import { AnalyticsRepository } from '../data/AnalyticsRepository';
import { MonthlySummary } from '../domain/types';

// 単月の集計取得
export const getMonthlySummary = async (month: string): Promise<MonthlySummary> => {
  return AnalyticsRepository.getMonthlySummary(month);
};

// 期間内の月次系列取得
export const getMonthlySeries = async (range: { from: string; to: string }): Promise<MonthlySummary[]> => {
  return AnalyticsRepository.getMonthlySeries(range);
};
