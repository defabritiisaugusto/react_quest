import { Difficulty } from '../constants/difficulty';

export interface LevelDto {
  id: string;
  worldId: string;
  titleKey: string;
  descKey: string;
  order: number;
  difficulty: Difficulty;
  challengesCount: number;
  completedChallenges: number;
}
