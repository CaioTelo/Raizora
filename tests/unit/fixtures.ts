import { expect } from 'vitest';
import type { CalculationInput, CalculationResult, RuleCalculation } from '@/domain/calculation/types';
import type { FeedingSchedule, NutrientRule } from '@/domain/nutrition/types';

export const provenance = {
  doseSourceIds: ['table'], applicationSourceIds: ['table'],
  frequencySourceIds: ['table'], applicabilitySourceIds: ['table'],
} as const;
export const inactiveProvenance = {
  doseSourceIds: [], applicationSourceIds: [], frequencySourceIds: [], applicabilitySourceIds: ['table'],
} as const;
export function activeRule(weekNumber = 1): NutrientRule {
  return { productId: 'p', stageId: 'stage', weekNumber, status: 'ACTIVE',
    dose: { unit: 'MILLILITER_PER_LITER', value: weekNumber }, applicationType: 'FERTIGATION',
    frequency: { mode: 'EVERY_FERTIGATION' }, provenance };
}
export function neutralSchedule(): FeedingSchedule {
  return { id: 'neutral', brandId: 'neutral-brand', name: 'Fixture',
    metadata: { dataVersion: 'fixture-1', providerScheduleVersion: null, auditedAt: '2026-10-02',
      sources: [{ id: 'table', kind: 'OFFICIAL_TABLE', title: 'Fixture', reference: 'test', sourceDate: null }] },
    products: [{ id: 'p', brandId: 'neutral-brand', name: 'Synthetic nutrient', quantityUnit: 'MILLILITER' }],
    stages: [{ id: 'stage', type: 'VEGETATIVE', label: 'Short stage', weekCount: 2 }],
    rules: [activeRule(1), activeRule(2)] };
}
export function inputFor(schedule: FeedingSchedule): CalculationInput {
  return { schedule, configuration: { fertigationVolumeLiters: 10, fertigationApplicationsPerWeek: 3, foliarVolumeLiters: 2 },
    selectedProductIds: schedule.products.map(p => p.id) };
}
export function entry(result: CalculationResult, productId: string, stageId: string, weekNumber: number): RuleCalculation {
  const found = result.weeks.find(w => w.stageId === stageId && w.weekNumber === weekNumber)?.entries.find(e => e.productId === productId);
  if (!found) throw new Error('Expected entry missing');
  return found;
}
export function expectDecimal(actual: number, expected: number): void {
  const absoluteTolerance = 1e-12;
  const relativeTolerance = 1e-12;
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(Math.max(absoluteTolerance, Math.abs(expected) * relativeTolerance));
}
export function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}
