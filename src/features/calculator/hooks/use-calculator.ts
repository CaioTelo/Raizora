import { useMemo, useReducer } from 'react';
import type { FeedingSchedule } from '@/domain/nutrition/types';
import type { CalculationResponse, ValidationIssue } from '@/domain/calculation/types';
import { calculatorReducer, createInitialState, type CalculatorAction, type CalculatorState } from '../state/calculator-reducer';
import { parseInput } from '../presentation/parse-input';
import { validateCalculationInput } from '@/domain/calculation/validate-input';
import { calculateNutritionPlan } from '@/domain/calculation/calculate-plan';

/** Adapt drafts once; the domain owns numeric validity and all arithmetic. */
function deriveCalculator(state: Pick<CalculatorState, 'draft' | 'selectedProductIds'>, schedule: FeedingSchedule) {
  const requiresFoliar = schedule.rules.some(rule => state.selectedProductIds.includes(rule.productId) && rule.status === 'ACTIVE' && rule.applicationType === 'FOLIAR');
  const fertigation = parseInput(state.draft.fertigationVolumeLiters, 'volume');
  const foliar = requiresFoliar ? parseInput(state.draft.foliarVolumeLiters, 'volume') : undefined;
  const parsed = [
    { field: 'fertigationVolumeLiters', value: fertigation },
    ...(foliar ? [{ field: 'foliarVolumeLiters', value: foliar }] : []),
  ];
  const parserIssues: ValidationIssue[] = parsed.flatMap(({ field, value }) => value.ok ? [] : [{ code: value.code, path: `configuration.${field}` }]);
  const input = { schedule, selectedProductIds: state.selectedProductIds, configuration: {
    fertigationVolumeLiters: fertigation.ok ? fertigation.value : NaN,
    // Application policy only; domain callers retain their generic frequency contract.
    fertigationApplicationsPerWeek: 1,
    ...(foliar?.ok ? { foliarVolumeLiters: foliar.value } : {}),
  } };
  const issues = [...parserIssues, ...validateCalculationInput(input).filter(issue => !parserIssues.some(parsed => parsed.path === issue.path))];
  const response: CalculationResponse = issues.length ? { status: 'INVALID_INPUT', issues } : calculateNutritionPlan(input);
  const configurationIssues = issues.filter(issue => issue.path === 'configuration.fertigationVolumeLiters');
  return { response, issues, configurationIssues, requiresFoliar };
}
export function useCalculator(schedule: FeedingSchedule) {
  const [state, dispatch] = useReducer((state: CalculatorState, action: CalculatorAction) => calculatorReducer(state, action, schedule), schedule, createInitialState);
  const derived = useMemo(() => deriveCalculator({ draft: state.draft, selectedProductIds: state.selectedProductIds }, schedule), [state.draft, state.selectedProductIds, schedule]);
  function next(): boolean {
    dispatch({ type: 'SUBMIT' });
    const valid = state.currentStep === 'CONFIGURATION' ? derived.configurationIssues.length === 0 : derived.response.status === 'SUCCESS';
    if (valid) dispatch({ type: 'NEXT' });
    return valid;
  }
  return { state, dispatch, ...derived, next,
    back: () => dispatch({ type: 'BACK' }), returnToFoliar: () => dispatch({ type: 'RETURN_TO_FOLIAR' }) };
}
export type CalculatorController = ReturnType<typeof useCalculator>;
