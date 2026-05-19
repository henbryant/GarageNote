export const toDateOnlyString = (date: Date) => date.toISOString().split('T')[0];

export const addDays = (dateString: string, days: number) => {
  const base = new Date(dateString);
  const result = new Date(base);
  result.setDate(base.getDate() + days);
  return toDateOnlyString(result);
};
