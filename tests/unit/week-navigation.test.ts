import { describe, expect, it } from 'vitest';
import { getAdjacentWeek, type WeekPosition } from '@/features/calculator/state/week-navigation';
import { feedingSchedule } from '@/data/brands/plantas-que-curam/schedule';
import { deepFreeze } from './fixtures';

const positions: WeekPosition[] = feedingSchedule.stages.flatMap(stage => Array.from({ length: stage.weekCount }, (_, index) => ({ stageId: stage.id, weekNumber: index + 1 })));
describe('adjacent schedule position', () => {
  it.each(positions)('moves in both directions from $stageId $weekNumber without wrapping', position => {
    const index = positions.findIndex(p => p.stageId === position.stageId && p.weekNumber === position.weekNumber);
    const stages = deepFreeze([...feedingSchedule.stages]);
    expect(getAdjacentWeek(stages, position, -1)).toEqual(positions[index - 1] ?? null);
    expect(getAdjacentWeek(stages, position, 1)).toEqual(positions[index + 1] ?? null);
  });
  it.each([0, -1, 9, 1.5, NaN, Infinity])('has no destination for invalid week %s', weekNumber => {
    for (const direction of [-1, 1] as const) expect(getAdjacentWeek(feedingSchedule.stages, { stageId: 'vegetative', weekNumber }, direction)).toBeNull();
  });
  it('has no destination for unknown stages or an empty schedule', () => {
    for (const direction of [-1, 1] as const) {
      expect(getAdjacentWeek(feedingSchedule.stages, { stageId: 'unknown', weekNumber: 1 }, direction)).toBeNull();
      expect(getAdjacentWeek([], positions[0], direction)).toBeNull();
    }
  });
  it('uses supplied order and unequal counts across three neutral stages', () => {
    const stages = deepFreeze([
      { ...feedingSchedule.stages[1], id: 'alpha', weekCount: 2 },
      { ...feedingSchedule.stages[0], id: 'beta', weekCount: 1 },
      { ...feedingSchedule.stages[1], id: 'gamma', weekCount: 3 },
    ]);
    const ordered = stages.flatMap(s => Array.from({ length: s.weekCount }, (_, i) => ({ stageId: s.id, weekNumber: i + 1 })));
    for (const [index, position] of ordered.entries()) {
      expect(getAdjacentWeek(stages, position, 1)).toEqual(ordered[index + 1] ?? null);
      expect(getAdjacentWeek(stages, position, -1)).toEqual(ordered[index - 1] ?? null);
    }
  });
});
