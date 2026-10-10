import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import * as calculation from '@/domain/calculation/calculate-plan';
import { useCalculator } from '@/features/calculator/hooks/use-calculator';
import { feedingSchedule } from '@/data/brands/plantas-que-curam/schedule';
import type { FeedingSchedule } from '@/domain/nutrition/types';
import type { ConfigurationField } from '@/features/calculator/state/calculator-reducer';

function setup(schedule: FeedingSchedule = feedingSchedule) {
  const hook = renderHook(() => useCalculator(schedule));
  const update = (field: ConfigurationField, value: string) => act(() => hook.result.current.dispatch({ type: 'UPDATE_CONFIGURATION', field, value }));
  const toggle = (productId: string) => act(() => hook.result.current.dispatch({ type: 'TOGGLE_PRODUCT', productId }));
  const next = () => { let advanced = false; act(() => { advanced = hook.result.current.next(); }); return advanced; };
  return { ...hook, update, toggle, next };
}
describe('calculator controller gates', () => {
  it.each(['', '0', '-1', 'texto', '9'.repeat(400)])('blocks invalid fertigation volume %s', value => {
    const h = setup(); h.update('fertigationVolumeLiters', value);
    expect(h.next()).toBe(false);
    expect(h.result.current.configurationIssues.some(i => i.path === 'configuration.fertigationVolumeLiters')).toBe(true);
    expect(h.result.current.state.submittedStep).toBe('CONFIGURATION');
  });
  it('allows pending foliar to Products but blocks Plan and preserves draft/selection on return', () => {
    const h = setup(); h.update('fertigationVolumeLiters', '10,5');
    expect(h.next()).toBe(true);
    expect(h.result.current.state.currentStep).toBe('PRODUCTS');
    expect(h.result.current.requiresFoliar).toBe(true);
    expect(h.next()).toBe(false);
    expect(h.result.current.issues).toContainEqual({ code: 'REQUIRED', path: 'configuration.foliarVolumeLiters' });
    act(() => h.result.current.returnToFoliar());
    expect(h.result.current.state.draft.fertigationVolumeLiters).toBe('10,5');
    expect(h.result.current.state.selectedProductIds).toHaveLength(5);
    h.update('foliarVolumeLiters', '0,75');
    expect(h.next()).toBe(true); expect(h.next()).toBe(true);
    expect(h.result.current.state.currentStep).toBe('PLAN');
  });
  it.each(['', '0', '-2', 'invalido'])('ignores foliar draft %s with no selected ACTIVE/FOLIAR rule and revalidates when reactivated', raw => {
    const h = setup(); h.update('fertigationVolumeLiters', '10'); h.update('foliarVolumeLiters', raw);
    for (const id of ['coringa-blend', 'plant-protein', 'terpeno-plus']) h.toggle(id);
    expect(h.result.current.requiresFoliar).toBe(false);
    const response = h.result.current.response;
    expect(response.status).toBe('SUCCESS');
    if (response.status !== 'SUCCESS') throw new Error('Expected success');
    expect(response.result.configuration).not.toHaveProperty('foliarVolumeLiters');
    expect(response.result.configuration.fertigationApplicationsPerWeek).toBe(1);
    expect(h.result.current.state.draft).not.toHaveProperty('fertigationApplicationsPerWeek');
    expect(h.result.current.issues.some(i => i.path.endsWith('fertigationApplicationsPerWeek'))).toBe(false);
    expect(response.result.selectedProductIds).toEqual(['joker', 'tricomax']);
    expect(h.result.current.state.draft.foliarVolumeLiters).toBe(raw);
    h.toggle('plant-protein');
    expect(h.result.current.response.status).toBe('INVALID_INPUT');
    expect(h.result.current.requiresFoliar).toBe(true);
  });
  it('requires foliar from any week even when the viewed stage has no foliar applications', () => {
    const h = setup(); h.update('fertigationVolumeLiters', '10');
    for (const id of ['joker', 'plant-protein', 'terpeno-plus', 'tricomax']) h.toggle(id);
    act(() => h.result.current.dispatch({ type: 'SET_STAGE', stageId: 'flowering' }));
    expect(h.next()).toBe(true); expect(h.next()).toBe(false);
    expect(h.result.current.requiresFoliar).toBe(true);
    expect(h.result.current.issues).toContainEqual({ code: 'REQUIRED', path: 'configuration.foliarVolumeLiters' });
  });
  it('blocks empty selection and never restores defaults on back', () => {
    const h = setup(); h.update('fertigationVolumeLiters', '10'); expect(h.next()).toBe(true);
    for (const p of feedingSchedule.products) h.toggle(p.id);
    expect(h.next()).toBe(false);
    expect(h.result.current.issues).toContainEqual({ code: 'EMPTY_SELECTION', path: 'selectedProductIds' });
    act(() => h.result.current.back());
    expect(h.result.current.state.selectedProductIds).toEqual([]);
  });
  it('derives fresh quantities after edits and discards invalid results', () => {
    const h = setup(); h.update('fertigationVolumeLiters', '10'); h.update('foliarVolumeLiters', '2');
    const first = h.result.current.response;
    h.update('fertigationVolumeLiters', '20');
    const second = h.result.current.response;
    expect(first.status).toBe('SUCCESS'); expect(second.status).toBe('SUCCESS');
    if (first.status !== 'SUCCESS' || second.status !== 'SUCCESS') throw new Error('Expected success');
    expect(first.result.productTotals[0].cycle).toEqual({ status: 'COMPLETE', amount: { value: 260, unit: 'GRAM' } });
    expect(second.result.productTotals[0].cycle).toEqual({ status: 'COMPLETE', amount: { value: 520, unit: 'GRAM' } });
    expect(first.result.configuration.fertigationApplicationsPerWeek).toBe(1);
    expect(second.result.configuration.fertigationApplicationsPerWeek).toBe(1);
    h.update('fertigationVolumeLiters', '0');
    expect(h.result.current.response.status).toBe('INVALID_INPUT');
    expect(h.result.current.response).not.toHaveProperty('result');
  });
  it('excludes deselected products from every projection without redistributing other amounts', () => {
    const h = setup(); h.update('fertigationVolumeLiters', '10'); h.update('foliarVolumeLiters', '2');
    const before = h.result.current.response;
    h.toggle('joker');
    const after = h.result.current.response;
    if (before.status !== 'SUCCESS' || after.status !== 'SUCCESS') throw new Error('Expected success');
    expect(after.result.weeks.every(week => week.entries.every(entry => entry.productId !== 'joker'))).toBe(true);
    expect(after.result.productTotals).toEqual(before.result.productTotals.filter(total => total.productId !== 'joker'));
    expect(after.result.weeks.map(week => week.entries)).toEqual(before.result.weeks.map(week => week.entries.filter(entry => entry.productId !== 'joker')));
  });
  it('uses rule semantics from neutral IDs instead of partner names', () => {
    const schedule: FeedingSchedule = { ...feedingSchedule, products: feedingSchedule.products.map(p => ({ ...p, id: `neutral-${p.id}` })), rules: feedingSchedule.rules.map(r => ({ ...r, productId: `neutral-${r.productId}` })) };
    const h = setup(schedule); h.update('fertigationVolumeLiters', '10');
    expect(h.result.current.requiresFoliar).toBe(true);
    expect(h.result.current.issues.some(i => i.path === 'configuration.foliarVolumeLiters')).toBe(true);
  });
  it.each(['INVALID_SCHEDULE', 'NUMERIC_ERROR'] as const)('never permits Plan on %s', status => {
    const schedule = status === 'INVALID_SCHEDULE' ? { ...feedingSchedule, stages: [] } : feedingSchedule;
    const h = setup(schedule); h.update('fertigationVolumeLiters', status === 'NUMERIC_ERROR' ? '1' + '0'.repeat(308) : '10'); h.update('foliarVolumeLiters', '2');
    expect(h.next()).toBe(true); expect(h.next()).toBe(false);
    expect(h.result.current.response.status).toBe(status);
    expect(h.result.current.response).not.toHaveProperty('result');
  });
  it('reuses the canonical response across filters and navigation, invalidating only when inputs change', () => {
    const h = setup(); h.update('fertigationVolumeLiters', '10'); h.update('foliarVolumeLiters', '2');
    const response = h.result.current.response;
    h.next(); h.next();
    act(() => h.result.current.dispatch({ type: 'SET_WEEK', weekNumber: 4 }));
    act(() => h.result.current.dispatch({ type: 'SET_STAGE', stageId: 'flowering' }));
    h.next(); h.next(); act(() => h.result.current.back());
    expect(h.result.current.response).toBe(response);
    h.update('fertigationVolumeLiters', '20'); expect(h.result.current.response).not.toBe(response);
  });

});


