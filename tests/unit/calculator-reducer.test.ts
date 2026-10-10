import { describe, expect, it } from 'vitest';
import { calculatorReducer, createInitialState } from '@/features/calculator/state/calculator-reducer';
import { feedingSchedule } from '@/data/brands/plantas-que-curam/schedule';
import { deepFreeze } from './fixtures';

describe('local calculator state', () => {
  it('starts with empty strings, catalog defaults and first stage/week', () => {
    expect(createInitialState(feedingSchedule).draft).toEqual({ fertigationVolumeLiters: '', foliarVolumeLiters: '' });
    expect(createInitialState(feedingSchedule)).toMatchObject({ currentStep: 'CONFIGURATION', draft: { fertigationVolumeLiters: '', foliarVolumeLiters: '' }, selectedProductIds: feedingSchedule.products.map(p => p.id), viewedStageId: 'vegetative', viewedWeekNumber: 1, submittedStep: null });
  });
  it('updates configuration immutably and preserves partial input', () => {
    const initial = deepFreeze(createInitialState(feedingSchedule));
    const next = calculatorReducer(initial, { type: 'UPDATE_CONFIGURATION', field: 'foliarVolumeLiters', value: '1,' }, feedingSchedule);
    expect(next.draft.foliarVolumeLiters).toBe('1,');
    expect(initial.draft.foliarVolumeLiters).toBe('');
    const edited = calculatorReducer(next, { type: 'UPDATE_CONFIGURATION', field: 'fertigationVolumeLiters', value: '10.25' }, feedingSchedule);
    const advanced = calculatorReducer(edited, { type: 'NEXT' }, feedingSchedule);
    const returned = calculatorReducer(advanced, { type: 'BACK' }, feedingSchedule);
    expect(returned.draft).toEqual({ fertigationVolumeLiters: '10.25', foliarVolumeLiters: '1,' });
  });
  it('preserves empty selection on next/back; only a new mount restores defaults', () => {
    let state = createInitialState(feedingSchedule);
    for (const p of feedingSchedule.products) state = calculatorReducer(state, { type: 'TOGGLE_PRODUCT', productId: p.id }, feedingSchedule);
    state = calculatorReducer(state, { type: 'SUBMIT' }, feedingSchedule);
    expect(state.submittedStep).toBe('CONFIGURATION');
    state = calculatorReducer(state, { type: 'NEXT' }, feedingSchedule);
    expect(state.currentStep).toBe('PRODUCTS');
    expect(state.submittedStep).toBeNull();
    state = calculatorReducer(state, { type: 'BACK' }, feedingSchedule);
    expect(state.currentStep).toBe('CONFIGURATION');
    expect(state.selectedProductIds).toEqual([]);
    expect(createInitialState(feedingSchedule).selectedProductIds).toHaveLength(5);
  });
  it('toggles known products once and ignores unknown IDs', () => {
    const initial = createInitialState(feedingSchedule);
    const off = calculatorReducer(initial, { type: 'TOGGLE_PRODUCT', productId: 'joker' }, feedingSchedule);
    expect(off.selectedProductIds).not.toContain('joker');
    expect(calculatorReducer(off, { type: 'TOGGLE_PRODUCT', productId: 'joker' }, feedingSchedule).selectedProductIds).toEqual(initial.selectedProductIds);
    expect(calculatorReducer(initial, { type: 'TOGGLE_PRODUCT', productId: 'unknown' }, feedingSchedule)).toBe(initial);
  });
  it('derives filter bounds from schedule and keeps valid weeks on stage changes', () => {
    const schedule = { ...feedingSchedule, stages: [feedingSchedule.stages[0], { ...feedingSchedule.stages[1], weekCount: 3 }] };
    let state = createInitialState(schedule);
    state = calculatorReducer(state, { type: 'SET_WEEK', weekNumber: 2 }, schedule);
    state = calculatorReducer(state, { type: 'SET_STAGE', stageId: 'flowering' }, schedule);
    expect(state.viewedWeekNumber).toBe(2);
    state = calculatorReducer(state, { type: 'SET_STAGE', stageId: 'vegetative' }, schedule);
    state = calculatorReducer(state, { type: 'SET_WEEK', weekNumber: 8 }, schedule);
    state = calculatorReducer(state, { type: 'SET_STAGE', stageId: 'flowering' }, schedule);
    expect(state.viewedWeekNumber).toBe(1);
    expect(calculatorReducer(state, { type: 'SET_WEEK', weekNumber: 4 }, schedule)).toBe(state);
    expect(calculatorReducer(state, { type: 'SET_STAGE', stageId: 'unknown' }, schedule)).toBe(state);
  });
  it('bounds navigation and supports focused foliar return without resetting data', () => {
    let state = createInitialState(feedingSchedule);
    expect(calculatorReducer(state, { type: 'BACK' }, feedingSchedule).currentStep).toBe('CONFIGURATION');
    for (let i = 0; i < 6; i++) state = calculatorReducer(state, { type: 'NEXT' }, feedingSchedule);
    expect(state.currentStep).toBe('SUMMARY');
    state = calculatorReducer(state, { type: 'RETURN_TO_FOLIAR' }, feedingSchedule);
    expect(state.currentStep).toBe('CONFIGURATION');
    expect(state.submittedStep).toBe('PRODUCTS');
    expect(state.selectedProductIds).toHaveLength(5);
  });
});


describe('atomic weekly movement', () => {
  it.each([
    ['vegetative', 8, 1, 'flowering', 1],
    ['flowering', 1, -1, 'vegetative', 8],
    ['vegetative', 3, 1, 'vegetative', 4],
    ['flowering', 5, -1, 'flowering', 4],
  ] as const)('updates both fields from %s %d in direction %d', (stageId, weekNumber, direction, targetStage, targetWeek) => {
    const state = deepFreeze({ ...createInitialState(feedingSchedule), currentStep: 'PLAN' as const, submittedStep: 'PLAN' as const, viewedStageId: stageId, viewedWeekNumber: weekNumber, draft: { fertigationVolumeLiters: '10', foliarVolumeLiters: '2' }, selectedProductIds: ['joker'] });
    const next = calculatorReducer(state, { type: 'MOVE_WEEK', direction }, feedingSchedule);
    expect(next).toEqual({ ...state, viewedStageId: targetStage, viewedWeekNumber: targetWeek });
    expect(next.draft).toBe(state.draft); expect(next.selectedProductIds).toBe(state.selectedProductIds);
  });
  it.each([['vegetative', 1, -1], ['flowering', 8, 1], ['unknown', 1, 1], ['vegetative', 0, -1], ['flowering', 9, -1], ['vegetative', 1.5, 1]] as const)('returns the identical state for a limit or invalid position %s %d %d', (stageId, weekNumber, direction) => {
    const state = deepFreeze({ ...createInitialState(feedingSchedule), viewedStageId: stageId, viewedWeekNumber: weekNumber });
    expect(calculatorReducer(state, { type: 'MOVE_WEEK', direction }, feedingSchedule)).toBe(state);
  });
  it('distinguishes direct stage selection from crossing sequentially', () => {
    const state = { ...createInitialState(feedingSchedule), viewedWeekNumber: 8 };
    expect(calculatorReducer(state, { type: 'SET_STAGE', stageId: 'flowering' }, feedingSchedule)).toMatchObject({ viewedStageId: 'flowering', viewedWeekNumber: 8 });
    expect(calculatorReducer(state, { type: 'MOVE_WEEK', direction: 1 }, feedingSchedule)).toMatchObject({ viewedStageId: 'flowering', viewedWeekNumber: 1 });
  });
});
