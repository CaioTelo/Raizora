import { describe, expect, it } from 'vitest';
import { feedingSchedule } from '@/data/brands/plantas-que-curam/schedule';
import { calculateNutritionPlan } from '@/domain/calculation/calculate-plan';
import { entry, inputFor } from './fixtures';

describe('public mathematical references — U-01–06/C-001–003', () => {
  it.each([
    ['joker', 'vegetative', 1, 'GRAM', 10, 30],
    ['coringa-blend', 'vegetative', 3, 'MILLILITER', 10, 20],
    ['terpeno-plus', 'vegetative', 7, 'MILLILITER', 2, 6],
    ['joker', 'flowering', 4, 'GRAM', 30, 90],
    ['plant-protein', 'flowering', 5, 'MILLILITER', 80, 240],
    ['tricomax', 'flowering', 5, 'GRAM', 10, 30],
    ['joker', 'vegetative', 4, 'GRAM', 20, 60],
  ] as const)('%s %s S%d', (product, stage, week, unit, preparation, weekly) => {
    const response = calculateNutritionPlan(inputFor(feedingSchedule));
    expect(response.status).toBe('SUCCESS');
    if (response.status !== 'SUCCESS') throw new Error('Expected success');
    const rule = entry(response.result, product, stage, week);
    expect(rule.status).toBe('ACTIVE');
    if (rule.status !== 'ACTIVE') throw new Error('Expected ACTIVE');
    expect(rule.amountPerApplication).toEqual({ unit, value: preparation });
    expect(rule.weeklyAmount).toEqual({ unit, value: weekly });
  });
});

describe('application v1.1 references — V11-01–06/V11-CICLO', () => {
  function result() {
    const input = inputFor(feedingSchedule);
    const response = calculateNutritionPlan({ ...input, configuration: { ...input.configuration, fertigationApplicationsPerWeek: 1 } });
    if (response.status !== 'SUCCESS') throw new Error('Expected success');
    return response.result;
  }
  it.each([
    ['joker', 'vegetative', 1, 'GRAM', 10, 10],
    ['joker', 'vegetative', 4, 'GRAM', 20, 20],
    ['coringa-blend', 'vegetative', 3, 'MILLILITER', 10, 20],
    ['terpeno-plus', 'vegetative', 7, 'MILLILITER', 2, 6],
    ['plant-protein', 'flowering', 5, 'MILLILITER', 80, 80],
    ['tricomax', 'flowering', 5, 'GRAM', 10, 10],
  ] as const)('%s %s S%d', (product, stage, week, unit, preparation, weekly) => {
    const rule = entry(result(), product, stage, week);
    if (rule.status !== 'ACTIVE') throw new Error('Expected ACTIVE');
    expect(rule.amountPerApplication).toEqual({ unit, value: preparation });
    expect(rule.weeklyAmount).toEqual({ unit, value: weekly });
  });
  it('preserves 16 weeks, prescribed foliar 1/2/3, stage totals and cycle totals', () => {
    const plan = result();
    expect(plan.weeks).toHaveLength(16);
    expect(plan.completeness).toBe('COMPLETE');
    expect([...new Set(plan.weeks.flatMap(w => w.entries.flatMap(e => e.status === 'ACTIVE' && e.applicationType === 'FOLIAR' ? [e.effectiveApplicationsPerWeek] : [])))].sort()).toEqual([1, 2, 3]);
    for (const [id, unit, vegetative, flowering, cycle] of [
      ['joker', 'GRAM', 140, 120, 260], ['coringa-blend', 'MILLILITER', 160, null, 160],
      ['plant-protein', 'MILLILITER', 96, 500, 596], ['terpeno-plus', 'MILLILITER', 32, null, 32],
      ['tricomax', 'GRAM', null, 100, 100],
    ] as const) {
      const total = plan.productTotals.find(p => p.productId === id)!;
      expect(total.cycle).toEqual({ status: 'COMPLETE', amount: { unit, value: cycle } });
      for (const [i, amount] of [vegetative, flowering].entries()) {
        const aggregate = total.byStage[i].aggregate;
        if (amount === null) { expect(aggregate.status).toBe('NOT_APPLICABLE'); expect(aggregate).not.toHaveProperty('amount'); }
        else expect(aggregate).toEqual({ status: 'COMPLETE', amount: { unit, value: amount } });
      }
    }
  });
});
