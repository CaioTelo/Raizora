import { describe, expect, it } from 'vitest';
import { calculateNutritionPlan } from '@/domain/calculation/calculate-plan';
import { feedingSchedule } from '@/data/brands/plantas-que-curam/schedule';
import { frequencyLabel, selectApplicationEntries, selectProductTotals, selectStageWeeks, selectWeek } from '@/features/calculator/presentation/result-selectors';
import { deepFreeze, entry, inputFor } from './fixtures';

function result() {
  const response = calculateNutritionPlan(inputFor(feedingSchedule));
  if (response.status !== 'SUCCESS') throw new Error('Fixture failed');
  return deepFreeze(response.result);
}
describe('result projections without arithmetic', () => {
  it('labels EVERY_FERTIGATION as planned using the effective generic count3', () => {
    const rule = entry(result(), 'joker', 'vegetative', 1);
    if (rule.status !== 'ACTIVE') throw new Error('Expected active');
    expect(frequencyLabel(rule)).toBe('3 fertirrigações por semana (frequência planejada)');
    expect(frequencyLabel({ ...rule, effectiveApplicationsPerWeek: 1 })).toBe('1 fertirrigação por semana (frequência planejada)');
  });
  it.each([[1, 1, 'aplicação foliar'], [3, 2, 'aplicações foliares'], [7, 3, 'aplicações foliares']])('preserves prescribed foliar week %d count %d', (week, count, noun) => {
    const rule = entry(result(), 'coringa-blend', 'vegetative', week);
    if (rule.status !== 'ACTIVE') throw new Error('Expected active');
    expect(frequencyLabel(rule)).toBe(`${count} ${noun} nesta semana (frequência prescrita)`);
  });
  it('selects weeks and totals preserving original quantities and references', () => {
    const plan = result();
    const selected = selectWeek(plan, 'vegetative', 4);
    expect(selected.status).toBe('FOUND');
    if (selected.status !== 'FOUND') throw new Error('Expected week');
    expect(selected.week).toBe(plan.weeks[3]);
    expect(selectApplicationEntries(selected.week, 'FERTIGATION')).toEqual([selected.week.entries[0]]);
    expect(selectApplicationEntries(selected.week, 'FOLIAR')).toEqual(selected.week.entries.slice(1, 4));
    expect(selectStageWeeks(plan, 'flowering')).toEqual(plan.weeks.slice(8));
    expect(selectProductTotals(plan)).toBe(plan.productTotals);
  });
  it('diagnoses unknown weeks instead of declaring confirmed empty groups', () => {
    const plan = result();
    expect(selectWeek(plan, 'missing', 1)).toEqual({ status: 'UNKNOWN_WEEK' });
    expect(selectWeek(plan, 'vegetative', 9)).toEqual({ status: 'UNKNOWN_WEEK' });
  });
  it('excludes N/A and unknown rules from ingredients without hiding diagnostics', () => {
    const plan = result();
    const week = { ...plan.weeks[0], entries: [{ status: 'NO_RULE', productId: 'joker', reason: 'MISSING' }, ...plan.weeks[0].entries.slice(1)], completeness: 'INCOMPLETE' } as const;
    const projected = selectWeek({ ...plan, weeks: [week] }, 'vegetative', 1);
    expect(projected).toEqual({ status: 'FOUND', week });
    expect(selectApplicationEntries(week, 'FERTIGATION')).toEqual([]);
    expect(selectApplicationEntries(week, 'FOLIAR')).toHaveLength(3);
  });
});
