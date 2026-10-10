import type { NutrientRule, RuleKey } from '../nutrition/types';
import type { Product, Quantity } from '../products/types';
import { validateSchedule } from '../nutrition/validate-schedule';
import { validateCalculationInput } from './validate-input';
import type { AmountAggregate, CalculationInput, CalculationResponse, CultivationConfiguration,
  NumericIssue, ProductCycleTotal, RuleCalculation, WeekCalculation } from './types';

interface CalculatedSlot {
  readonly key: RuleKey;
  readonly entry: RuleCalculation;
}
const keyOf = (key: RuleKey): string => JSON.stringify([key.productId, key.stageId, key.weekNumber]);

function checkedValue(value: number, context: Omit<NumericIssue, 'code'>, issues: NumericIssue[]): number | undefined {
  if (!Number.isFinite(value)) { issues.push({ code: 'OVERFLOW', ...context }); return undefined; }
  if (value === 0) { issues.push({ code: 'UNDERFLOW', ...context }); return undefined; }
  return value;
}

function calculateRule(rule: NutrientRule | undefined, key: RuleKey, product: Product,
  configuration: CultivationConfiguration, issues: NumericIssue[]): RuleCalculation | undefined {
  if (!rule) return { status: 'NO_RULE', productId: product.id, reason: 'MISSING' };
  if (rule.status === 'NO_RULE') return { status: 'NO_RULE', productId: product.id, reason: rule.reason };
  if (rule.status === 'NOT_APPLICABLE') return { status: 'NOT_APPLICABLE', productId: product.id, reason: rule.reason };
  // Public validation has already established the required volume and compatible units.
  const preparationVolumeLiters = rule.applicationType === 'FERTIGATION'
    ? configuration.fertigationVolumeLiters : configuration.foliarVolumeLiters!;
  const amount = checkedValue(rule.dose.value * preparationVolumeLiters,
    { operation: 'AMOUNT_PER_APPLICATION', ...key }, issues);
  if (amount === undefined) return undefined;
  const effectiveApplicationsPerWeek = rule.frequency.mode === 'FIXED_PER_WEEK'
    ? rule.frequency.prescribedApplicationsPerWeek : configuration.fertigationApplicationsPerWeek;
  const weekly = checkedValue(amount * effectiveApplicationsPerWeek, { operation: 'WEEKLY_AMOUNT', ...key }, issues);
  if (weekly === undefined) return undefined;
  return { status: 'ACTIVE', productId: product.id, sourceRuleKey: { ...key },
    dose: { ...rule.dose }, applicationType: rule.applicationType, frequency: { ...rule.frequency },
    effectiveApplicationsPerWeek, preparationVolumeLiters,
    amountPerApplication: { unit: product.quantityUnit, value: amount },
    weeklyAmount: { unit: product.quantityUnit, value: weekly } };
}

function aggregate(slots: readonly CalculatedSlot[], product: Product, operation: 'STAGE_TOTAL' | 'CYCLE_TOTAL',
  issues: NumericIssue[], stageId?: string): AmountAggregate | undefined {
  let total: number | undefined;
  const missingRuleKeys: RuleKey[] = [];
  const reasons = new Set<'STAGE_NOT_APPLICABLE' | 'WEEK_NOT_USED'>();
  for (const { entry, key } of slots) {
    if (entry.status === 'NO_RULE') missingRuleKeys.push({ ...key });
    else if (entry.status === 'NOT_APPLICABLE') reasons.add(entry.reason);
    else {
      // Slots are grouped by product and use its validated quantity unit throughout.
      total = checkedValue(total === undefined ? entry.weeklyAmount.value : total + entry.weeklyAmount.value,
        { operation, productId: product.id, ...(stageId === undefined ? {} : { stageId }) }, issues);
      if (total === undefined) return undefined;
    }
  }
  const amount: Quantity | undefined = total === undefined ? undefined : { unit: product.quantityUnit, value: total };
  if (missingRuleKeys.length > 0) return { status: 'INCOMPLETE', missingRuleKeys, ...(amount ? { knownSubtotal: amount } : {}) };
  if (amount) return { status: 'COMPLETE', amount };
  return { status: 'NOT_APPLICABLE', reasons: [...reasons] };
}

