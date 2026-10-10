import { describe, expect, it } from 'vitest';
import type { FeedingSchedule } from '@/domain/nutrition/types';
import { validateSchedule } from '@/domain/nutrition/validate-schedule';
import { activeRule, inactiveProvenance, neutralSchedule } from './fixtures';

function changed(patch: Partial<FeedingSchedule>): FeedingSchedule { return { ...neutralSchedule(), ...patch }; }
describe('schedule structure — U-12/U-14', () => {
  it('accepts neutral data and reports coverage gaps separately', () => {
    expect(validateSchedule(neutralSchedule())).toEqual({ issues: [], missingRules: [] });
    expect(validateSchedule(changed({ rules: [activeRule(1)] }))).toEqual({ issues: [], missingRules: [
      { key: { productId: 'p', stageId: 'stage', weekNumber: 2 }, reason: 'MISSING' },
    ] });
  });
  it('preserves explicit unconfirmed coverage', () => {
    const result = validateSchedule(changed({ rules: [activeRule(1), {
      productId: 'p', stageId: 'stage', weekNumber: 2, status: 'NO_RULE', reason: 'UNCONFIRMED',
      provenance: { ...inactiveProvenance, applicabilitySourceIds: [] },
    }] }));
    expect(result.issues).toEqual([]);
    expect(result.missingRules[0]?.reason).toBe('UNCONFIRMED');
  });
  const cases: [string, (s: FeedingSchedule) => FeedingSchedule, string][] = [
    ['empty identity', s => ({ ...s, id: '' }), 'REQUIRED'],
    ['empty catalog', s => ({ ...s, products: [] }), 'REQUIRED'],
    ['empty stages', s => ({ ...s, stages: [] }), 'REQUIRED'],
    ['duplicate product', s => ({ ...s, products: [...s.products, ...s.products] }), 'DUPLICATE_ID'],
    ['duplicate stage', s => ({ ...s, stages: [...s.stages, ...s.stages] }), 'DUPLICATE_ID'],
    ['duplicate source', s => ({ ...s, metadata: { ...s.metadata, sources: [...s.metadata.sources, ...s.metadata.sources] } }), 'DUPLICATE_ID'],
    ['duplicate slot', s => ({ ...s, rules: [...s.rules, activeRule()] }), 'DUPLICATE_ID'],
    ['brand mismatch', s => ({ ...s, products: s.products.map(p => ({ ...p, brandId: 'other' })) }), 'INVALID_REFERENCE'],
    ['unknown product', s => ({ ...s, rules: [{ ...activeRule(), productId: 'unknown' }] }), 'INVALID_REFERENCE'],
    ['unknown stage', s => ({ ...s, rules: [{ ...activeRule(), stageId: 'unknown' }] }), 'INVALID_REFERENCE'],
    ['week zero', s => ({ ...s, rules: [{ ...activeRule(), weekNumber: 0 }] }), 'INVALID_COVERAGE'],
    ['week outside duration', s => ({ ...s, rules: [{ ...activeRule(), weekNumber: 3 }] }), 'INVALID_COVERAGE'],
    ['fractional week', s => ({ ...s, rules: [{ ...activeRule(), weekNumber: 1.5 }] }), 'INVALID_COVERAGE'],
    ['invalid duration', s => ({ ...s, stages: s.stages.map(t => ({ ...t, weekCount: 0 })) }), 'INVALID_COUNT'],
    ['unsafe duration', s => ({ ...s, stages: s.stages.map(t => ({ ...t, weekCount: Number.MAX_SAFE_INTEGER + 1 })) }), 'INVALID_COUNT'],
    ['incompatible units', s => ({ ...s, products: s.products.map(p => ({ ...p, quantityUnit: 'GRAM' })) }), 'INCOMPATIBLE_UNIT'],
    ['zero dose', s => ({ ...s, rules: [{ ...activeRule(), status: 'ACTIVE', dose: { unit: 'MILLILITER_PER_LITER', value: 0 }, applicationType: 'FERTIGATION', frequency: { mode: 'EVERY_FERTIGATION' } }] }), 'NON_POSITIVE'],
    ['infinite dose', s => ({ ...s, rules: [{ ...activeRule(), status: 'ACTIVE', dose: { unit: 'MILLILITER_PER_LITER', value: Infinity }, applicationType: 'FERTIGATION', frequency: { mode: 'EVERY_FERTIGATION' } }] }), 'INVALID_NUMBER'],
    ['foliar every fertigation', s => ({ ...s, rules: [{ ...activeRule(), status: 'ACTIVE', dose: { unit: 'MILLILITER_PER_LITER', value: 1 }, applicationType: 'FOLIAR', frequency: { mode: 'EVERY_FERTIGATION' } }] }), 'INVALID_FREQUENCY'],
    ['fixed count zero', s => ({ ...s, rules: [{ ...activeRule(), status: 'ACTIVE', dose: { unit: 'MILLILITER_PER_LITER', value: 1 }, applicationType: 'FERTIGATION', frequency: { mode: 'FIXED_PER_WEEK', prescribedApplicationsPerWeek: 0 } }] }), 'INVALID_FREQUENCY'],
    ['empty provenance', s => ({ ...s, rules: [{ ...activeRule(), provenance: inactiveProvenance }] }), 'INVALID_PROVENANCE'],
    ['unresolved source', s => ({ ...s, rules: [{ ...activeRule(), provenance: { ...activeRule().provenance, doseSourceIds: ['missing'] } }] }), 'INVALID_PROVENANCE'],
    ['inconsistent stage N/A', s => ({ ...s, rules: [{ productId: 'p', stageId: 'stage', weekNumber: 1, status: 'NOT_APPLICABLE', reason: 'STAGE_NOT_APPLICABLE', provenance: inactiveProvenance }, activeRule(2)] }), 'INVALID_COVERAGE'],
  ];
  it.each(cases)('%s', (_, alter, code) => {
    expect(validateSchedule(alter(neutralSchedule())).issues).toEqual(expect.arrayContaining([expect.objectContaining({ code, path: expect.any(String) })]));
  });
  it('does not mutate frozen schedule', async () => {
    const { deepFreeze } = await import('./fixtures');
    expect(validateSchedule(deepFreeze(neutralSchedule())).issues).toEqual([]);
  });
});

