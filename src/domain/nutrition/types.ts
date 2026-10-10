import type { BrandId } from '../brands/types';
import type { Product, ProductId } from '../products/types';

export type ScheduleId = string;
export type StageId = string;
export type WeekNumber = number;
export type StageType = 'VEGETATIVE' | 'FLOWERING';
export type ApplicationType = 'FERTIGATION' | 'FOLIAR';
export type FrequencyMode = 'FIXED_PER_WEEK' | 'EVERY_FERTIGATION';
export type DosageUnit = 'GRAM_PER_LITER' | 'MILLILITER_PER_LITER';
export type RuleStatus = 'ACTIVE' | 'NOT_APPLICABLE' | 'NO_RULE';
export type NonApplicationReason = 'STAGE_NOT_APPLICABLE' | 'WEEK_NOT_USED';
export type MissingRuleReason = 'MISSING' | 'UNCONFIRMED';
export type Dose =
  | { readonly unit: 'GRAM_PER_LITER'; readonly value: number }
  | { readonly unit: 'MILLILITER_PER_LITER'; readonly value: number };
export type Frequency =
  | { readonly mode: 'FIXED_PER_WEEK'; readonly prescribedApplicationsPerWeek: number }
  | { readonly mode: 'EVERY_FERTIGATION' };
export interface RuleKey {
  readonly productId: ProductId;
  readonly stageId: StageId;
  readonly weekNumber: WeekNumber;
}
export interface MissingRuleDiagnostic {
  readonly key: RuleKey;
  readonly reason: MissingRuleReason;
}
export interface RuleProvenance {
  readonly doseSourceIds: readonly string[];
  readonly applicationSourceIds: readonly string[];
  readonly frequencySourceIds: readonly string[];
  readonly applicabilitySourceIds: readonly string[];
}
interface RuleBase extends RuleKey {
  readonly provenance: RuleProvenance;
}
export type NutrientRule =
  | (RuleBase & { readonly status: 'ACTIVE'; readonly dose: Dose;
      readonly applicationType: ApplicationType; readonly frequency: Frequency })
  | (RuleBase & { readonly status: 'NOT_APPLICABLE'; readonly reason: NonApplicationReason })
  | (RuleBase & { readonly status: 'NO_RULE'; readonly reason: MissingRuleReason });
export interface SourceReference {
  readonly id: string;
  readonly kind: 'OFFICIAL_TABLE' | 'PRODUCT_DECISION';
  readonly title: string;
  readonly reference: string;
  readonly sourceDate: string | null;
  readonly notes?: string;
}
export interface ScheduleMetadata {
  readonly dataVersion: string;
  readonly providerScheduleVersion: string | null;
  readonly auditedAt: string;
  readonly sources: readonly SourceReference[];
  readonly notes?: string;
}
export interface StageDefinition {
  readonly id: StageId;
  readonly type: StageType;
  readonly label: string;
  readonly weekCount: number;
}
export interface FeedingSchedule {
  readonly id: ScheduleId;
  readonly brandId: BrandId;
  readonly name: string;
  readonly metadata: ScheduleMetadata;
  readonly products: readonly Product[];
  readonly stages: readonly StageDefinition[];
  readonly rules: readonly NutrientRule[];
}
