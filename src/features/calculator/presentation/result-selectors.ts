import type { CalculationResult, ProductCycleTotal, RuleCalculation, WeekCalculation } from '@/domain/calculation/types';
import type { ApplicationType } from '@/domain/nutrition/types';
export type WeekProjection = { readonly status: 'FOUND'; readonly week: WeekCalculation } | { readonly status: 'UNKNOWN_WEEK' };
export function selectWeek(result: CalculationResult, stageId: string, weekNumber: number): WeekProjection {
  const week = result.weeks.find(week => week.stageId === stageId && week.weekNumber === weekNumber);
  return week ? { status: 'FOUND', week } : { status: 'UNKNOWN_WEEK' };
}
export function selectStageWeeks(result: CalculationResult, stageId: string): readonly WeekCalculation[] { return result.weeks.filter(week => week.stageId === stageId); }
export type ActiveEntry = Extract<RuleCalculation, { status: 'ACTIVE' }>;
export function selectApplicationEntries(week: WeekCalculation, via: ApplicationType): readonly ActiveEntry[] {
  return week.entries.filter((entry): entry is ActiveEntry => entry.status === 'ACTIVE' && entry.applicationType === via);
}
export function selectProductTotals(result: CalculationResult): readonly ProductCycleTotal[] { return result.productTotals; }

export function frequencyLabel(entry: ActiveEntry): string {
  const count = entry.effectiveApplicationsPerWeek;
  const noun = entry.applicationType === 'FOLIAR'
    ? (count === 1 ? 'aplicação foliar' : 'aplicações foliares')
    : (count === 1 ? 'fertirrigação' : 'fertirrigações');
  return `${count} ${noun} ${entry.frequency.mode === 'FIXED_PER_WEEK' ? 'nesta semana (frequência prescrita)' : 'por semana (frequência planejada)'}`;
}
