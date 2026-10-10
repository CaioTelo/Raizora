import { describe, expect, it } from 'vitest';
import { feedingSchedule } from '@/data/brands/plantas-que-curam/schedule';
import { calculateNutritionPlan } from '@/domain/calculation/calculate-plan';
import type { CalculationInput, CalculationResult } from '@/domain/calculation/types';
import { entry, inputFor } from './fixtures';

const base = inputFor(feedingSchedule);
function run(input: CalculationInput = base): CalculationResult {
  const response = calculateNutritionPlan(input);
  expect(response.status).toBe('SUCCESS');
  if (response.status !== 'SUCCESS') throw new Error('Expected SUCCESS');
  return response.result;
}
describe('weeks, coverage, selection and frequency — U-07/08/11/13', () => {
  it('traverses all weeks and selected products in catalog order', () => {
    const result = run({ ...base, selectedProductIds: [...base.selectedProductIds].reverse() });
    expect(result.weeks).toHaveLength(16);
    expect(result.weeks.map(w => [w.stageId, w.weekNumber])).toEqual([
      ...Array.from({ length: 8 }, (_, i) => ['vegetative', i + 1]), ...Array.from({ length: 8 }, (_, i) => ['flowering', i + 1]),
    ]);
    for (const week of result.weeks) expect(week.entries.map(e => e.productId)).toEqual(base.selectedProductIds);
    expect(result.completeness).toBe('COMPLETE');
    expect(result.missingRules).toEqual([]);
  });
  it.each([
    ['tricomax', 'vegetative', 1, 'STAGE_NOT_APPLICABLE'], ['joker', 'flowering', 6, 'WEEK_NOT_USED'],
    ['tricomax', 'flowering', 4, 'WEEK_NOT_USED'], ['coringa-blend', 'flowering', 8, 'STAGE_NOT_APPLICABLE'],
  ])('%s %s S%d is coverage without event/amount', (product, stage, week, reason) => {
    const result = run();
    expect(entry(result, product as string, stage as string, week as number)).toEqual({ status: 'NOT_APPLICABLE', productId: product, reason });
    expect(result.completeness).toBe('COMPLETE');
  });
  it('preserves official active rule and source key', () => {
    const active = entry(run(), 'coringa-blend', 'vegetative', 3);
    expect(active).toMatchObject({ status: 'ACTIVE', sourceRuleKey: { productId: 'coringa-blend', stageId: 'vegetative', weekNumber: 3 }, dose: { unit: 'MILLILITER_PER_LITER', value: 5 }, applicationType: 'FOLIAR', frequency: { mode: 'FIXED_PER_WEEK', prescribedApplicationsPerWeek: 2 }, effectiveApplicationsPerWeek: 2, preparationVolumeLiters: 2 });
  });
  it('deselection omits consumption and preserves remaining values', () => {
    const full = run();
    const result = run({ ...base, selectedProductIds: ['joker'] });
    expect(result.productTotals).toEqual(full.productTotals.filter(p => p.productId === 'joker'));
    for (const week of result.weeks) expect(week.entries).toEqual(full.weeks.find(w => w.stageId === week.stageId && w.weekNumber === week.weekNumber)!.entries.filter(e => e.productId === 'joker'));
  });
  it('global count changes EVERY only, prescribed foliar stays fixed', () => {
    const first = run();
    const next = run({ ...base, configuration: { ...base.configuration, fertigationApplicationsPerWeek: 1 } });
    expect(entry(next, 'coringa-blend', 'vegetative', 3)).toEqual(entry(first, 'coringa-blend', 'vegetative', 3));
    expect(entry(next, 'joker', 'vegetative', 1)).toMatchObject({ effectiveApplicationsPerWeek: 1, weeklyAmount: { value: 10 } });
  });
  it('Plant Protein volume follows weekly application type', () => {
    const result = run();
    expect(entry(result, 'plant-protein', 'vegetative', 1)).toMatchObject({ applicationType: 'FOLIAR', preparationVolumeLiters: 2, amountPerApplication: { value: 6 } });
    expect(entry(result, 'plant-protein', 'flowering', 1)).toMatchObject({ applicationType: 'FERTIGATION', preparationVolumeLiters: 10, amountPerApplication: { value: 40 } });
  });
  it.each(['MISSING', 'UNCONFIRMED'] as const)('%s becomes NO_RULE without amount and only incompletes selected scope', reason => {
    const removed = feedingSchedule.rules.filter(r => !(r.productId === 'joker' && r.stageId === 'vegetative' && r.weekNumber === 1));
    const rules = reason === 'MISSING' ? removed : [...removed, { productId: 'joker', stageId: 'vegetative', weekNumber: 1, status: 'NO_RULE' as const, reason,
      provenance: { doseSourceIds: [], applicationSourceIds: [], frequencySourceIds: [], applicabilitySourceIds: [] } }];
    const schedule = { ...feedingSchedule, rules };
    const result = run({ ...base, schedule });
    expect(entry(result, 'joker', 'vegetative', 1)).toEqual({ status: 'NO_RULE', productId: 'joker', reason });
    expect(result.completeness).toBe('INCOMPLETE');
    expect(result.weeks[0]!.completeness).toBe('INCOMPLETE');
    expect(result.weeks[1]!.completeness).toBe('COMPLETE');
    expect(result.missingRules).toEqual([{ key: { productId: 'joker', stageId: 'vegetative', weekNumber: 1 }, reason }]);
    expect(run({ ...base, schedule, selectedProductIds: ['plant-protein'] }).completeness).toBe('COMPLETE');
  });
});
