import type { StageDefinition } from '@/domain/nutrition/types';

export interface WeekPosition {
  readonly stageId: string;
  readonly weekNumber: number;
}
export type WeekDirection = -1 | 1;

/** Presentation position only; order and bounds belong to the supplied schedule. */
export function getAdjacentWeek(stages: readonly StageDefinition[], position: WeekPosition, direction: WeekDirection): WeekPosition | null {
  const index = stages.findIndex(stage => stage.id === position.stageId);
  const stage = stages[index];
  if (!stage || !Number.isInteger(position.weekNumber) || position.weekNumber < 1 || position.weekNumber > stage.weekCount) return null;
  const weekNumber = position.weekNumber + direction;
  if (weekNumber >= 1 && weekNumber <= stage.weekCount) return { stageId: stage.id, weekNumber };
  const adjacent = stages[index + direction];
  if (!adjacent || !Number.isInteger(adjacent.weekCount) || adjacent.weekCount < 1) return null;
  return { stageId: adjacent.id, weekNumber: direction === 1 ? 1 : adjacent.weekCount };
}
