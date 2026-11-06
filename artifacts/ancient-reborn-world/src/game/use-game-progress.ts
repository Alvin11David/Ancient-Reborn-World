import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createEmptyGameSave,
  GAME_MISSIONS,
  type GameSave,
  type MissionProgress,
} from './missions';

const STORAGE_KEY = 'bongo-kiko-side-quest-save-v1';

function isMissionProgress(value: unknown): value is MissionProgress {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'found' in value &&
      Array.isArray(value.found) &&
      value.found.every((id) => typeof id === 'string') &&
      'completed' in value &&
      typeof value.completed === 'boolean' &&
      (!('bestTimeSeconds' in value) ||
        typeof value.bestTimeSeconds === 'number'),
  );
}

function loadGameSave(): GameSave {
  const empty = createEmptyGameSave();
  if (typeof window === 'undefined') return empty;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return empty;
    const parsed: unknown = JSON.parse(saved);
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !('version' in parsed) ||
      parsed.version !== 1 ||
      !('missions' in parsed) ||
      !parsed.missions ||
      typeof parsed.missions !== 'object'
    ) {
      return empty;
    }

    const storedMissions = parsed.missions as Record<string, unknown>;
    const missions = { ...empty.missions };
    for (const mission of GAME_MISSIONS) {
      const storedProgress = storedMissions[mission.id];
      if (isMissionProgress(storedProgress)) {
        const knownCheckpointIds = new Set(
          mission.checkpoints.map((checkpoint) => checkpoint.id),
        );
        missions[mission.id] = {
          found: storedProgress.found.filter((id) =>
            knownCheckpointIds.has(id),
          ),
          completed: storedProgress.completed,
          ...(typeof storedProgress.bestTimeSeconds === 'number'
            ? { bestTimeSeconds: storedProgress.bestTimeSeconds }
            : {}),
        };
      }
    }

    const storedActiveId =
      'activeMissionId' in parsed && typeof parsed.activeMissionId === 'string'
        ? parsed.activeMissionId
        : empty.activeMissionId;
    const activeMission = GAME_MISSIONS.find(
      (mission) => mission.id === storedActiveId,
    );

    return {
      version: 1,
      activeMissionId: activeMission?.id ?? empty.activeMissionId,
      missions,
    };
  } catch {
    return empty;
  }
}

export function useGameProgress() {
  const [save, setSave] = useState<GameSave>(loadGameSave);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
    } catch {
      // Keep the active session playable when browser storage is unavailable.
    }
  }, [save]);

  const activeMission = useMemo(
    () =>
      GAME_MISSIONS.find((mission) => mission.id === save.activeMissionId) ??
      GAME_MISSIONS[0],
    [save.activeMissionId],
  );

  const isMissionUnlocked = useCallback(
    (missionId: string) => {
      const index = GAME_MISSIONS.findIndex(
        (mission) => mission.id === missionId,
      );
      if (index <= 0) return index === 0;
      return save.missions[GAME_MISSIONS[index - 1].id]?.completed ?? false;
    },
    [save.missions],
  );

  const selectMission = useCallback(
    (missionId: string) => {
      const isKnownMission = GAME_MISSIONS.some(
        (mission) => mission.id === missionId,
      );
      if (!isKnownMission) return;
      setSave((previous) => {
        const index = GAME_MISSIONS.findIndex(
          (mission) => mission.id === missionId,
        );
        const unlocked =
          index === 0 ||
          previous.missions[GAME_MISSIONS[index - 1].id]?.completed === true;
        return unlocked
          ? { ...previous, activeMissionId: missionId }
          : previous;
      });
    },
    [],
  );

  const completeCheckpoint = useCallback(
    (missionId: string, checkpointId: string, elapsedSeconds?: number) => {
      const mission = GAME_MISSIONS.find((item) => item.id === missionId);
      if (!mission) return;
      if (!mission.checkpoints.some((checkpoint) => checkpoint.id === checkpointId))
        return;

      setSave((previous) => {
        const current = previous.missions[missionId] ?? {
          found: [],
          completed: false,
        };
        if (current.found.includes(checkpointId)) return previous;

        const found = [...current.found, checkpointId];
        const completed = mission.checkpoints.every((checkpoint) =>
          found.includes(checkpoint.id),
        );
        const bestTimeSeconds =
          completed &&
          typeof elapsedSeconds === 'number' &&
          Number.isFinite(elapsedSeconds)
            ? Math.min(current.bestTimeSeconds ?? Infinity, elapsedSeconds)
            : current.bestTimeSeconds;

        return {
          ...previous,
          missions: {
            ...previous.missions,
            [missionId]: {
              found,
              completed: current.completed || completed,
              ...(bestTimeSeconds !== undefined
                ? { bestTimeSeconds }
                : {}),
            },
          },
        };
      });
    },
    [],
  );

  const resetMission = useCallback((missionId: string) => {
    if (!GAME_MISSIONS.some((mission) => mission.id === missionId)) return;
    setSave((previous) => ({
      ...previous,
      missions: {
        ...previous.missions,
        [missionId]: { found: [], completed: false },
      },
    }));
  }, []);

  const completedCount = GAME_MISSIONS.filter(
    (mission) => save.missions[mission.id]?.completed,
  ).length;

  return {
    save,
    activeMission,
    activeProgress: save.missions[activeMission.id] ?? {
      found: [],
      completed: false,
    },
    completedCount,
    isMissionUnlocked,
    selectMission,
    completeCheckpoint,
    resetMission,
  };
}
