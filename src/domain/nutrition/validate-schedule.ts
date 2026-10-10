import type { FeedingSchedule, MissingRuleDiagnostic, NutrientRule, RuleKey } from './types';
import type { ScheduleValidation, ValidationCode, ValidationIssue } from '../calculation/types';

const nonEmpty = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const safeCount = (value: number): boolean => Number.isSafeInteger(value) && value >= 1;
const isoDate = (value: unknown): boolean => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
const keyOf = (key: RuleKey): string => JSON.stringify([key.productId, key.stageId, key.weekNumber]);

/** Validate the complete local dataset. Missing slots are completeness diagnostics. */
export function validateSchedule(schedule: FeedingSchedule): ScheduleValidation {
  const issues: ValidationIssue[] = [];
  const missingRules: MissingRuleDiagnostic[] = [];
  const add = (code: ValidationCode, path: string, key?: RuleKey): void => { issues.push({ code, path, ...key }); };
  const required = (value: unknown, path: string): void => { if (!nonEmpty(value)) add('REQUIRED', path); };
  const unique = (id: string, seen: Set<string>, path: string): void => {
    required(id, path);
    if (seen.has(id)) add('DUPLICATE_ID', path);
    seen.add(id);
  };
  required(schedule.id, 'schedule.id');
  required(schedule.brandId, 'schedule.brandId');
  required(schedule.name, 'schedule.name');
  if (!schedule.metadata || !Array.isArray(schedule.products) || !Array.isArray(schedule.stages) || !Array.isArray(schedule.rules)) {
    add('REQUIRED', 'schedule');
    return { issues, missingRules };
  }
  const metadata = schedule.metadata;
  required(metadata.dataVersion, 'schedule.metadata.dataVersion');
  if (metadata.providerScheduleVersion !== null) required(metadata.providerScheduleVersion, 'schedule.metadata.providerScheduleVersion');
  if (!isoDate(metadata.auditedAt)) add('INVALID_PROVENANCE', 'schedule.metadata.auditedAt');
  const sourceIds = new Set<string>();
  if (!Array.isArray(metadata.sources)) add('INVALID_PROVENANCE', 'schedule.metadata.sources');
  else metadata.sources.forEach((source, i) => {
    const path = `schedule.metadata.sources[${i}]`;
    unique(source.id, sourceIds, `${path}.id`);
    if (!['OFFICIAL_TABLE', 'PRODUCT_DECISION'].includes(source.kind) || !nonEmpty(source.title)
      || !nonEmpty(source.reference) || (source.sourceDate !== null && !isoDate(source.sourceDate))) add('INVALID_PROVENANCE', path);
  });
  const productIds = new Set<string>();
  if (schedule.products.length === 0) add('REQUIRED', 'schedule.products');
  schedule.products.forEach((product, i) => {
    const path = `schedule.products[${i}]`;
    unique(product.id, productIds, `${path}.id`);
    required(product.name, `${path}.name`);
    if (product.brandId !== schedule.brandId) add('INVALID_REFERENCE', `${path}.brandId`);
    if (!['GRAM', 'MILLILITER'].includes(product.quantityUnit)) add('INCOMPATIBLE_UNIT', `${path}.quantityUnit`);
    if (product.aliases !== undefined && (!Array.isArray(product.aliases) || product.aliases.some((a: unknown) => !nonEmpty(a)))) add('REQUIRED', `${path}.aliases`);
  });
  const stageIds = new Set<string>();
  if (schedule.stages.length === 0) add('REQUIRED', 'schedule.stages');
  schedule.stages.forEach((stage, i) => {
    const path = `schedule.stages[${i}]`;
    unique(stage.id, stageIds, `${path}.id`);
    required(stage.label, `${path}.label`);
    if (!['VEGETATIVE', 'FLOWERING'].includes(stage.type)) add('INVALID_REFERENCE', `${path}.type`);
    if (!safeCount(stage.weekCount)) add('INVALID_COUNT', `${path}.weekCount`);
  });
  const productsById = new Map(schedule.products.map(product => [product.id, product]));
  const stagesById = new Map(schedule.stages.map(stage => [stage.id, stage]));
  const rulesByKey = new Map<string, NutrientRule>();
  const stageNotApplicablePairs = new Set<string>();
  schedule.rules.forEach((rule, i) => {
    const path = `schedule.rules[${i}]`;
    const key: RuleKey = { productId: rule.productId, stageId: rule.stageId, weekNumber: rule.weekNumber };
    const product = productsById.get(rule.productId);
    const stage = stagesById.get(rule.stageId);
    if (!product) add('INVALID_REFERENCE', `${path}.productId`, key);
    if (!stage) add('INVALID_REFERENCE', `${path}.stageId`, key);
    if (!safeCount(rule.weekNumber) || (stage && rule.weekNumber > stage.weekCount)) add('INVALID_COVERAGE', `${path}.weekNumber`, key);
    const encoded = keyOf(key);
    if (rulesByKey.has(encoded)) add('DUPLICATE_ID', path, key);
    rulesByKey.set(encoded, rule);
    const provenance = rule.provenance;
    for (const field of ['doseSourceIds', 'applicationSourceIds', 'frequencySourceIds', 'applicabilitySourceIds'] as const) {
      const refs = provenance?.[field];
      const needsSource = rule.status === 'ACTIVE' || (rule.status === 'NOT_APPLICABLE' && field === 'applicabilitySourceIds');
      if (!Array.isArray(refs) || (needsSource && refs.length === 0) || refs.some(id => !sourceIds.has(id))
        || (rule.status !== 'ACTIVE' && field !== 'applicabilitySourceIds' && refs.length !== 0)) add('INVALID_PROVENANCE', `${path}.provenance.${field}`, key);
    }
    if (rule.status === 'ACTIVE') {
      if (!rule.dose || !Number.isFinite(rule.dose.value)) add('INVALID_NUMBER', `${path}.dose.value`, key);
      else if (rule.dose.value <= 0) add('NON_POSITIVE', `${path}.dose.value`, key);
      const expected = product?.quantityUnit === 'GRAM' ? 'GRAM_PER_LITER' : 'MILLILITER_PER_LITER';
      if (!rule.dose || !['GRAM_PER_LITER', 'MILLILITER_PER_LITER'].includes(rule.dose.unit) || rule.dose.unit !== expected) add('INCOMPATIBLE_UNIT', `${path}.dose.unit`, key);
      if (!['FERTIGATION', 'FOLIAR'].includes(rule.applicationType)) add('INVALID_REFERENCE', `${path}.applicationType`, key);
      if (!rule.frequency || (rule.frequency.mode !== 'FIXED_PER_WEEK' && rule.frequency.mode !== 'EVERY_FERTIGATION')
        || (rule.frequency.mode === 'FIXED_PER_WEEK' && !safeCount(rule.frequency.prescribedApplicationsPerWeek))
        || (rule.frequency.mode === 'EVERY_FERTIGATION' && (rule.applicationType !== 'FERTIGATION' || 'prescribedApplicationsPerWeek' in rule.frequency))) add('INVALID_FREQUENCY', `${path}.frequency`, key);
    } else {
      if ('dose' in rule || 'applicationType' in rule || 'frequency' in rule) add('INVALID_COVERAGE', path, key);
      if (rule.status === 'NOT_APPLICABLE') {
        if (!['STAGE_NOT_APPLICABLE', 'WEEK_NOT_USED'].includes(rule.reason)) add('INVALID_COVERAGE', `${path}.reason`, key);
        if (rule.reason === 'STAGE_NOT_APPLICABLE') stageNotApplicablePairs.add(JSON.stringify([rule.productId, rule.stageId]));
      } else if (rule.status === 'NO_RULE') {
        if (!['MISSING', 'UNCONFIRMED'].includes(rule.reason)) add('INVALID_COVERAGE', `${path}.reason`, key);
      } else add('INVALID_COVERAGE', `${path}.status`, key);
    }
  });
  // Invalid structure stops coverage traversal (including invalid/unsafe durations).
  if (issues.length > 0) return { issues, missingRules };
  for (const stage of schedule.stages) {
    for (let weekNumber = 1; weekNumber <= stage.weekCount; weekNumber++) {
      for (const product of schedule.products) {
        const key = { productId: product.id, stageId: stage.id, weekNumber };
        const rule = rulesByKey.get(keyOf(key));
        if (!rule || rule.status === 'NO_RULE') missingRules.push({ key, reason: rule?.reason ?? 'MISSING' });
        if (stageNotApplicablePairs.has(JSON.stringify([product.id, stage.id]))
          && rule && rule.status !== 'NO_RULE'
          && (rule.status !== 'NOT_APPLICABLE' || rule.reason !== 'STAGE_NOT_APPLICABLE')) add('INVALID_COVERAGE', 'schedule.rules', key);
      }
    }
  }
  return { issues, missingRules };
}
