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

function Vehicle({ onSpeedChange, onRPMChange, onGearChange, selectedCar }: Omit<GameSceneProps, 'onLapTimeChange' | 'selectedTrack'>) {
  const { camera } = useThree();
  
  const carColor = selectedCar?.color || '#cc0000';
  
  const [chassisBody, chassisApi] = useBox(() => ({
    mass: 1200,
    position: [0, 2, 0],
    args: [2, 0.8, 4.5],
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
      <mesh ref={chassisBody} castShadow>
        <boxGeometry args={[2, 0.8, 4.5]} />
        <meshStandardMaterial color={carColor} metalness={0.8} roughness={0.2} />
      </mesh>
      
      <mesh position={[0, 0.8, -2]} castShadow>
        <boxGeometry args={[1.8, 0.1, 0.5]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {wheels.map((wheel, i) => (
        <mesh key={i} ref={wheel} castShadow>
          <cylinderGeometry args={[wheelRadius, wheelRadius, wheelWidth, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
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