/** Synchronous pure operation. Selection is normalized to catalog order before traversal. */
export function calculateNutritionPlan(input: CalculationInput): CalculationResponse {
  const { schedule, configuration, selectedProductIds } = input;
  const validation = validateSchedule(schedule);
  if (validation.issues.length > 0) return { status: 'INVALID_SCHEDULE', issues: validation.issues };
  const inputIssues = validateCalculationInput(input);
  if (inputIssues.length > 0) return { status: 'INVALID_INPUT', issues: inputIssues };
  const selected = new Set(selectedProductIds);
  const products = schedule.products.filter(product => selected.has(product.id));
  const rules = new Map(schedule.rules.map(rule => [keyOf(rule), rule]));
  const numericIssues: NumericIssue[] = [];
  const weeks: WeekCalculation[] = [];
  const missingRules = validation.missingRules.filter(diagnostic => selected.has(diagnostic.key.productId));
  const productSlots = new Map(products.map(product => [product.id, {
    cycle: [] as CalculatedSlot[],
    stages: new Map(schedule.stages.map(stage => [stage.id, [] as CalculatedSlot[]])),
  }]));
  for (const stage of schedule.stages) {
    for (let weekNumber = 1; weekNumber <= stage.weekCount; weekNumber++) {
      const entries: RuleCalculation[] = [];
      for (const product of products) {
        const key: RuleKey = { productId: product.id, stageId: stage.id, weekNumber };
        const entry = calculateRule(rules.get(keyOf(key)), key, product, configuration, numericIssues);
        if (!entry) return { status: 'NUMERIC_ERROR', issues: numericIssues };
        entries.push(entry);
        const slot = { key, entry };
        const scopes = productSlots.get(product.id)!;
        scopes.cycle.push(slot);
        scopes.stages.get(stage.id)!.push(slot);
      }
      weeks.push({ stageId: stage.id, weekNumber, entries,
        completeness: entries.some(entry => entry.status === 'NO_RULE') ? 'INCOMPLETE' : 'COMPLETE' });
    }
  }
  const productTotals: ProductCycleTotal[] = [];
  for (const product of products) {
    const scopes = productSlots.get(product.id)!;
    const byStage: ProductCycleTotal['byStage'][number][] = [];
    for (const stage of schedule.stages) {
      const result = aggregate(scopes.stages.get(stage.id)!, product, 'STAGE_TOTAL', numericIssues, stage.id);
      if (!result) return { status: 'NUMERIC_ERROR', issues: numericIssues };
      byStage.push({ stageId: stage.id, aggregate: result });
    }
    const cycle = aggregate(scopes.cycle, product, 'CYCLE_TOTAL', numericIssues);
    if (!cycle) return { status: 'NUMERIC_ERROR', issues: numericIssues };
    productTotals.push({ productId: product.id, quantityUnit: product.quantityUnit, byStage, cycle });
  }
  return { status: 'SUCCESS', result: {
    scheduleId: schedule.id, dataVersion: schedule.metadata.dataVersion, brandId: schedule.brandId,
    configuration: { fertigationVolumeLiters: configuration.fertigationVolumeLiters,
      fertigationApplicationsPerWeek: configuration.fertigationApplicationsPerWeek,
      ...(configuration.foliarVolumeLiters === undefined ? {} : { foliarVolumeLiters: configuration.foliarVolumeLiters }) },
    selectedProductIds: products.map(product => product.id), weeks, productTotals, missingRules,
    completeness: missingRules.length > 0 ? 'INCOMPLETE' : 'COMPLETE',
  } };
}
