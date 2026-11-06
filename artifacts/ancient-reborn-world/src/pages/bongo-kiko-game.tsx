import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject, type PointerEvent } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { KeyboardControls, useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowRight, Camera, Check, ChevronLeft, ChevronRight, Clock3, Compass, Footprints, LockKeyhole, RotateCcw, Star, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { GAME_MISSIONS, type GameMission, type MissionCheckpoint, type PropKind } from '../game/missions';
import { useGameProgress } from '../game/use-game-progress';
import './bongo-kiko-game.css';

type InputState = { x: number; z: number; jump: boolean };
type Point = { x: number; z: number };
type GameControl = 'forward' | 'backward' | 'left' | 'right' | 'jump' | 'interact';

const keyboardMap: { name: GameControl; keys: string[] }[] = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'interact', keys: ['KeyE'] },
];

const mat = {
  grass: new THREE.MeshStandardMaterial({ color: '#8fc574', flatShading: true }),
  grassLight: new THREE.MeshStandardMaterial({ color: '#a7cf79', flatShading: true }),
  sand: new THREE.MeshStandardMaterial({ color: '#efd28a', flatShading: true }),
  water: new THREE.MeshStandardMaterial({ color: '#5bbbc1', flatShading: true, roughness: 0.85 }),
  trunk: new THREE.MeshStandardMaterial({ color: '#986443', flatShading: true }),
  leaf: new THREE.MeshStandardMaterial({ color: '#398b68', flatShading: true }),
  leafLight: new THREE.MeshStandardMaterial({ color: '#6cae70', flatShading: true }),
  red: new THREE.MeshStandardMaterial({ color: '#e84c3d', flatShading: true }),
  blue: new THREE.MeshStandardMaterial({ color: '#4269d7', flatShading: true }),
  skin: new THREE.MeshStandardMaterial({ color: '#e8ad75', flatShading: true }),
  hair: new THREE.MeshStandardMaterial({ color: '#3f302c', flatShading: true }),
  dark: new THREE.MeshStandardMaterial({ color: '#29342e', flatShading: true }),
  cream: new THREE.MeshStandardMaterial({ color: '#fff0c8', flatShading: true }),
  yellow: new THREE.MeshStandardMaterial({ color: '#f5d35b', flatShading: true }),
  coral: new THREE.MeshStandardMaterial({ color: '#ef715d', flatShading: true }),
  purple: new THREE.MeshStandardMaterial({ color: '#9b77c6', flatShading: true }),
  wood: new THREE.MeshStandardMaterial({ color: '#b77a4a', flatShading: true }),
  metal: new THREE.MeshStandardMaterial({ color: '#d5e2dc', flatShading: true, metalness: 0.25, roughness: 0.6 }),
};
const geo = {
  sphere: new THREE.SphereGeometry(1, 8, 6),
  box: new THREE.BoxGeometry(1, 1, 1),
  trunk: new THREE.CylinderGeometry(0.23, 0.38, 3.3, 6),
  frond: new THREE.ConeGeometry(0.52, 2.65, 5),
  palmTop: new THREE.ConeGeometry(0.55, 1.15, 5),
  marker: new THREE.CylinderGeometry(0.62, 0.62, 0.14, 12),
  smallCone: new THREE.ConeGeometry(0.5, 1, 5),
};

const palmSpots: [number, number, number][] = [
  [-18, -11, 0.1], [-17, 6, 0.7], [-12, 15, 0.25], [-5, -17, 0.85], [2, -19, 0.15],
  [10, -16, 0.45], [18, -11, 0.2], [19, 3, 0.65], [15, 15, 0.35], [3, 18, 0.9],
  [-13, -2, 0.55], [10, 8, 0.05],
];
const boulderSpots: [number, number, number, number, number][] = [
  [-13, -14, 1.6, 0.8, 1.2],
  [-16, 10, 1.15, 0.72, 1.05],
  [16, -8, 1.5, 0.72, 1.1],
  [14, 12, 1.7, 0.88, 1.25],
  [-9, 16, 1.2, 0.72, 1],
  [9, 16, 1.3, 0.7, 1.05],
  [17, 1, 1.05, 0.65, 0.9],
  [0, -17, 1.3, 0.68, 1.1],
];

