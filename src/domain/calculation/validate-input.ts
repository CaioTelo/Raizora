import type { CalculationInput, ValidationIssue } from './types';

/** Numeric validation shared by the engine and future presentation adapter. */
export function validateCalculationInput(input: CalculationInput): readonly ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const { schedule, configuration, selectedProductIds } = input;
  const volume = (value: number | undefined, field: string, required: boolean): void => {
    const path = `configuration.${field}`;
    if (value === undefined) { if (required) issues.push({ code: 'REQUIRED', path }); }
    else if (!Number.isFinite(value)) issues.push({ code: 'INVALID_NUMBER', path });
    else if (value <= 0) issues.push({ code: 'NON_POSITIVE', path });
  };
  volume(configuration.fertigationVolumeLiters, 'fertigationVolumeLiters', true);
  const count = configuration.fertigationApplicationsPerWeek;
  if (count === undefined) issues.push({ code: 'REQUIRED', path: 'configuration.fertigationApplicationsPerWeek' });
  else if (!Number.isSafeInteger(count) || count < 1) issues.push({ code: 'INVALID_COUNT', path: 'configuration.fertigationApplicationsPerWeek' });
  if (selectedProductIds.length === 0) issues.push({ code: 'EMPTY_SELECTION', path: 'selectedProductIds' });
  const seen = new Set<string>();
  const known = new Set(schedule.products.map(p => p.id));
  selectedProductIds.forEach((productId, i) => {
    const path = `selectedProductIds[${i}]`;
    if (!known.has(productId)) issues.push({ code: 'UNKNOWN_PRODUCT', path, productId });
    if (seen.has(productId)) issues.push({ code: 'DUPLICATE_ID', path, productId });
    seen.add(productId);
  });
  const needsFoliar = schedule.rules.some(rule => seen.has(rule.productId) && rule.status === 'ACTIVE' && rule.applicationType === 'FOLIAR');
  volume(configuration.foliarVolumeLiters, 'foliarVolumeLiters', needsFoliar);
  return issues;
}
