import type { BrandId } from '../brands/types';
import type { ProductId, Quantity, QuantityUnit } from '../products/types';
import type { ApplicationType, Dose, FeedingSchedule, Frequency, MissingRuleDiagnostic,
  MissingRuleReason, NonApplicationReason, RuleKey, ScheduleId, StageId, WeekNumber } from '../nutrition/types';

export interface CultivationConfiguration {
  readonly fertigationVolumeLiters: number;
  readonly fertigationApplicationsPerWeek: number;
  readonly foliarVolumeLiters?: number;
}
export type SelectedProductSet = readonly ProductId[];
export type Completeness = 'COMPLETE' | 'INCOMPLETE';
export type ValidationCode = 'REQUIRED' | 'INVALID_NUMBER' | 'NON_POSITIVE' | 'INVALID_COUNT'
  | 'EMPTY_SELECTION' | 'UNKNOWN_PRODUCT' | 'DUPLICATE_ID' | 'INVALID_REFERENCE'
  | 'INCOMPATIBLE_UNIT' | 'INVALID_FREQUENCY' | 'INVALID_PROVENANCE' | 'INVALID_COVERAGE';
export interface ValidationIssue {
  readonly code: ValidationCode;
  readonly path: string;
  readonly productId?: ProductId;
  readonly stageId?: StageId;
  readonly weekNumber?: WeekNumber;
}
export interface NumericIssue {
  readonly code: 'OVERFLOW' | 'UNDERFLOW';
  readonly operation: 'AMOUNT_PER_APPLICATION' | 'WEEKLY_AMOUNT' | 'STAGE_TOTAL' | 'CYCLE_TOTAL';
  readonly productId: ProductId;
  readonly stageId?: StageId;
  readonly weekNumber?: WeekNumber;
}
export type RuleCalculation =
  | { readonly status: 'ACTIVE'; readonly productId: ProductId; readonly sourceRuleKey: RuleKey;
      readonly dose: Dose; readonly applicationType: ApplicationType; readonly frequency: Frequency;
      readonly effectiveApplicationsPerWeek: number; readonly preparationVolumeLiters: number;
      readonly amountPerApplication: Quantity; readonly weeklyAmount: Quantity }
  | { readonly status: 'NOT_APPLICABLE'; readonly productId: ProductId; readonly reason: NonApplicationReason }
  | { readonly status: 'NO_RULE'; readonly productId: ProductId; readonly reason: MissingRuleReason };
export interface WeekCalculation {
  readonly stageId: StageId;
  readonly weekNumber: WeekNumber;
  readonly entries: readonly RuleCalculation[];
  readonly completeness: Completeness;
}
export type AmountAggregate =
  | { readonly status: 'COMPLETE'; readonly amount: Quantity }
  | { readonly status: 'NOT_APPLICABLE'; readonly reasons: readonly NonApplicationReason[] }
  | { readonly status: 'INCOMPLETE'; readonly missingRuleKeys: readonly RuleKey[]; readonly knownSubtotal?: Quantity };
export interface StageProductTotal {
  readonly stageId: StageId;
  readonly aggregate: AmountAggregate;
}
export interface ProductCycleTotal {
  readonly productId: ProductId;
  readonly quantityUnit: QuantityUnit;
  readonly byStage: readonly StageProductTotal[];
  readonly cycle: AmountAggregate;
}
export interface CalculationResult {
  readonly scheduleId: ScheduleId;
  readonly dataVersion: string;
  readonly brandId: BrandId;
  readonly configuration: CultivationConfiguration;
  readonly selectedProductIds: SelectedProductSet;
  readonly completeness: Completeness;
  readonly weeks: readonly WeekCalculation[];
  readonly productTotals: readonly ProductCycleTotal[];
  readonly missingRules: readonly MissingRuleDiagnostic[];
}
export type CalculationResponse =
  | { readonly status: 'SUCCESS'; readonly result: CalculationResult }
  | { readonly status: 'INVALID_INPUT'; readonly issues: readonly ValidationIssue[] }
  | { readonly status: 'INVALID_SCHEDULE'; readonly issues: readonly ValidationIssue[] }
  | { readonly status: 'NUMERIC_ERROR'; readonly issues: readonly NumericIssue[] };
export interface CalculationInput {
  readonly schedule: FeedingSchedule;
  readonly configuration: CultivationConfiguration;
  readonly selectedProductIds: SelectedProductSet;
}
export interface ScheduleValidation {
  readonly issues: readonly ValidationIssue[];
  readonly missingRules: readonly MissingRuleDiagnostic[];
}