describe('weekly presentation preserves canonical calculation', () => {
  it('does not rerun the motor or change inputs, products and totals across the full cycle and direct filters', () => {
    const motor = vi.spyOn(calculation, 'calculateNutritionPlan');
    try {
      const h = setup(); h.update('fertigationVolumeLiters', '10'); h.update('foliarVolumeLiters', '2');
      h.toggle('terpeno-plus'); h.next(); h.next();
      const original = h.result.current;
      const calls = motor.mock.calls.length;
      const move = (direction: -1 | 1) => act(() => h.result.current.dispatch({ type: 'MOVE_WEEK', direction }));
      for (let i = 0; i < 15; i++) move(1);
      expect(h.result.current.state).toMatchObject({ viewedStageId: 'flowering', viewedWeekNumber: 8, currentStep: 'PLAN', submittedStep: null });
      move(1);
      for (let i = 0; i < 15; i++) move(-1);
      move(-1);
      expect(h.result.current.state).toMatchObject({ viewedStageId: 'vegetative', viewedWeekNumber: 1 });
      act(() => h.result.current.dispatch({ type: 'SET_STAGE', stageId: 'flowering' }));
      act(() => h.result.current.dispatch({ type: 'SET_WEEK', weekNumber: 5 }));
      h.next(); h.next(); act(() => h.result.current.back()); act(() => h.result.current.back());
      expect(h.result.current.state).toMatchObject({ viewedStageId: 'flowering', viewedWeekNumber: 5, currentStep: 'PLAN' });
      expect(h.result.current.state.draft).toBe(original.state.draft);
      expect(h.result.current.state.selectedProductIds).toBe(original.state.selectedProductIds);
      expect(h.result.current.response).toBe(original.response);
      expect(motor).toHaveBeenCalledTimes(calls);
    } finally { motor.mockRestore(); }
  });
});
