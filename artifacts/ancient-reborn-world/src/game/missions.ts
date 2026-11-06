export type PropKind =
  | 'snack'
  | 'tripod'
  | 'battery'
  | 'camera'
  | 'map'
  | 'balloon'
  | 'spotlight'
  | 'clapper'
  | 'star';

export type MissionCheckpoint = {
  id: string;
  label: string;
  kind: PropKind;
  position: [number, number];
};

export type GameMission = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  briefing: string;
  reward: string;
  timeLimitSeconds?: number;
  checkpoints: MissionCheckpoint[];
};

export type MissionProgress = {
  found: string[];
  completed: boolean;
  bestTimeSeconds?: number;
};

export type GameSave = {
  version: 1;
  activeMissionId: string;
  missions: Record<string, MissionProgress>;
};

export const GAME_MISSIONS: GameMission[] = [
  {
    id: 'snack-patrol',
    number: '01',
    title: 'Snack Patrol',
    subtitle: 'The crumbs are not the map.',
    briefing: 'Bongo made a snack trail to the picnic. Kiko says the trail is going in the wrong direction. Find every snack before the ants become the crew.',
    reward: 'The emergency snack badge',
    checkpoints: [
      { id: 'snack-patrol-a', label: 'Find the apple', kind: 'snack', position: [4, -5] },
      { id: 'snack-patrol-b', label: 'Recover the biscuit', kind: 'snack', position: [10, 2] },
      { id: 'snack-patrol-c', label: 'Save the last sandwich', kind: 'snack', position: [-5, 9] },
    ],
  },
  {
    id: 'tripod-trouble',
    number: '02',
    title: 'Tripod Trouble',
    subtitle: 'Three legs. Zero agreement.',
    briefing: 'Kiko needs a steady shot. Bongo has scattered the tripod pieces while demonstrating a “quick setup.” Put the kit back together.',
    reward: 'The steady-camera badge',
    checkpoints: [
      { id: 'tripod-trouble-a', label: 'Find the tripod head', kind: 'tripod', position: [-7, -4] },
      { id: 'tripod-trouble-b', label: 'Fetch a camera leg', kind: 'tripod', position: [12, -8] },
      { id: 'tripod-trouble-c', label: 'Recover the last leg', kind: 'tripod', position: [3, 12] },
    ],
  },
  {
    id: 'battery-bounce',
    number: '03',
    title: 'Battery Bounce',
    subtitle: 'The camera is at 1%.',
    briefing: 'The camera is blinking red, and Bongo has hidden spare batteries in “safe places.” Find all three before Kiko has to mime the rest of the episode.',
    reward: 'The full-charge badge',
    checkpoints: [
      { id: 'battery-bounce-a', label: 'Charge by the palms', kind: 'battery', position: [7, 7] },
      { id: 'battery-bounce-b', label: 'Charge near the arch', kind: 'battery', position: [-12, 3] },
      { id: 'battery-bounce-c', label: 'Charge by the dock', kind: 'battery', position: [1, -13] },
    ],
  },
  {
    id: 'perfectly-framed',
    number: '04',
    title: 'Perfectly Framed',
    subtitle: 'Kiko is not convinced.',
    briefing: 'Capture four scenic viewpoints for Kiko’s “definitely not a vacation montage.” Stand close to each camera mark and tap it to record the shot.',
    reward: 'The director’s-eye badge',
    checkpoints: [
      { id: 'perfectly-framed-a', label: 'Frame the lighthouse', kind: 'camera', position: [-14, -8] },
      { id: 'perfectly-framed-b', label: 'Frame the beach', kind: 'camera', position: [14, -2] },
      { id: 'perfectly-framed-c', label: 'Frame the palms', kind: 'camera', position: [-4, 14] },
      { id: 'perfectly-framed-d', label: 'Frame the big rock', kind: 'camera', position: [9, 10] },
    ],
  },
  {
    id: 'map-muddle',
    number: '05',
    title: 'Map Muddle',
    subtitle: 'North is a suggestion.',
    briefing: 'Bongo’s hand-drawn map was folded, unfolded, and accidentally used as a napkin. Find the missing map scraps and chart a way back to the picnic.',
    reward: 'The cartographer’s badge',
    checkpoints: [
      { id: 'map-muddle-a', label: 'Find the corner scrap', kind: 'map', position: [0, -15] },
      { id: 'map-muddle-b', label: 'Find the squiggly bit', kind: 'map', position: [-15, 6] },
      { id: 'map-muddle-c', label: 'Find the picnic mark', kind: 'map', position: [11, 12] },
    ],
  },
  {
    id: 'balloon-wrangler',
    number: '06',
    title: 'Balloon Wrangler',
    subtitle: 'Bongo said “hold these.”',
    briefing: 'The rehearsal balloons have escaped. Catch the three floating props before Kiko has to replace the whole scene with sound effects.',
    reward: 'The calm-under-pressure badge',
    checkpoints: [
      { id: 'balloon-wrangler-a', label: 'Catch the blue balloon', kind: 'balloon', position: [15, 6] },
      { id: 'balloon-wrangler-b', label: 'Catch the yellow balloon', kind: 'balloon', position: [-10, -12] },
      { id: 'balloon-wrangler-c', label: 'Catch the red balloon', kind: 'balloon', position: [-2, 5] },
    ],
  },
  {
    id: 'light-it-up',
    number: '07',
    title: 'Light It Up',
    subtitle: 'The spotlight is on the snacks.',
    briefing: 'Bongo pointed every stage light at the snack table. Re-aim the four lights so the duo, not the biscuits, gets the dramatic entrance.',
    reward: 'The lighting-crew badge',
    checkpoints: [
      { id: 'light-it-up-a', label: 'Set the beach light', kind: 'spotlight', position: [-15, 0] },
      { id: 'light-it-up-b', label: 'Set the palm light', kind: 'spotlight', position: [8, -14] },
      { id: 'light-it-up-c', label: 'Set the arch light', kind: 'spotlight', position: [14, 10] },
      { id: 'light-it-up-d', label: 'Set the stage light', kind: 'spotlight', position: [-5, 11] },
    ],
  },
  {
    id: 'clapper-hunt',
    number: '08',
    title: 'Clapper Hunt',
    subtitle: 'Action! Wait, where is it?',
    briefing: 'The clapperboard has broken into three pieces. Find them before Bongo calls “action” on a completely different take.',
    reward: 'The continuity badge',
    checkpoints: [
      { id: 'clapper-hunt-a', label: 'Find the top slate', kind: 'clapper', position: [-9, 10] },
      { id: 'clapper-hunt-b', label: 'Find the handle', kind: 'clapper', position: [4, -11] },
      { id: 'clapper-hunt-c', label: 'Find the hinge', kind: 'clapper', position: [14, -10] },
    ],
  },
  {
    id: 'one-take-dash',
    number: '09',
    title: 'One-Take Dash',
    subtitle: 'No retakes. (Probably.)',
    briefing: 'Reach the four recording marks before the timer runs out. Kiko is rolling, Bongo is improvising, and there is absolutely no time for another take.',
    reward: 'The one-take wonder badge',
    timeLimitSeconds: 75,
    checkpoints: [
      { id: 'one-take-dash-a', label: 'Hit the beach mark', kind: 'star', position: [-12, -9] },
      { id: 'one-take-dash-b', label: 'Hit the palm mark', kind: 'star', position: [12, -5] },
      { id: 'one-take-dash-c', label: 'Hit the arch mark', kind: 'star', position: [8, 13] },
      { id: 'one-take-dash-d', label: 'Hit the finale mark', kind: 'star', position: [-7, 7] },
    ],
  },
  {
    id: 'big-finale',
    number: '10',
    title: 'The Big Finale',
    subtitle: 'Two friends. One last take.',
    briefing: 'The grand finale needs a snack, a map, a working camera, and both friends on set. Bring the four pieces together and make this one count.',
    reward: 'The Bongo & Kiko all-star badge',
    checkpoints: [
      { id: 'big-finale-a', label: 'Bring the snack', kind: 'snack', position: [2, -14] },
      { id: 'big-finale-b', label: 'Bring the map', kind: 'map', position: [-14, 9] },
      { id: 'big-finale-c', label: 'Bring the camera', kind: 'camera', position: [15, 4] },
      { id: 'big-finale-d', label: 'Meet the duo at the stage', kind: 'star', position: [0, 0] },
    ],
  },
];

export function createEmptyGameSave(): GameSave {
  return {
    version: 1,
    activeMissionId: GAME_MISSIONS[0].id,
    missions: Object.fromEntries(
      GAME_MISSIONS.map((mission) => [
        mission.id,
        { found: [], completed: false } satisfies MissionProgress,
      ]),
    ),
  };
}
