import { describe, expect, it } from 'vitest';
import { feedingSchedule } from '@/data/brands/plantas-que-curam/schedule';
import { plantasQueCuram } from '@/data/brands/plantas-que-curam/brand';
import { validateSchedule } from '@/domain/nutrition/validate-schedule';

// Independent oracle transcribed from SRC-001 and spec matrices. No dataset-derived expected values.
// Each tuple lists all eight audited positions; N = stage N/A (SRC-007), W = week not used (SRC-004).
const matrix = [
  ['joker', 'vegetative', 'GRAM_PER_LITER', 'FERTIGATION', [1, 1, 2, 2, 2, 2, 2, 2]],
  ['coringa-blend', 'vegetative', 'MILLILITER_PER_LITER', 'FOLIAR', [5, 5, 5, 5, 5, 5, 5, 5]],
  ['plant-protein', 'vegetative', 'MILLILITER_PER_LITER', 'FOLIAR', [3, 3, 3, 3, 3, 3, 3, 3]],
  ['terpeno-plus', 'vegetative', 'MILLILITER_PER_LITER', 'FOLIAR', [1, 1, 1, 1, 1, 1, 1, 1]],
  ['tricomax', 'vegetative', 'GRAM_PER_LITER', 'FERTIGATION', ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N']],
  ['joker', 'flowering', 'GRAM_PER_LITER', 'FERTIGATION', [2, 2, 2, 3, 3, 'W', 'W', 'W']],
  ['coringa-blend', 'flowering', 'MILLILITER_PER_LITER', 'FOLIAR', ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N']],
  ['plant-protein', 'flowering', 'MILLILITER_PER_LITER', 'FERTIGATION', [4, 4, 4, 6, 8, 8, 8, 8]],
  ['terpeno-plus', 'flowering', 'MILLILITER_PER_LITER', 'FOLIAR', ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N']],
  ['tricomax', 'flowering', 'GRAM_PER_LITER', 'FERTIGATION', ['W', 'W', 'W', 'W', 1, 2, 3, 4]],
] as const;
const fixedCounts = [1, 1, 2, 2, 2, 2, 3, 3];
const slots = matrix.flatMap(([productId, stageId, unit, via, doses]) => doses.map((dose, i) => ({ productId, stageId, unit, via, dose, weekNumber: i + 1 })));
describe('audited 80-position schedule — U-12', () => {
  it.each(slots)('$productId $stageId S$weekNumber', ({ productId, stageId, unit, via, dose, weekNumber }) => {
    const rules = feedingSchedule.rules.filter(r => r.productId === productId && r.stageId === stageId && r.weekNumber === weekNumber);
    expect(rules).toHaveLength(1);
    const rule = rules[0]!;
    if (typeof dose === 'number') {
      expect(rule.status).toBe('ACTIVE');
      if (rule.status !== 'ACTIVE') throw new Error('Expected ACTIVE');
      expect(rule.dose).toEqual({ unit, value: dose });
      expect(rule.applicationType).toBe(via);
      expect(rule.frequency).toEqual(via === 'FOLIAR'
        ? { mode: 'FIXED_PER_WEEK', prescribedApplicationsPerWeek: fixedCounts[weekNumber - 1] }
        : { mode: 'EVERY_FERTIGATION' });
      expect(rule.provenance).toEqual({ doseSourceIds: ['SRC-001'], applicationSourceIds: ['SRC-001'],
        frequencySourceIds: via === 'FOLIAR' ? ['SRC-001'] : productId === 'joker' ? ['SRC-006', 'SRC-007'] : ['SRC-001', 'SRC-006', 'SRC-007'],
        applicabilitySourceIds: ['SRC-001'] });
    } else {
      expect(rule).toEqual({ productId, stageId, weekNumber, status: 'NOT_APPLICABLE',
        reason: dose === 'N' ? 'STAGE_NOT_APPLICABLE' : 'WEEK_NOT_USED',
        provenance: { doseSourceIds: [], applicationSourceIds: [], frequencySourceIds: [],
          applicabilitySourceIds: dose === 'N' ? ['SRC-007'] : ['SRC-004'] } });
    }
  });
  it('matches counts, catalog, duration and validation', () => {
    expect(feedingSchedule.rules).toHaveLength(80);
    expect(feedingSchedule.rules.filter(r => r.status === 'ACTIVE')).toHaveLength(49);
    expect(feedingSchedule.rules.filter(r => r.status === 'NOT_APPLICABLE' && r.reason === 'STAGE_NOT_APPLICABLE')).toHaveLength(24);
    expect(feedingSchedule.rules.filter(r => r.status === 'NOT_APPLICABLE' && r.reason === 'WEEK_NOT_USED')).toHaveLength(7);
    expect(feedingSchedule.rules.filter(r => r.status === 'ACTIVE' && r.frequency.mode === 'FIXED_PER_WEEK')).toHaveLength(24);
    expect(feedingSchedule.rules.filter(r => r.status === 'ACTIVE' && r.frequency.mode === 'EVERY_FERTIGATION')).toHaveLength(25);
    expect(validateSchedule(feedingSchedule)).toEqual({ issues: [], missingRules: [] });
    expect(plantasQueCuram).toEqual({ id: 'plantas-que-curam', name: 'Plantas que Curam' });
    expect(feedingSchedule.products.map(p => [p.name, p.quantityUnit])).toEqual([
      ['Joker', 'GRAM'], ['Coringa Blend', 'MILLILITER'], ['Plant Protein', 'MILLILITER'], ['Terpeno Plus', 'MILLILITER'], ['Tricomax', 'GRAM'],
    ]);
    expect(feedingSchedule.stages.map(s => s.weekCount)).toEqual([8, 8]);
  });
  it('keeps audited metadata and decisions separate from official table', () => {
    expect(feedingSchedule.metadata).toMatchObject({ dataVersion: 'raizora-transcription-1', providerScheduleVersion: null, auditedAt: '2026-10-02' });
    expect(feedingSchedule.metadata.sources.map(s => [s.id, s.kind, s.sourceDate])).toEqual([
      ['SRC-001', 'OFFICIAL_TABLE', null], ['SRC-004', 'PRODUCT_DECISION', '2026-10-02'],
      ['SRC-006', 'PRODUCT_DECISION', '2026-10-02'], ['SRC-007', 'PRODUCT_DECISION', '2026-10-02'],
    ]);
  });
});