function PalmGrove() {
  const trunks = useMemo(() => {
    const mesh = new THREE.InstancedMesh(geo.trunk, mat.trunk, palmSpots.length);
    const dummy = new THREE.Object3D();
    palmSpots.forEach(([x, z, rotation], i) => {
      dummy.position.set(x, 1.05, z);
      dummy.rotation.z = -0.12 - rotation * 0.12;
      dummy.rotation.y = rotation * Math.PI * 2;
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    return mesh;
  }, []);
  const fronds = useMemo(() => {
    const mesh = new THREE.InstancedMesh(geo.frond, mat.leaf, palmSpots.length * 5);
    const dummy = new THREE.Object3D();
    palmSpots.forEach(([x, z, rotation], palmIndex) => {
      for (let leafIndex = 0; leafIndex < 5; leafIndex += 1) {
        const angle = (leafIndex / 5) * Math.PI * 2 + rotation * 2.5;
        dummy.position.set(x + Math.cos(angle) * 0.68, 2.78, z + Math.sin(angle) * 0.68);
        dummy.rotation.set(-0.52, -angle, Math.cos(angle) * 0.2);
        dummy.scale.set(0.72, 0.75, 0.72);
        dummy.updateMatrix();
        mesh.setMatrixAt(palmIndex * 5 + leafIndex, dummy.matrix);
      }
    });
    mesh.instanceMatrix.needsUpdate = true;
    return mesh;
  }, []);
  return <><primitive object={trunks} /><primitive object={fronds} />{palmSpots.map(([x, z], i) => <mesh key={i} geometry={geo.palmTop} material={i % 2 ? mat.leafLight : mat.leaf} position={[x, 2.7, z]} scale={[0.8, 0.75, 0.8]} />)}</>;
}

function ShorelineDetails() {
  const rocks = useMemo(() => {
    const mesh = new THREE.InstancedMesh(geo.sphere, mat.wood, boulderSpots.length);
    const dummy = new THREE.Object3D();
    boulderSpots.forEach(([x, z, sx, sy, sz], index) => {
      dummy.position.set(x, 0.15, z);
      dummy.rotation.set(0, index * 0.41, (index % 2 ? 1 : -1) * 0.08);
      dummy.scale.set(sx, sy, sz);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
    return mesh;
  }, []);
  return <primitive object={rocks} />;
}

function IslandWorld() {
  const pathPositions = [[0, 0, 0.7], [3.1, -1.4, 0.48], [5.4, -4.2, 0.42], [5.3, -7.5, 0.42], [1.5, -9.5, 0.42], [-3.1, -8.6, 0.42], [-6.4, -5.6, 0.42], [-8.1, -1.4, 0.42], [-6.5, 3.5, 0.42], [-2.7, 6.8, 0.42], [2.1, 7.6, 0.42], [6.5, 5.5, 0.42]];
  return <>
    <color attach="background" args={['#a8dfe0']} />
    <fog attach="fog" args={['#a8dfe0', 36, 76]} />
    <ambientLight intensity={1.45} />
    <directionalLight position={[-12, 20, 10]} intensity={2.1} color="#fff2d2" />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.35, 0]} material={mat.water}>
      <planeGeometry args={[180, 180, 1, 1]} />
    </mesh>
    <mesh position={[0, -2.35, 0]} scale={[23.2, 2.35, 22.5]} geometry={geo.sphere} material={mat.sand} />
    <mesh position={[0, -1.35, 0]} scale={[20.6, 1.35, 20.2]} geometry={geo.sphere} material={mat.grass} />
    <mesh position={[0, -1.34, 0]} scale={[20.15, 1.31, 19.75]} geometry={geo.sphere} material={mat.grassLight} />
    {pathPositions.map(([x, z, width], i) => <mesh key={i} position={[x, -0.04, z]} rotation={[-Math.PI / 2, 0, i * 0.13]} material={mat.sand}><circleGeometry args={[width, 7]} /></mesh>)}
    <PalmGrove />
    <ShorelineDetails />
    <mesh position={[0, 0.16, 0]} material={mat.wood}><boxGeometry args={[5.8, 0.42, 3.8]} /></mesh>
    <mesh position={[0, 0.43, 0]} material={mat.coral}><boxGeometry args={[5.4, 0.16, 3.4]} /></mesh>
    <mesh position={[0, 0.88, -1.2]} material={mat.wood}><boxGeometry args={[4.5, 0.9, 0.16]} /></mesh>
    <mesh position={[-1.4, 1.42, -1.1]} material={mat.yellow}><boxGeometry args={[0.15, 1.2, 0.18]} /></mesh>
    <mesh position={[0, 1.42, -1.1]} material={mat.yellow}><boxGeometry args={[0.15, 1.2, 0.18]} /></mesh>
    <mesh position={[1.4, 1.42, -1.1]} material={mat.yellow}><boxGeometry args={[0.15, 1.2, 0.18]} /></mesh>
    <mesh position={[0, 2.03, -1.1]} material={mat.yellow}><boxGeometry args={[2.95, 0.16, 0.18]} /></mesh>
    <mesh position={[-9, 1.6, -13]} rotation={[0, -0.3, 0]} material={mat.cream}><boxGeometry args={[2.7, 3.2, 0.8]} /></mesh>
    <mesh position={[-9, 3.25, -13]} material={mat.coral}><coneGeometry args={[1.5, 0.8, 4]} /></mesh>
    <mesh position={[12, 0.05, -10]} scale={[2.6, 1.4, 1.5]} geometry={geo.sphere} material={mat.wood} />
    <mesh position={[12, 0.3, -10]} scale={[2.2, 1.1, 1.35]} geometry={geo.sphere} material={mat.sand} />
    <mesh position={[-15, 0.08, 12]} rotation={[0, 0, -0.1]} material={mat.wood}><boxGeometry args={[4.2, 0.38, 1.5]} /></mesh>
    <mesh position={[-15, 0.03, 13]} material={mat.wood}><boxGeometry args={[0.42, 0.42, 3.6]} /></mesh>
    <mesh position={[-15.2, 0.9, 13]} material={mat.yellow}><boxGeometry args={[0.28, 1.4, 0.28]} /></mesh>
    <mesh position={[-15.2, 1.65, 13]} material={mat.yellow}><boxGeometry args={[1.2, 0.24, 0.24]} /></mesh>
    <mesh position={[0, 0.02, 21]} rotation={[-Math.PI / 2, 0, 0]} material={mat.water}><circleGeometry args={[5, 24]} /></mesh>
  </>;
}

function Character({ blue = false }: { blue?: boolean }) {
  const shirt = blue ? mat.blue : mat.red;
  return <group>
    <mesh position={[0, 1.02, 0]} geometry={geo.box} material={shirt} scale={[0.72, 0.82, 0.42]} />
    <mesh position={[0, 1.73, 0]} geometry={geo.sphere} material={mat.skin} scale={[0.47, 0.48, 0.43]} />
    <mesh position={[0, 1.99, -0.04]} geometry={geo.sphere} material={mat.hair} scale={[0.46, 0.21, 0.42]} />
    {!blue && [-0.28, -0.08, 0.12, 0.29].map((x, i) => <mesh key={i} position={[x, 2.2 + (i % 2) * 0.04, 0]} rotation={[0, 0, (i - 1.5) * 0.22]} geometry={geo.smallCone} material={mat.hair} scale={[0.2, 0.48, 0.18]} />)}
    <mesh position={[-0.16, 1.76, 0.38]} geometry={geo.sphere} material={mat.cream} scale={[0.09, 0.11, 0.05]} />
    <mesh position={[0.16, 1.76, 0.38]} geometry={geo.sphere} material={mat.cream} scale={[0.09, 0.11, 0.05]} />
    <mesh position={[-0.15, 1.75, 0.425]} geometry={geo.sphere} material={mat.dark} scale={[0.035, 0.05, 0.022]} />
    <mesh position={[0.17, 1.75, 0.425]} geometry={geo.sphere} material={mat.dark} scale={[0.035, 0.05, 0.022]} />
    <mesh position={[0, 1.57, 0.42]} geometry={geo.box} material={mat.coral} scale={[0.16, 0.035, 0.025]} />
    <mesh position={[-0.24, 0.43, 0]} geometry={geo.box} material={mat.dark} scale={[0.24, 0.62, 0.27]} />
    <mesh position={[0.24, 0.43, 0]} geometry={geo.box} material={mat.dark} scale={[0.24, 0.62, 0.27]} />
    <mesh position={[-0.28, 0.84, 0]} geometry={geo.box} material={mat.skin} scale={[0.2, 0.27, 0.22]} />
    <mesh position={[0.28, 0.84, 0]} geometry={geo.box} material={mat.skin} scale={[0.2, 0.27, 0.22]} />
    {blue && <group position={[0.45, 1.17, 0.28]} rotation={[0.15, -0.28, -0.18]}>
      <mesh geometry={geo.box} material={mat.dark} scale={[0.38, 0.25, 0.12]} />
      <mesh position={[0, 0, 0.075]} geometry={geo.box} material={mat.metal} scale={[0.27, 0.15, 0.03]} />
    </group>}
  </group>;
}

function MissionProp({ kind }: { kind: PropKind }) {
  switch (kind) {
    case 'snack': return <group><mesh position={[0, 0.35, 0]} geometry={geo.sphere} material={mat.coral} scale={[0.32, 0.34, 0.3]} /><mesh position={[0.02, 0.7, 0]} geometry={geo.smallCone} material={mat.leaf} scale={[0.13, 0.2, 0.12]} /></group>;
    case 'tripod': return <group><mesh position={[0, 0.55, 0]} geometry={geo.box} material={mat.metal} scale={[0.35, 0.28, 0.25]} />{[-0.28, 0, 0.28].map((x, i) => <mesh key={i} position={[x, 0.27, i === 1 ? 0.28 : -0.08]} rotation={[0, 0, (i - 1) * 0.25]} geometry={geo.box} material={mat.dark} scale={[0.09, 0.55, 0.09]} />)}</group>;
    case 'battery': return <group><mesh position={[0, 0.36, 0]} geometry={geo.box} material={mat.yellow} scale={[0.34, 0.63, 0.24]} /><mesh position={[0, 0.72, 0]} geometry={geo.box} material={mat.metal} scale={[0.16, 0.08, 0.13]} /></group>;
    case 'camera': return <group><mesh position={[0, 0.44, 0]} geometry={geo.box} material={mat.dark} scale={[0.67, 0.42, 0.34]} /><mesh position={[0.03, 0.45, 0.2]} geometry={geo.sphere} material={mat.blue} scale={[0.17, 0.17, 0.12]} /><mesh position={[-0.23, 0.7, 0]} geometry={geo.box} material={mat.dark} scale={[0.24, 0.13, 0.12]} /></group>;
    case 'map': return <mesh position={[0, 0.22, 0]} rotation={[-0.2, 0, -0.1]} geometry={geo.box} material={mat.cream} scale={[0.68, 0.06, 0.52]} />;
    case 'balloon': return <group><mesh position={[0, 0.75, 0]} geometry={geo.sphere} material={mat.blue} scale={[0.34, 0.43, 0.32]} /><mesh position={[0, 0.23, 0]} geometry={geo.box} material={mat.cream} scale={[0.025, 0.6, 0.025]} /></group>;
    case 'spotlight': return <group><mesh position={[0, 0.55, 0]} geometry={geo.smallCone} material={mat.yellow} scale={[0.45, 0.7, 0.45]} /><mesh position={[0, 0.9, 0]} geometry={geo.sphere} material={mat.cream} scale={[0.24, 0.13, 0.24]} /></group>;
    case 'clapper': return <group><mesh position={[0, 0.34, 0]} geometry={geo.box} material={mat.dark} scale={[0.6, 0.48, 0.14]} /><mesh position={[0, 0.62, 0]} rotation={[0, 0, -0.16]} geometry={geo.box} material={mat.cream} scale={[0.64, 0.17, 0.16]} /></group>;
    case 'star': return <group><mesh position={[0, 0.52, 0]} geometry={geo.smallCone} material={mat.yellow} scale={[0.5, 0.75, 0.5]} rotation={[0, 0, Math.PI]} /><mesh position={[0, 0.52, 0]} geometry={geo.smallCone} material={mat.yellow} scale={[0.5, 0.75, 0.5]} rotation={[Math.PI, 0, Math.PI]} /></group>;
  }
}

function CheckpointMarker({ checkpoint, found, near, onPick }: { checkpoint: MissionCheckpoint; found: boolean; near: boolean; onPick: () => void }) {
  if (found) return null;
  const [x, z] = checkpoint.position;
  return <group position={[x, 0.14, z]} onClick={(event) => { event.stopPropagation(); onPick(); }}>
    <mesh position={[0, -0.05, 0]} geometry={geo.marker} material={near ? mat.yellow : mat.cream} />
    <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.82, 0.035, 4, 20]} />
      <meshStandardMaterial color={near ? '#ef715d' : '#fff0c8'} flatShading />
    </mesh>
    <MissionProp kind={checkpoint.kind} />
    <mesh position={[0, 1.32, 0]} geometry={geo.sphere} material={near ? mat.coral : mat.yellow} scale={[0.1, 0.1, 0.1]} />
  </group>;
}

