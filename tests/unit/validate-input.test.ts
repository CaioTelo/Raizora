import { describe, expect, it } from 'vitest';
import { feedingSchedule } from '@/data/brands/plantas-que-curam/schedule';
import { validateCalculationInput } from '@/domain/calculation/validate-input';
import type { CalculationInput } from '@/domain/calculation/types';
import { inputFor, neutralSchedule } from './fixtures';

const base = inputFor(feedingSchedule);
describe('configuration and selection — U-14/U-16', () => {
  it.each([
    ['fertigationVolumeLiters', undefined, 'REQUIRED'], ['fertigationVolumeLiters', NaN, 'INVALID_NUMBER'],
    ['fertigationVolumeLiters', Infinity, 'INVALID_NUMBER'], ['fertigationVolumeLiters', 0, 'NON_POSITIVE'],
    ['fertigationVolumeLiters', -1, 'NON_POSITIVE'], ['fertigationApplicationsPerWeek', undefined, 'REQUIRED'],
    ['fertigationApplicationsPerWeek', 0, 'INVALID_COUNT'], ['fertigationApplicationsPerWeek', 1.5, 'INVALID_COUNT'],
    ['fertigationApplicationsPerWeek', Number.MAX_SAFE_INTEGER + 1, 'INVALID_COUNT'],
    ['fertigationApplicationsPerWeek', Infinity, 'INVALID_COUNT'], ['foliarVolumeLiters', undefined, 'REQUIRED'],
    ['foliarVolumeLiters', 0, 'NON_POSITIVE'], ['foliarVolumeLiters', -2, 'NON_POSITIVE'], ['foliarVolumeLiters', NaN, 'INVALID_NUMBER'],
  ])('%s = %s', (field, value, code) => {
    const input = { ...base, configuration: { ...base.configuration, [field as string]: value } } as CalculationInput;
    expect(validateCalculationInput(input)).toContainEqual({ code, path: `configuration.${field}` });
  });
  it.each([
    [[], 'EMPTY_SELECTION'], [['missing'], 'UNKNOWN_PRODUCT'], [['joker', 'joker'], 'DUPLICATE_ID'],
  ])('rejects selection %s', (ids, code) => {
    expect(validateCalculationInput({ ...base, selectedProductIds: ids as string[] })).toEqual(expect.arrayContaining([expect.objectContaining({ code })]));
  });
  it('accepts decimals and large finite volumes without agronomic maximum', () => {
    expect(validateCalculationInput({ ...base, configuration: { fertigationVolumeLiters: 0.75, fertigationApplicationsPerWeek: 1, foliarVolumeLiters: Number.MAX_VALUE } })).toEqual([]);
  });
  it('omits foliar only when no selected ACTIVE foliar exists anywhere', () => {
    const configuration = { fertigationVolumeLiters: 1, fertigationApplicationsPerWeek: 1 };
    expect(validateCalculationInput({ ...base, selectedProductIds: ['joker', 'tricomax'], configuration })).toEqual([]);
    expect(validateCalculationInput({ ...base, selectedProductIds: ['plant-protein'], configuration })).toContainEqual({ code: 'REQUIRED', path: 'configuration.foliarVolumeLiters' });
  });
  it('validates optional foliar even when it is unnecessary', () => {
    expect(validateCalculationInput({ ...base, selectedProductIds: ['joker'], configuration: { ...base.configuration, foliarVolumeLiters: 0 } })).toContainEqual({ code: 'NON_POSITIVE', path: 'configuration.foliarVolumeLiters' });
  });
  it('derives foliar requirement from rules of neutral IDs', () => {
    const schedule = neutralSchedule();
    expect(validateCalculationInput({ ...inputFor(schedule), configuration: { fertigationVolumeLiters: 1, fertigationApplicationsPerWeek: 1 } })).toEqual([]);
  });
});
