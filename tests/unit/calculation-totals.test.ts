import { describe, expect, it } from 'vitest';
import { feedingSchedule } from '@/data/brands/plantas-que-curam/schedule';
import { calculateNutritionPlan } from '@/domain/calculation/calculate-plan';
import type { CalculationInput, CalculationResult } from '@/domain/calculation/types';
import { entry, expectDecimal, inactiveProvenance, inputFor, neutralSchedule } from './fixtures';

function run(input: CalculationInput): CalculationResult {
  const response = calculateNutritionPlan(input);
  expect(response.status).toBe('SUCCESS');
  if (response.status !== 'SUCCESS') throw new Error('Expected SUCCESS');
  return response.result;
}
describe('stage and cycle aggregation — U-09/10/13, C-004/005', () => {
  it.each([
    ['joker', 'GRAM', 420, 360, 780], ['coringa-blend', 'MILLILITER', 160, null, 160],
    ['plant-protein', 'MILLILITER', 96, 1500, 1596], ['terpeno-plus', 'MILLILITER', 32, null, 32],
    ['tricomax', 'GRAM', null, 300, 300],
  ] as const)('C-005 %s stage/cycle', (id, unit, veg, flora, cycle) => {
    const total = run(inputFor(feedingSchedule)).productTotals.find(p => p.productId === id)!;
    expect(total.quantityUnit).toBe(unit);
    expect(total.cycle).toEqual({ status: 'COMPLETE', amount: { unit, value: cycle } });
    for (const [i, value] of [veg, flora].entries()) {
      expect(total.byStage[i]!.aggregate).toEqual(value === null
        ? { status: 'NOT_APPLICABLE', reasons: ['STAGE_NOT_APPLICABLE'] }
        : { status: 'COMPLETE', amount: { unit, value } });
    }
  });
  it('C-004 neutral shorter schedule adds 10 + 20 ml, no manufacturer IDs', () => {
    const schedule = neutralSchedule();
    const input = { ...inputFor(schedule), configuration: { fertigationVolumeLiters: 10, fertigationApplicationsPerWeek: 1 } };
    const result = run(input);
    expect(result.weeks).toHaveLength(2);
    expect(result.productTotals[0]!.cycle).toEqual({ status: 'COMPLETE', amount: { unit: 'MILLILITER', value: 30 } });
  });
  it('fractional approved case retains raw values without intermediate rounding', () => {
    const result = run({ ...inputFor(feedingSchedule), selectedProductIds: ['joker'], configuration: { fertigationVolumeLiters: 0.004, fertigationApplicationsPerWeek: 3 } });
    const first = entry(result, 'joker', 'vegetative', 1);
    if (first.status !== 'ACTIVE') throw new Error('Expected ACTIVE');
    expectDecimal(first.amountPerApplication.value, 0.004);
    expectDecimal(first.weeklyAmount.value, 0.012);
    const total = result.productTotals[0]!;
    for (const [i, expected] of [0.168, 0.144].entries()) {
      const aggregate = total.byStage[i]!.aggregate;
      if (aggregate.status !== 'COMPLETE') throw new Error('Expected COMPLETE');
      expectDecimal(aggregate.amount.value, expected);
    }
    if (total.cycle.status !== 'COMPLETE') throw new Error('Expected COMPLETE');
    expectDecimal(total.cycle.amount.value, 0.312);
  });
  it('fully nonapplicable product has no numeric stage or cycle amount', () => {
    const source = neutralSchedule();
    const schedule = { ...source, rules: source.rules.map(r => ({ productId: r.productId, stageId: r.stageId, weekNumber: r.weekNumber,
      status: 'NOT_APPLICABLE' as const, reason: 'STAGE_NOT_APPLICABLE' as const, provenance: inactiveProvenance })) };
    const total = run(inputFor(schedule)).productTotals[0]!;
    expect(total.cycle).toEqual({ status: 'NOT_APPLICABLE', reasons: ['STAGE_NOT_APPLICABLE'] });
    expect(total.byStage[0]!.aggregate).toEqual(total.cycle);
  });
  it('missing rule prevents definitive affected totals, retains labeled known subtotal', () => {
    const schedule = { ...feedingSchedule, rules: feedingSchedule.rules.filter(r => !(r.productId === 'joker' && r.stageId === 'vegetative' && r.weekNumber === 1)) };
    const result = run(inputFor(schedule));
    const joker = result.productTotals[0]!;
    const keys = [{ productId: 'joker', stageId: 'vegetative', weekNumber: 1 }];
    expect(joker.byStage[0]!.aggregate).toEqual({ status: 'INCOMPLETE', missingRuleKeys: keys, knownSubtotal: { unit: 'GRAM', value: 390 } });
    expect(joker.byStage[1]!.aggregate.status).toBe('COMPLETE');
    expect(joker.cycle).toEqual({ status: 'INCOMPLETE', missingRuleKeys: keys, knownSubtotal: { unit: 'GRAM', value: 750 } });
    expect(result.productTotals[1]!.cycle.status).toBe('COMPLETE');
  });
  it('wholly missing scope omits knownSubtotal rather than adding zero', () => {
    const schedule = { ...neutralSchedule(), rules: [] };
    const total = run(inputFor(schedule)).productTotals[0]!;
    expect(total.cycle.status).toBe('INCOMPLETE');
    expect(total.cycle).not.toHaveProperty('knownSubtotal');
    expect(total.cycle).not.toHaveProperty('amount');
  });
});