function PlayerAndCamera({ mission, found, inputRef, yawRef, positionRef, onNearby, onPick, onInteract }: {
  mission: GameMission; found: string[]; inputRef: MutableRefObject<InputState>; yawRef: MutableRefObject<number>;
  positionRef: MutableRefObject<Point>;
  onNearby: (checkpoint: MissionCheckpoint | null) => void; onPick: (id: string) => void; onInteract: () => void;
}) {
  const player = useRef<THREE.Group>(null);
  const kiko = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const [, getKeyboardState] = useKeyboardControls<GameControl>();
  const jumpVelocity = useRef(0);
  const jumpWasPressed = useRef(false);
  const interactWasPressed = useRef(false);
  const previousNearby = useRef('');
  const onNearbyRef = useRef(onNearby);
  const onInteractRef = useRef(onInteract);
  const cameraTarget = useRef(new THREE.Vector3());
  onNearbyRef.current = onNearby;
  onInteractRef.current = onInteract;
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const input = inputRef.current;
    const keyboard = getKeyboardState();
    let vx = (keyboard.right ? 1 : 0) - (keyboard.left ? 1 : 0) + input.x;
    let vz = (keyboard.backward ? 1 : 0) - (keyboard.forward ? 1 : 0) + input.z;
    const magnitude = Math.hypot(vx, vz);
    if (magnitude > 1) { vx /= magnitude; vz /= magnitude; }
    const yaw = yawRef.current;
    const forwardX = Math.sin(yaw);
    const forwardZ = -Math.cos(yaw);
    const rightX = Math.cos(yaw);
    const rightZ = Math.sin(yaw);
    const moveX = (rightX * vx + forwardX * -vz) * 5.3 * dt;
    const moveZ = (rightZ * vx + forwardZ * -vz) * 5.3 * dt;
    const p = positionRef.current;
    p.x = THREE.MathUtils.clamp(p.x + moveX, -19, 19);
    p.z = THREE.MathUtils.clamp(p.z + moveZ, -19, 19);
    const islandRatio = (p.x * p.x + p.z * p.z) / (18 * 18);
    if (islandRatio > 1) {
      const scale = 1 / Math.sqrt(islandRatio);
      p.x *= scale;
      p.z *= scale;
    }
    const jumpPressed = input.jump || keyboard.jump;
    if (jumpPressed && !jumpWasPressed.current && player.current?.position.y === 0) {
      jumpVelocity.current = 5.1;
    }
    jumpWasPressed.current = jumpPressed;
    input.jump = false;
    if (keyboard.interact && !interactWasPressed.current) onInteractRef.current();
    interactWasPressed.current = keyboard.interact;
    jumpVelocity.current -= 12 * dt;
    const py = player.current ? Math.max(0, player.current.position.y + jumpVelocity.current * dt) : 0;
    if (py === 0) jumpVelocity.current = 0;
    if (player.current) {
      player.current.position.set(p.x, py, p.z);
      if (magnitude > 0.04) player.current.rotation.y = Math.atan2(moveX, -moveZ);
    }
    if (kiko.current) {
      kiko.current.position.set(1.55 + Math.sin(performance.now() * 0.0012) * 0.22, 0, 1.15 + Math.cos(performance.now() * 0.0012) * 0.14);
      kiko.current.rotation.y = -0.4;
    }
    const distance = size.width < 700 ? 13 : 11;
    const camX = p.x + Math.sin(yaw) * distance;
    const camZ = p.z + Math.cos(yaw) * distance;
    const cameraHeight = size.width < 700 ? 10.5 : 9;
    camera.position.lerp(cameraTarget.current.set(camX, cameraHeight, camZ), 1 - Math.exp(-4 * dt));
    camera.lookAt(p.x, 1, p.z);
    let closest: MissionCheckpoint | null = null;
    let closestDistance = 3.15;
    for (const checkpoint of mission.checkpoints) {
      if (found.includes(checkpoint.id)) continue;
      const d = Math.hypot(checkpoint.position[0] - p.x, checkpoint.position[1] - p.z);
      if (d < closestDistance) { closest = checkpoint; closestDistance = d; }
    }
    const nearbyId = closest?.id ?? '';
    if (nearbyId !== previousNearby.current) {
      previousNearby.current = nearbyId;
      onNearbyRef.current(closest);
    }
  });
  return <>
    <group ref={player}><Character /></group>
    <group ref={kiko}><Character blue /></group>
    {mission.checkpoints.map(checkpoint => <CheckpointMarker key={checkpoint.id} checkpoint={checkpoint} found={found.includes(checkpoint.id)} near={Math.hypot(checkpoint.position[0] - positionRef.current.x, checkpoint.position[1] - positionRef.current.z) < 3.15} onPick={() => onPick(checkpoint.id)} />)}
  </>;
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function BongoKikoGame() {
  const { save, activeMission, activeProgress, completedCount, isMissionUnlocked, selectMission, completeCheckpoint, resetMission } = useGameProgress();
  const [, setLocation] = useLocation();
  const [nearby, setNearby] = useState<MissionCheckpoint | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [message, setMessage] = useState('Find the marked props. Bongo says this route is foolproof.');
  const [isDragging, setIsDragging] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dismissedComplete, setDismissedComplete] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const inputRef = useRef<InputState>({ x: 0, z: 0, jump: false });
  const positionRef = useRef<Point>({ x: 0, z: 4 });
  const yawRef = useRef(0);
  const nearestRef = useRef<MissionCheckpoint | null>(null);
  const elapsedRef = useRef(0);
  const timerStartRef = useRef(Date.now());
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const found = activeProgress.found;
  const allDone = activeProgress.completed;
  const progressPercent = Math.round((found.length / activeMission.checkpoints.length) * 100);

  useEffect(() => {
    timerStartRef.current = Date.now();
    elapsedRef.current = 0;
    setElapsed(0);
    setNearby(null);
    setDismissedComplete(false);
    setTimedOut(false);
    nearestRef.current = null;
    positionRef.current = { x: 0, z: 4 };
    setMessage('Find the marked props. Bongo says this route is foolproof.');
  }, [activeMission.id]);

  useEffect(() => {
    if (allDone || timedOut) return;
    const tick = window.setInterval(() => {
      const seconds = Math.floor((Date.now() - timerStartRef.current) / 1000);
      elapsedRef.current = seconds;
      setElapsed(seconds);
      if (activeMission.timeLimitSeconds && seconds >= activeMission.timeLimitSeconds) {
        setTimedOut(true);
        resetMission(activeMission.id);
        setMessage('The take ran long. Kiko is ready when you are.');
      }
    }, 250);
    return () => window.clearInterval(tick);
  }, [activeMission.id, activeMission.timeLimitSeconds, allDone, resetMission, timedOut]);

  const attemptCheckpoint = useCallback((checkpointId?: string) => {
    if (allDone || timedOut) return;
    const target = checkpointId
      ? activeMission.checkpoints.find(checkpoint => checkpoint.id === checkpointId && !found.includes(checkpoint.id))
      : nearestRef.current;
    if (!target) {
      setMessage('Nothing close enough to grab. Follow the little markers.');
      return;
    }
    const distance = Math.hypot(target.position[0] - positionRef.current.x, target.position[1] - positionRef.current.z);
    if (distance > 3.15) {
      setMessage(`${target.label} is still a few steps away.`);
      return;
    }
    const isLast = activeMission.checkpoints.every(checkpoint => checkpoint.id === target.id || found.includes(checkpoint.id));
    completeCheckpoint(activeMission.id, target.id, isLast && activeMission.timeLimitSeconds ? elapsedRef.current : undefined);
    setMessage(isLast
      ? activeMission.timeLimitSeconds
        ? `Mission complete in ${formatTime(elapsedRef.current)}. Best time saved if this beats your record.`
        : `Found it. ${activeMission.reward} earned.`
      : `Found: ${target.label}. Bongo is acting like he planned that.`);
  }, [activeMission, allDone, completeCheckpoint, found, timedOut]);

  useEffect(() => {
    const preventPageScroll = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
        event.preventDefault();
      }
    };
    window.addEventListener('keydown', preventPageScroll);
    return () => window.removeEventListener('keydown', preventPageScroll);
  }, []);

  const onNearby = useCallback((checkpoint: MissionCheckpoint | null) => {
    nearestRef.current = checkpoint;
    setNearby(checkpoint);
  }, []);
  const pickCheckpoint = (checkpointId: string) => attemptCheckpoint(checkpointId);
  const chooseMission = (missionId: string) => {
    selectMission(missionId);
    setMobileOpen(false);
  };
  const retryMission = () => {
    resetMission(activeMission.id);
    setDismissedComplete(false);
    setTimedOut(false);
    setNearby(null);
    nearestRef.current = null;
    positionRef.current = { x: 0, z: 4 };
    yawRef.current = 0;
    timerStartRef.current = Date.now();
    elapsedRef.current = 0;
    setElapsed(0);
    setMessage('Fresh start. Kiko is filming; try not to trip over the plan.');
  };
  const activeIndex = GAME_MISSIONS.findIndex(mission => mission.id === activeMission.id);
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest('button, .bk-game-joystick, .bk-game-mobile-actions')) return;
    if ((event.pointerType === 'mouse' && event.button === 0) || event.pointerType === 'touch') {
      pointerRef.current = { x: event.clientX, y: event.clientY };
      setIsDragging(true);
    }
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointerRef.current) return;
    const dx = event.clientX - pointerRef.current.x;
    pointerRef.current = { x: event.clientX, y: event.clientY };
    yawRef.current -= dx * 0.008;
  };
  const onPointerUp = () => { pointerRef.current = null; setIsDragging(false); };
  const setJoystick = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    const length = Math.max(1, Math.hypot(dx, dy));
    inputRef.current.x = dx / length;
    inputRef.current.z = dy / length;
    const knob = event.currentTarget.querySelector('span');
    if (knob) knob.style.transform = `translate(${Math.max(-21, Math.min(21, dx * 27))}px, ${Math.max(-21, Math.min(21, dy * 27))}px)`;
  };
  const releaseJoystick = (event: PointerEvent<HTMLDivElement>) => {
    inputRef.current.x = 0;
    inputRef.current.z = 0;
    event.currentTarget.querySelector('span')?.style.setProperty('transform', 'translate(0, 0)');
  };

  return <main className="bk-game">
    <header className="bk-game-topbar">
      <Link className="bk-game-brand" href="/bongo-kiko" data-testid="link-game-home" aria-label="Back to Bongo and Kiko home"><span className="bk-game-brand-mark">B<span>&</span>K</span><span><b>BONGO + KIKO</b><small>THE ISLAND SIDE QUEST</small></span></Link>
      <div className="bk-game-top-title"><span className="bk-game-live-dot" /> ISLAND FIELD DAY <i> / </i> PLAYABLE ADVENTURE</div>
      <div className="bk-game-score"><span data-testid="text-mission-completion"><Star size={15} /> {completedCount}<small> / 10</small></span><button type="button" className="bk-game-missions-toggle" onClick={() => setMobileOpen(true)} data-testid="button-open-missions">MISSIONS <ChevronRight size={15} /></button></div>
    </header>
    <div className="bk-game-layout">
      <aside className={`bk-game-sidebar ${mobileOpen ? 'is-open' : ''}`} aria-label="Mission selection">
        <div className="bk-game-side-head"><div><span className="bk-game-kicker">THE ADVENTURE BOARD</span><h1>Pick a<br /><em>mission.</em></h1></div><button type="button" className="bk-game-close-list" onClick={() => setMobileOpen(false)} aria-label="Close mission list" data-testid="button-close-missions"><X size={19} /></button></div>
        <p className="bk-game-side-copy">Ten tiny jobs. One island. Bongo has assured Kiko that nothing can go wrong.</p>
        <div className="bk-game-mission-list">
          {GAME_MISSIONS.map((mission, index) => {
            const progress = save.missions[mission.id];
            const unlocked = isMissionUnlocked(mission.id);
            const selected = activeMission.id === mission.id;
            return <button type="button" key={mission.id} onClick={() => unlocked && chooseMission(mission.id)} disabled={!unlocked} className={`bk-game-mission ${selected ? 'is-selected' : ''} ${progress?.completed ? 'is-complete' : ''} ${!unlocked ? 'is-locked' : ''}`} data-testid={`button-mission-${mission.id}`} aria-current={selected ? 'step' : undefined} aria-label={`${mission.number} ${mission.title}${unlocked ? '' : ', locked'}`}>
              <span className="bk-game-mission-number">{progress?.completed ? <Check size={14} /> : !unlocked ? <LockKeyhole size={13} /> : mission.number}</span>
              <span className="bk-game-mission-copy"><b>{mission.title}</b><small>{mission.subtitle}</small></span>
              <span className="bk-game-mission-count">{progress?.found.length ?? 0}/{mission.checkpoints.length}</span>
            </button>;
          })}
        </div>
        <div className="bk-game-side-foot"><Compass size={15} /><span>Finish one mission to open the next.</span></div>
      </aside>
      <section className="bk-game-play" aria-label="Playable island adventure">
        <div className="bk-game-scene-wrap" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} data-testid="game-scene">
          <KeyboardControls map={keyboardMap}>
            <Canvas dpr={[1, 1.45]} camera={{ position: [0, 9, 15], fov: 52 }} gl={{ antialias: false, powerPreference: 'high-performance' }} onCreated={({ gl }) => { gl.setClearColor('#a8dfe0'); }}>
              <IslandWorld />
              <PlayerAndCamera mission={activeMission} found={found} inputRef={inputRef} yawRef={yawRef} positionRef={positionRef} onNearby={onNearby} onPick={pickCheckpoint} onInteract={() => attemptCheckpoint()} />
            </Canvas>
          </KeyboardControls>
          <div className="bk-game-hud-top">
          <button className="bk-game-back" type="button" onClick={() => setLocation('/bongo-kiko/adventures')} data-testid="button-back-adventures"><ChevronLeft size={16} /> ADVENTURE BOARD</button>
            <div className="bk-game-time" data-testid="text-mission-timer"><Clock3 size={15} /> {formatTime(elapsed)}{activeMission.timeLimitSeconds && <small> / {formatTime(activeMission.timeLimitSeconds)}</small>}</div>
          </div>
          <div className="bk-game-camera-hint"><Camera size={15} /><span>DRAG TO LOOK</span></div>
          <div className="bk-game-controls-note"><span><b>WASD</b> MOVE</span><span><b>SPACE</b> JUMP</span><span><b>E</b> INTERACT</span></div>
          <div className="bk-game-mobile-controls">
            <div className="bk-game-joystick" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setJoystick(event); }} onPointerMove={(event) => { if (event.buttons) setJoystick(event); }} onPointerUp={releaseJoystick} onPointerCancel={releaseJoystick} data-testid="control-mobile-joystick" aria-label="Movement joystick"><span /></div>
            <div className="bk-game-mobile-actions"><button type="button" onPointerDown={() => { inputRef.current.jump = true; }} data-testid="button-mobile-jump">JUMP</button><button type="button" onClick={() => attemptCheckpoint()} data-testid="button-mobile-action">ACTION</button></div>
          </div>
          {isDragging && <div className="bk-game-dragging-label">CAMERA TURNING</div>}
        </div>
        <div className="bk-game-mission-panel">
          <div className="bk-game-mission-info">
            <div className="bk-game-current-label"><span>MISSION {activeMission.number}</span><span className="bk-game-status-pill" data-testid="text-mission-status">{timedOut ? 'TIME UP' : allDone ? 'COMPLETE' : 'IN PROGRESS'}</span></div>
            <h2>{activeMission.title} <em>{activeMission.subtitle}</em></h2>
            <p>{activeMission.briefing}</p>
          </div>
          <div className="bk-game-objectives">
            <div className="bk-game-objectives-top"><span>FIELD NOTES</span><b>{found.length} / {activeMission.checkpoints.length} FOUND</b></div>
            <div className="bk-game-progress"><span style={{ width: `${progressPercent}%` }} /></div>
            <div className="bk-game-checklist">
              {activeMission.checkpoints.map((checkpoint, i) => <div className={`bk-game-checkpoint ${found.includes(checkpoint.id) ? 'is-found' : ''} ${nearby?.id === checkpoint.id ? 'is-nearby' : ''}`} key={checkpoint.id}>
                <span className="bk-game-check-icon">{found.includes(checkpoint.id) ? <Check size={13} /> : String(i + 1).padStart(2, '0')}</span><span>{checkpoint.label}</span>{nearby?.id === checkpoint.id && !found.includes(checkpoint.id) && !allDone && !timedOut && <button type="button" onClick={() => attemptCheckpoint(checkpoint.id)} data-testid={`button-interact-${checkpoint.id}`}>PICK UP</button>}
              </div>)}
            </div>
            <div className="bk-game-status" role="status" aria-live="polite" data-testid="status-game-message"><Footprints size={15} /><span>{timedOut ? 'Time is up. Restart the take to try again.' : allDone ? 'Mission complete. Choose another mission or play this one again.' : nearby ? `Nearby: ${nearby.label} — press E or action to collect.` : message}</span></div>
          </div>
        </div>
        {(allDone || timedOut) && !dismissedComplete && <div className="bk-game-complete" role="dialog" aria-modal="true" aria-labelledby="bk-game-complete-title">
          <div className="bk-game-complete-card"><button className="bk-game-complete-close" type="button" onClick={() => setDismissedComplete(true)} aria-label="Dismiss mission complete" data-testid="button-dismiss-complete"><X size={17} /></button>
            <span className="bk-game-complete-stamp"><Star size={27} /></span><span className="bk-game-kicker">FIELD REPORT / {activeMission.number}</span>
            <h2 id="bk-game-complete-title">{timedOut ? <>Time is<br /><em>up.</em></> : <>Well, look<br />at <em>that.</em></>}</h2>
            <p>{timedOut ? 'That take ran over. Try a quicker route and Kiko will keep the camera rolling.' : `${activeMission.reward} unlocked. Kiko got the shot. Bongo insists he meant to do that.`}</p>
            {!timedOut && activeMission.timeLimitSeconds && <div className="bk-game-best-time"><Clock3 size={16} /> BEST TIME <b>{formatTime(activeProgress.bestTimeSeconds ?? elapsed)}</b></div>}
            <div className="bk-game-complete-actions">
              <button type="button" onClick={retryMission} data-testid="button-retry-mission"><RotateCcw size={15} /> {timedOut ? 'TRY AGAIN' : 'PLAY AGAIN'}</button>
              {!timedOut && activeIndex < GAME_MISSIONS.length - 1 && <button type="button" onClick={() => chooseMission(GAME_MISSIONS[activeIndex + 1].id)} data-testid="button-next-mission">NEXT MISSION <ArrowRight size={15} /></button>}
            </div>
          </div>
        </div>}
      </section>
    </div>
  </main>;
}
