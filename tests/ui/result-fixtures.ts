import { calculateNutritionPlan } from '@/domain/calculation/calculate-plan';
import type { FeedingSchedule } from '@/domain/nutrition/types';
import type { CultivationConfiguration } from '@/domain/calculation/types';
import { feedingSchedule } from '@/data/brands/plantas-que-curam/schedule';
export { feedingSchedule };
export function resultFor(schedule = feedingSchedule, selectedProductIds = schedule.products.map(p => p.id)) {
  const response = calculateNutritionPlan({ schedule, selectedProductIds, configuration: { fertigationVolumeLiters: 10, fertigationApplicationsPerWeek: 3, foliarVolumeLiters: 2 } });
  if (response.status !== 'SUCCESS') throw new Error(response.status);
  return response.result;
}
/** Application v1.1 oracle; resultFor remains the explicit historical count3 fixture. */
export function applicationResultFor(schedule = feedingSchedule, selectedProductIds = schedule.products.map(p => p.id), volumes: Pick<CultivationConfiguration, 'fertigationVolumeLiters' | 'foliarVolumeLiters'> = { fertigationVolumeLiters: 10, foliarVolumeLiters: 2 }) {
  const response = calculateNutritionPlan({ schedule, selectedProductIds, configuration: { ...volumes, fertigationApplicationsPerWeek: 1 } });
  if (response.status !== 'SUCCESS') throw new Error(response.status);
  return response.result;
}
export function incompleteSchedule(): FeedingSchedule {
  return { ...feedingSchedule, rules: feedingSchedule.rules.map(rule => rule.productId === 'joker' && rule.stageId === 'vegetative' && rule.weekNumber === 4
    ? { productId: rule.productId, stageId: rule.stageId, weekNumber: rule.weekNumber, status: 'NO_RULE', reason: 'UNCONFIRMED', provenance: { doseSourceIds: [], applicationSourceIds: [], frequencySourceIds: [], applicabilitySourceIds: ['SRC-007'] } } : rule) };
}
export const filters = { stageId: 'vegetative', weekNumber: 4, onStageChange: () => {}, onWeekChange: () => {} };
