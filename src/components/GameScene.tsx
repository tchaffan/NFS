"use client";

import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Physics, useBox, usePlane, useRaycastVehicle } from '@react-three/cannon';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { Sky, Environment } from '@react-three/drei';
import { CarData, TrackData } from './GameUI';

interface GameSceneProps {
  onSpeedChange: (speed: number) => void;
  onRPMChange: (rpm: number) => void;
  onGearChange: (gear: number) => void;
  onLapTimeChange: (time: number) => void;
  selectedCar: CarData | null;
  selectedTrack: TrackData | null;
}

function Wheel({ position, isFront }: { position: [number, number, number], isFront: boolean }) {
  return (
    <group position={position}>
      {/* Tire */}
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 24]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      {/* Rim */}
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.32, 8]} />
        <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Rim center */}
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.34, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function CarBody({ color }: { color: string }) {
  return (
    <group>
      {/* Main body - lower section */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.9, 0.6, 4.3]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.15} />
      </mesh>
      
      {/* Hood - front sloped section */}
      <mesh position={[0, 0.55, 1.6]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[1.8, 0.15, 1.4]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.15} />
      </mesh>
      
      {/* Cabin / Windshield area */}
      <mesh position={[0, 0.95, -0.1]} castShadow>
        <boxGeometry args={[1.7, 0.6, 1.6]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.15} />
      </mesh>
      
      {/* Windshield - front */}
      <mesh position={[0, 1.05, 0.7]} rotation={[-0.5, 0, 0]} castShadow>
        <boxGeometry args={[1.6, 0.05, 0.8]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.9} roughness={0.1} opacity={0.7} transparent />
      </mesh>
      
      {/* Rear window */}
      <mesh position={[0, 1.0, -0.95]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 0.05, 0.7]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.9} roughness={0.1} opacity={0.7} transparent />
      </mesh>
      
      {/* Side windows - left */}
      <mesh position={[-0.86, 0.95, -0.1]} castShadow>
        <boxGeometry args={[0.02, 0.45, 1.2]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.9} roughness={0.1} opacity={0.6} transparent />
      </mesh>
      
      {/* Side windows - right */}
      <mesh position={[0.86, 0.95, -0.1]} castShadow>
        <boxGeometry args={[0.02, 0.45, 1.2]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.9} roughness={0.1} opacity={0.6} transparent />
      </mesh>
      
      {/* Trunk / rear section */}
      <mesh position={[0, 0.55, -1.7]} castShadow>
        <boxGeometry args={[1.8, 0.35, 1.0]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.15} />
      </mesh>
      
      {/* Rear spoiler */}
      <mesh position={[0, 0.85, -2.1]} castShadow>
        <boxGeometry args={[1.8, 0.08, 0.25]} />
        <meshStandardMaterial color="#111111" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[-0.7, 0.75, -2.05]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.15]} />
        <meshStandardMaterial color="#111111" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.7, 0.75, -2.05]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.15]} />
        <meshStandardMaterial color="#111111" metalness={0.6} roughness={0.3} />
      </mesh>
      
      {/* Front bumper */}
      <mesh position={[0, 0.2, 2.2]} castShadow>
        <boxGeometry args={[1.9, 0.35, 0.2]} />
        <meshStandardMaterial color="#222222" metalness={0.5} roughness={0.4} />
      </mesh>
      
      {/* Front grille */}
      <mesh position={[0, 0.25, 2.32]} castShadow>
        <boxGeometry args={[1.4, 0.2, 0.05]} />
        <meshStandardMaterial color="#111111" metalness={0.3} roughness={0.8} />
      </mesh>
      
      {/* Headlights - left */}
      <mesh position={[-0.65, 0.45, 2.16]} castShadow>
        <boxGeometry args={[0.4, 0.15, 0.1]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffcc" emissiveIntensity={0.8} />
      </mesh>
      
      {/* Headlights - right */}
      <mesh position={[0.65, 0.45, 2.16]} castShadow>
        <boxGeometry args={[0.4, 0.15, 0.1]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffcc" emissiveIntensity={0.8} />
      </mesh>
      
      {/* Taillights - left */}
      <mesh position={[-0.65, 0.5, -2.16]} castShadow>
        <boxGeometry args={[0.4, 0.12, 0.05]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.6} />
      </mesh>
      
      {/* Taillights - right */}
      <mesh position={[0.65, 0.5, -2.16]} castShadow>
        <boxGeometry args={[0.4, 0.12, 0.05]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.6} />
      </mesh>
      
      {/* Side mirrors - left */}
      <mesh position={[-1.0, 0.85, 0.3]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.2]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.15} />
      </mesh>
      
      {/* Side mirrors - right */}
      <mesh position={[1.0, 0.85, 0.3]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.2]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.15} />
      </mesh>
      
      {/* Front wheel arches - left */}
      <mesh position={[-0.95, 0.35, 1.3]} castShadow>
        <boxGeometry args={[0.2, 0.35, 0.7]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      
      {/* Front wheel arches - right */}
      <mesh position={[0.95, 0.35, 1.3]} castShadow>
        <boxGeometry args={[0.2, 0.35, 0.7]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      
      {/* Rear wheel arches - left */}
      <mesh position={[-0.95, 0.35, -1.3]} castShadow>
        <boxGeometry args={[0.2, 0.35, 0.7]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      
      {/* Rear wheel arches - right */}
      <mesh position={[0.95, 0.35, -1.3]} castShadow>
        <boxGeometry args={[0.2, 0.35, 0.7]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      
      {/* Door lines - left */}
      <mesh position={[-0.96, 0.5, 0.2]} castShadow>
        <boxGeometry args={[0.02, 0.35, 1.5]} />
        <meshStandardMaterial color="#000000" metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Door lines - right */}
      <mesh position={[0.96, 0.5, 0.2]} castShadow>
        <boxGeometry args={[0.02, 0.35, 1.5]} />
        <meshStandardMaterial color="#000000" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Vehicle({ onSpeedChange, onRPMChange, onGearChange, selectedCar }: Omit<GameSceneProps, 'onLapTimeChange' | 'selectedTrack'>) {
  const { camera } = useThree();
  
  const carColor = selectedCar?.color || '#cc0000';
  
  const [chassisBody, chassisApi] = useBox(() => ({
    mass: 1200,
    position: [0, 2, 0],
    args: [1.9, 1.3, 4.3],
  }));

  const wheelRadius = 0.4;
  const wheelWidth = 0.3;
  
  const [wheel1] = useBox(() => ({ mass: 50, args: [wheelWidth, wheelRadius * 2, wheelRadius * 2], position: [-0.9, 0.5, 1.3] }));
  const [wheel2] = useBox(() => ({ mass: 50, args: [wheelWidth, wheelRadius * 2, wheelRadius * 2], position: [0.9, 0.5, 1.3] }));
  const [wheel3] = useBox(() => ({ mass: 50, args: [wheelWidth, wheelRadius * 2, wheelRadius * 2], position: [-0.9, 0.5, -1.3] }));
  const [wheel4] = useBox(() => ({ mass: 50, args: [wheelWidth, wheelRadius * 2, wheelRadius * 2], position: [0.9, 0.5, -1.3] }));
  
  const wheels = [wheel1, wheel2, wheel3, wheel4];

  const [vehicle, vehicleApi] = useRaycastVehicle(() => ({
    chassisBody,
    wheels,
    wheelInfos: [
      { axleLocal: [-1, 0, 0], directionLocal: [0, -1, 0], suspensionStiffness: 30, radius: wheelRadius, isFrontWheel: true, chassisConnectionPointLocal: [-0.9, 0, 1.3] },
      { axleLocal: [1, 0, 0], directionLocal: [0, -1, 0], suspensionStiffness: 30, radius: wheelRadius, isFrontWheel: true, chassisConnectionPointLocal: [0.9, 0, 1.3] },
      { axleLocal: [-1, 0, 0], directionLocal: [0, -1, 0], suspensionStiffness: 30, radius: wheelRadius, isFrontWheel: false, chassisConnectionPointLocal: [-0.9, 0, -1.3] },
      { axleLocal: [1, 0, 0], directionLocal: [0, -1, 0], suspensionStiffness: 30, radius: wheelRadius, isFrontWheel: false, chassisConnectionPointLocal: [0.9, 0, -1.3] },
    ],
  }));

  const [controls, setControls] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
  });

  const [speed, setSpeed] = useState(0);
  const [rpm, setRPM] = useState(1000);
  const [gear, setGear] = useState(1);
  const [throttle, setThrottle] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'ArrowUp') setControls(c => ({ ...c, forward: true }));
      if (e.key === 's' || e.key === 'ArrowDown') setControls(c => ({ ...c, backward: true }));
      if (e.key === 'a' || e.key === 'ArrowLeft') setControls(c => ({ ...c, left: true }));
      if (e.key === 'd' || e.key === 'ArrowRight') setControls(c => ({ ...c, right: true }));
      if (e.key === ' ') setControls(c => ({ ...c, brake: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'ArrowUp') setControls(c => ({ ...c, forward: false }));
      if (e.key === 's' || e.key === 'ArrowDown') setControls(c => ({ ...c, backward: false }));
      if (e.key === 'a' || e.key === 'ArrowLeft') setControls(c => ({ ...c, left: false }));
      if (e.key === 'd' || e.key === 'ArrowRight') setControls(c => ({ ...c, right: false }));
      if (e.key === ' ') setControls(c => ({ ...c, brake: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    const maxForce = selectedCar ? (selectedCar.power / 2) : 2500;
    const maxBrakeForce = 100;
    const maxSteerVal = 0.5;

    chassisApi.velocity.subscribe((v) => {
      const speedMPH = Math.sqrt(v[0] ** 2 + v[2] ** 2) * 2.237;
      setSpeed(speedMPH);
      onSpeedChange(speedMPH);
    });

    let targetThrottle = 0;
    if (controls.forward) targetThrottle = 1;
    if (controls.backward) targetThrottle = -0.5;
    
    setThrottle(t => t + (targetThrottle - t) * 0.1);

    let newGear = 1;
    if (speed > 15) newGear = 2;
    if (speed > 35) newGear = 3;
    if (speed > 60) newGear = 4;
    if (speed > 90) newGear = 5;
    if (speed > 120) newGear = 6;
    
    if (newGear !== gear) {
      setGear(newGear);
      onGearChange(newGear);
    }

    const baseRPM = 1000;
    const gearRatio = [0, 3.5, 2.5, 1.8, 1.3, 1.0, 0.8][gear] || 1;
    const calculatedRPM = baseRPM + (speed * 50 * gearRatio) + (throttle * 1000);
    const targetRPM = Math.min(calculatedRPM, 8000);
    
    setRPM(r => r + (targetRPM - r) * 0.1);
    onRPMChange(rpm);

    const engineForce = throttle * maxForce;
    vehicleApi.applyEngineForce(engineForce, 2);
    vehicleApi.applyEngineForce(engineForce, 3);

    const steerValue = controls.left ? maxSteerVal : controls.right ? -maxSteerVal : 0;
    vehicleApi.setSteeringValue(steerValue, 0);
    vehicleApi.setSteeringValue(steerValue, 1);

    const brakeForce = controls.brake ? maxBrakeForce : 0;
    vehicleApi.setBrake(brakeForce, 0);
    vehicleApi.setBrake(brakeForce, 1);
    vehicleApi.setBrake(brakeForce, 2);
    vehicleApi.setBrake(brakeForce, 3);

    chassisApi.position.subscribe((p) => {
      chassisApi.rotation.subscribe((r) => {
        const offset = new Vector3(0, 1.5, -4);
        const rotation = new THREE.Euler(r[0], r[1], r[2]);
        offset.applyEuler(rotation);
        
        camera.position.lerp(new Vector3(p[0] + offset.x, p[1] + offset.y, p[2] + offset.z), 0.1);
        camera.lookAt(p[0], p[1] + 0.5, p[2]);
        
        camera.rotation.z = -steerValue * 0.1 + r[2] * 0.3;
      });
    });
  });

  return (
    <group ref={vehicle}>
      <group ref={chassisBody}>
        <CarBody color={carColor} />
        
        {/* Wheels */}
        <Wheel position={[-0.9, 0, 1.3]} isFront={true} />
        <Wheel position={[0.9, 0, 1.3]} isFront={true} />
        <Wheel position={[-0.9, 0, -1.3]} isFront={false} />
        <Wheel position={[0.9, 0, -1.3]} isFront={false} />
      </group>
    </group>
  );
}

function Track() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  return (
    <group>
      <mesh ref={ref} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </mesh>

      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[30, 50, 64]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>

      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[39.5, 40.5, 64]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {Array.from({ length: 64 }).map((_, i) => {
        const angle = (i / 64) * Math.PI * 2;
        const radius = 55;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <mesh key={i} position={[x, 1, z]} rotation={[0, angle, 0]} castShadow>
            <boxGeometry args={[5, 2, 0.5]} />
            <meshStandardMaterial color="#ff0000" roughness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function GameScene(props: GameSceneProps) {
  const [lapTime, setLapTime] = useState(0);

  useFrame((state, delta) => {
    setLapTime(t => {
      const newTime = t + delta;
      props.onLapTimeChange(newTime);
      return newTime;
    });
  });

  return (
    <Physics gravity={[0, -9.81, 0]} defaultContactMaterial={{ friction: 0.9 }}>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[50, 50, 25]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <pointLight position={[0, 10, 0]} intensity={0.5} />

      <Sky sunPosition={[100, 20, 100]} />
      <Environment preset="sunset" />
      <fog attach="fog" args={['#1a1a1a', 50, 200]} />

      <Track />
      <Vehicle {...props} />
    </Physics>
  );
}
