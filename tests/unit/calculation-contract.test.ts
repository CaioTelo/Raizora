import { describe, expect, it } from 'vitest';
import { feedingSchedule } from '@/data/brands/plantas-que-curam/schedule';
import { calculateNutritionPlan } from '@/domain/calculation/calculate-plan';
import type { CalculationInput } from '@/domain/calculation/types';
import type { FeedingSchedule } from '@/domain/nutrition/types';
import { activeRule, deepFreeze, inputFor, neutralSchedule } from './fixtures';

describe('public response, numbers and integrity — U-14–17', () => {
  it('invalid input has issues and no stale result', () => {
    const response = calculateNutritionPlan({ ...inputFor(feedingSchedule), selectedProductIds: [] });
    expect(response).toEqual({ status: 'INVALID_INPUT', issues: [{ code: 'EMPTY_SELECTION', path: 'selectedProductIds' }] });
  });
  it('validates malformed data even when product deselected, before invalid input', () => {
    const schedule = { ...feedingSchedule, products: feedingSchedule.products.map(p => p.id === 'tricomax' ? { ...p, quantityUnit: 'MILLILITER' as const } : p) };
    const response = calculateNutritionPlan({ ...inputFor(schedule), selectedProductIds: ['joker'] });
    expect(response.status).toBe('INVALID_SCHEDULE');
    expect(response).not.toHaveProperty('result');
    expect(calculateNutritionPlan({ ...inputFor(schedule), selectedProductIds: [] }).status).toBe('INVALID_SCHEDULE');
  });
  it('is deterministic, independent of click order and accepts deeply frozen input', () => {
    const input = deepFreeze(inputFor(feedingSchedule));
    const snapshot = JSON.stringify(input);
    const first = calculateNutritionPlan(input);
    expect(calculateNutritionPlan(input)).toEqual(first);
    expect(calculateNutritionPlan({ ...input, selectedProductIds: [...input.selectedProductIds].reverse() })).toEqual(first);
    expect(JSON.stringify(input)).toBe(snapshot);
    expect(first).not.toHaveProperty('timestamp');
  });
  it('returns an isolated snapshot (nested dose/frequency/config copied)', () => {
    const input = inputFor(structuredClone(feedingSchedule));
    const response = calculateNutritionPlan(input);
    if (response.status !== 'SUCCESS') throw new Error('Expected SUCCESS');
    const snapshot = structuredClone(response);
    const rule = input.schedule.rules.find(r => r.status === 'ACTIVE')!;
    if (rule.status === 'ACTIVE') (rule.dose as { value: number }).value = 999;
    (input.configuration as { fertigationVolumeLiters: number }).fertigationVolumeLiters = 999;
    expect(response).toEqual(snapshot);
  });
  const numericCase = (dose: number, volume: number, count: number, weeks = 1): CalculationInput => {
    const base = neutralSchedule();
    const schedule: FeedingSchedule = { ...base, stages: [{ ...base.stages[0]!, weekCount: weeks }],
      rules: Array.from({ length: weeks }, (_, i) => ({ ...activeRule(i + 1), status: 'ACTIVE' as const,
        dose: { unit: 'MILLILITER_PER_LITER' as const, value: dose }, applicationType: 'FERTIGATION' as const, frequency: { mode: 'EVERY_FERTIGATION' as const } })) };
    return { ...inputFor(schedule), configuration: { fertigationVolumeLiters: volume, fertigationApplicationsPerWeek: count } };
  };
  it.each([
    ['preparation overflow', Number.MAX_VALUE, 2, 1, 1, 'OVERFLOW', 'AMOUNT_PER_APPLICATION'],
    ['weekly overflow', Number.MAX_VALUE / 2, 1, 3, 1, 'OVERFLOW', 'WEEKLY_AMOUNT'],
    ['stage sum overflow', Number.MAX_VALUE * 0.75, 1, 1, 2, 'OVERFLOW', 'STAGE_TOTAL'],
    ['preparation underflow', Number.MIN_VALUE, 0.5, 1, 1, 'UNDERFLOW', 'AMOUNT_PER_APPLICATION'],
  ] as const)('%s has typed failure without result', (_, dose, volume, count, weeks, code, operation) => {
    const response = calculateNutritionPlan(numericCase(dose, volume, count, weeks));
    expect(response.status).toBe('NUMERIC_ERROR');
    if (response.status !== 'NUMERIC_ERROR') throw new Error('Expected NUMERIC_ERROR');
    expect(response.issues).toContainEqual(expect.objectContaining({ code, operation, productId: 'p' }));
    expect(response).not.toHaveProperty('result');
  });
  it('detects cycle overflow even when individual stages are finite', () => {
    const input = numericCase(Number.MAX_VALUE * 0.75, 1, 1);
    const secondStage = { id: 'second', type: 'FLOWERING' as const, label: 'Second', weekCount: 1 };
    const schedule = { ...input.schedule, stages: [...input.schedule.stages, secondStage], rules: [...input.schedule.rules, { ...input.schedule.rules[0]!, stageId: 'second' }] };
    const response = calculateNutritionPlan({ ...input, schedule });
    expect(response.status).toBe('NUMERIC_ERROR');
    if (response.status !== 'NUMERIC_ERROR') throw new Error('Expected NUMERIC_ERROR');
    expect(response.issues).toContainEqual(expect.objectContaining({ code: 'OVERFLOW', operation: 'CYCLE_TOTAL' }));
  });
  it('preserves positive representable subnormal values', () => {
    const response = calculateNutritionPlan(numericCase(Number.MIN_VALUE, 1, 1));
    expect(response.status).toBe('SUCCESS');
    if (response.status !== 'SUCCESS') throw new Error('Expected SUCCESS');
    expect(response.result.productTotals[0]!.cycle).toEqual({ status: 'COMPLETE', amount: { unit: 'MILLILITER', value: Number.MIN_VALUE } });
  });
});

it('supports fixed frequency on fertigation without multiplying by global count', () => {
  const base = neutralSchedule();
  const schedule = { ...base, rules: base.rules.map(rule => ({ ...rule, status: 'ACTIVE' as const,
    dose: { unit: 'MILLILITER_PER_LITER' as const, value: 1 }, applicationType: 'FERTIGATION' as const,
    frequency: { mode: 'FIXED_PER_WEEK' as const, prescribedApplicationsPerWeek: 2 } })) };
  const response = calculateNutritionPlan(inputFor(schedule));
  expect(response.status).toBe('SUCCESS');
  if (response.status !== 'SUCCESS') throw new Error('Expected SUCCESS');
  expect(response.result.weeks[0]!.entries[0]).toMatchObject({ effectiveApplicationsPerWeek: 2, amountPerApplication: { value: 10 }, weeklyAmount: { value: 20 } });
  expect(response.result.productTotals[0]!.cycle).toEqual({ status: 'COMPLETE', amount: { unit: 'MILLILITER', value: 40 } });
});