it('missing or unconfirmed positions in an N/A stage stay completeness gaps', () => {
  const base = neutralSchedule();
  const first = { productId: 'p', stageId: 'stage', weekNumber: 1, status: 'NOT_APPLICABLE' as const,
    reason: 'STAGE_NOT_APPLICABLE' as const, provenance: inactiveProvenance };
  const gap = validateSchedule({ ...base, rules: [first] });
  expect(gap.issues).toEqual([]);
  expect(gap.missingRules).toEqual([{ key: { productId: 'p', stageId: 'stage', weekNumber: 2 }, reason: 'MISSING' }]);
  const unconfirmed = validateSchedule({ ...base, rules: [first, { productId: 'p', stageId: 'stage', weekNumber: 2,
    status: 'NO_RULE', reason: 'UNCONFIRMED', provenance: { ...inactiveProvenance, applicabilitySourceIds: [] } }] });
  expect(unconfirmed.issues).toEqual([]);
  expect(unconfirmed.missingRules[0]?.reason).toBe('UNCONFIRMED');
});

it('allows unknown sources for a wholly unconfirmed schedule', () => {
  const base = neutralSchedule();
  const schedule = { ...base, metadata: { ...base.metadata, sources: [] }, rules: base.rules.map(rule => ({
    productId: rule.productId, stageId: rule.stageId, weekNumber: rule.weekNumber,
    status: 'NO_RULE' as const, reason: 'UNCONFIRMED' as const,
    provenance: { doseSourceIds: [], applicationSourceIds: [], frequencySourceIds: [], applicabilitySourceIds: [] },
  })) };
  expect(validateSchedule(schedule).issues).toEqual([]);
  expect(validateSchedule(schedule).missingRules).toHaveLength(2);
});

it.each([
  ['unknown status', { status: 'UNKNOWN' }, 'INVALID_COVERAGE'],
  ['unknown reason', { status: 'NO_RULE', reason: 'UNKNOWN', provenance: { ...inactiveProvenance, applicabilitySourceIds: [] } }, 'INVALID_COVERAGE'],
  ['unknown via', { applicationType: 'UNKNOWN' }, 'INVALID_REFERENCE'],
  ['unknown dose unit', { dose: { unit: 'UNKNOWN', value: 1 } }, 'INCOMPATIBLE_UNIT'],
  ['unknown mode', { frequency: { mode: 'UNKNOWN' } }, 'INVALID_FREQUENCY'],
  ['every with prescribed count', { frequency: { mode: 'EVERY_FERTIGATION', prescribedApplicationsPerWeek: 1 } }, 'INVALID_FREQUENCY'],
  ['missing dose', { dose: undefined }, 'INVALID_NUMBER'],
  ['missing frequency', { frequency: undefined }, 'INVALID_FREQUENCY'],
  ['missing provenance', { provenance: undefined }, 'INVALID_PROVENANCE'],
  ['negative dose', { dose: { unit: 'MILLILITER_PER_LITER', value: -1 } }, 'NON_POSITIVE'],
  ['NaN dose', { dose: { unit: 'MILLILITER_PER_LITER', value: NaN } }, 'INVALID_NUMBER'],
])('rejects malformed local rule: %s', (_, patch, code) => {
  const schedule = { ...neutralSchedule(), rules: [{ ...activeRule(), ...(patch as object) }, activeRule(2)] } as FeedingSchedule;
  expect(validateSchedule(schedule).issues).toEqual(expect.arrayContaining([expect.objectContaining({ code })]));
});
