import type { FeedingSchedule, NutrientRule, RuleProvenance } from '@/domain/nutrition/types';
import { plantasQueCuram } from './brand';
import { products } from './products';
// Each tuple explicitly declares eight positions. Expansion creates all 80 typed slots;
// no absent week is inferred, interpolated or converted to a zero dose.
const rows = [
  ['joker', 'vegetative', 'GRAM_PER_LITER', 'FERTIGATION', [1, 1, 2, 2, 2, 2, 2, 2]],
  ['coringa-blend', 'vegetative', 'MILLILITER_PER_LITER', 'FOLIAR', [5, 5, 5, 5, 5, 5, 5, 5]],
  ['plant-protein', 'vegetative', 'MILLILITER_PER_LITER', 'FOLIAR', [3, 3, 3, 3, 3, 3, 3, 3]],
  ['terpeno-plus', 'vegetative', 'MILLILITER_PER_LITER', 'FOLIAR', [1, 1, 1, 1, 1, 1, 1, 1]],
  ['tricomax', 'vegetative', 'GRAM_PER_LITER', 'FERTIGATION', ['STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE']],
  ['joker', 'flowering', 'GRAM_PER_LITER', 'FERTIGATION', [2, 2, 2, 3, 3, 'WEEK_NOT_USED', 'WEEK_NOT_USED', 'WEEK_NOT_USED']],
  ['coringa-blend', 'flowering', 'MILLILITER_PER_LITER', 'FOLIAR', ['STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE']],
  ['plant-protein', 'flowering', 'MILLILITER_PER_LITER', 'FERTIGATION', [4, 4, 4, 6, 8, 8, 8, 8]],
  ['terpeno-plus', 'flowering', 'MILLILITER_PER_LITER', 'FOLIAR', ['STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE', 'STAGE_NOT_APPLICABLE']],
  ['tricomax', 'flowering', 'GRAM_PER_LITER', 'FERTIGATION', ['WEEK_NOT_USED', 'WEEK_NOT_USED', 'WEEK_NOT_USED', 'WEEK_NOT_USED', 1, 2, 3, 4]],
] as const;
const foliarCounts = [1, 1, 2, 2, 2, 2, 3, 3] as const;
const rules: readonly NutrientRule[] = rows.flatMap(([productId, stageId, unit, applicationType, positions]) =>
  positions.map((position, i): NutrientRule => {
    const key = { productId, stageId, weekNumber: i + 1 };
    if (typeof position !== 'number') return { ...key, status: 'NOT_APPLICABLE', reason: position,
      provenance: { doseSourceIds: [], applicationSourceIds: [], frequencySourceIds: [],
        applicabilitySourceIds: [position === 'STAGE_NOT_APPLICABLE' ? 'SRC-007' : 'SRC-004'] } };
    const provenance: RuleProvenance = { doseSourceIds: ['SRC-001'], applicationSourceIds: ['SRC-001'],
      frequencySourceIds: applicationType === 'FOLIAR' ? ['SRC-001']
        : productId === 'joker' ? ['SRC-006', 'SRC-007'] : ['SRC-001', 'SRC-006', 'SRC-007'],
      applicabilitySourceIds: ['SRC-001'] };
    return { ...key, status: 'ACTIVE', dose: { unit, value: position }, applicationType,
      frequency: applicationType === 'FOLIAR'
        ? { mode: 'FIXED_PER_WEEK', prescribedApplicationsPerWeek: foliarCounts[i]! }
        : { mode: 'EVERY_FERTIGATION' }, provenance };
  }));
export const feedingSchedule: FeedingSchedule = {
  id: 'plantas-que-curam-8-8', brandId: plantasQueCuram.id, name: 'Cronograma Plantas que Curam',
  metadata: { dataVersion: 'raizora-transcription-1', providerScheduleVersion: null, auditedAt: '2026-10-02', sources: [
    { id: 'SRC-001', kind: 'OFFICIAL_TABLE', title: 'Tabela nutricional oficial', reference: 'tabela_nutricional.jpeg', sourceDate: null },
    { id: 'SRC-004', kind: 'PRODUCT_DECISION', title: 'Não utilização semanal confirmada', reference: 'specs/001-raizora-mvp/spec.md', sourceDate: '2026-10-02' },
    { id: 'SRC-006', kind: 'PRODUCT_DECISION', title: 'Joker e eventos de fertirrigação', reference: 'specs/001-raizora-mvp/review.md', sourceDate: '2026-10-02', notes: 'Somente decisões preservadas sobre Joker e todas as regas.' },
    { id: 'SRC-007', kind: 'PRODUCT_DECISION', title: 'Decisões vigentes do responsável', reference: 'specs/001-raizora-mvp/open-questions.md', sourceDate: '2026-10-02', notes: 'Duração deste schedule, frequências e aplicabilidade confirmadas.' },
  ] },
  products,
  stages: [
    { id: 'vegetative', type: 'VEGETATIVE', label: 'Vegetativo', weekCount: 8 },
    { id: 'flowering', type: 'FLOWERING', label: 'Floração', weekCount: 8 },
  ],
  rules,
};
