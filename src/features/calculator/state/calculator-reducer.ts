import type { FeedingSchedule } from '@/domain/nutrition/types';
import { getAdjacentWeek, type WeekDirection } from './week-navigation';
export type CalculatorStep = 'CONFIGURATION' | 'PRODUCTS' | 'PLAN' | 'RECIPE' | 'SUMMARY';
export interface ConfigurationDraft { readonly fertigationVolumeLiters: string; readonly foliarVolumeLiters: string }
export type ConfigurationField = keyof ConfigurationDraft;
export interface CalculatorState {
  readonly currentStep: CalculatorStep;
  readonly draft: ConfigurationDraft;
  readonly selectedProductIds: readonly string[];
  readonly viewedStageId: string;
  readonly viewedWeekNumber: number;
  readonly submittedStep: CalculatorStep | null;
}
export type CalculatorAction =
  | { readonly type: 'UPDATE_CONFIGURATION'; readonly field: ConfigurationField; readonly value: string }
  | { readonly type: 'TOGGLE_PRODUCT'; readonly productId: string }
  | { readonly type: 'MOVE_WEEK'; readonly direction: WeekDirection }
  | { readonly type: 'SET_STAGE'; readonly stageId: string }
  | { readonly type: 'SET_WEEK'; readonly weekNumber: number }
  | { readonly type: 'NEXT' | 'BACK' | 'SUBMIT' | 'RETURN_TO_FOLIAR' };
export function createInitialState(schedule: FeedingSchedule): CalculatorState {
  return { currentStep: 'CONFIGURATION', draft: { fertigationVolumeLiters: '', foliarVolumeLiters: '' }, selectedProductIds: schedule.products.map(product => product.id), viewedStageId: schedule.stages[0]?.id ?? '', viewedWeekNumber: 1, submittedStep: null };
}
const steps: readonly CalculatorStep[] = ['CONFIGURATION', 'PRODUCTS', 'PLAN', 'RECIPE', 'SUMMARY'];
export function calculatorReducer(state: CalculatorState, action: CalculatorAction, schedule: FeedingSchedule): CalculatorState {
  switch (action.type) {
    case 'UPDATE_CONFIGURATION': return { ...state, draft: { ...state.draft, [action.field]: action.value } };
    case 'TOGGLE_PRODUCT': {
      if (!schedule.products.some(product => product.id === action.productId)) return state;
      const selected = new Set(state.selectedProductIds);
      if (selected.has(action.productId)) selected.delete(action.productId);
      else selected.add(action.productId);
      return { ...state, selectedProductIds: schedule.products.filter(product => selected.has(product.id)).map(product => product.id) };
    }
    case 'SUBMIT': return { ...state, submittedStep: state.currentStep };
    case 'NEXT': return { ...state, currentStep: steps[Math.min(steps.indexOf(state.currentStep) + 1, steps.length - 1)], submittedStep: null };
    case 'BACK': return { ...state, currentStep: steps[Math.max(steps.indexOf(state.currentStep) - 1, 0)], submittedStep: null };
    case 'RETURN_TO_FOLIAR': return { ...state, currentStep: 'CONFIGURATION', submittedStep: 'PRODUCTS' };
    case 'MOVE_WEEK': {
      const position = getAdjacentWeek(schedule.stages, { stageId: state.viewedStageId, weekNumber: state.viewedWeekNumber }, action.direction);
      return position ? { ...state, viewedStageId: position.stageId, viewedWeekNumber: position.weekNumber } : state;
    }
    case 'SET_STAGE': {
      const stage = schedule.stages.find(stage => stage.id === action.stageId);
      return stage ? { ...state, viewedStageId: stage.id, viewedWeekNumber: state.viewedWeekNumber <= stage.weekCount ? state.viewedWeekNumber : 1 } : state;
    }
    case 'SET_WEEK': {
      const stage = schedule.stages.find(stage => stage.id === state.viewedStageId);
      return stage && Number.isInteger(action.weekNumber) && action.weekNumber >= 1 && action.weekNumber <= stage.weekCount
        ? { ...state, viewedWeekNumber: action.weekNumber } : state;
    }
  }
}
