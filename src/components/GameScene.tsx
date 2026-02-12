"use client";

import { useRef, useEffect, useState, useMemo } from 'react';
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
  const carMass = selectedCar?.weight || 1400;
  const carPower = selectedCar?.power || 450;
  const carTorque = selectedCar?.torque || 450;
  const carEngineLayout = selectedCar?.engineLayout || 'Mid';
  const carDrivetrain = selectedCar?.drivetrain || 'RWD';
  const carHandling = selectedCar?.handling || 8.5;
  
  // Engine position affects weight distribution and handling
  const weightDistribution = carEngineLayout === 'Rear' ? 0.4 : 
                             carEngineLayout === 'Mid' ? 0.45 : 0.5; // Front weight %
  
  // Suspension tuning based on handling rating
  const suspensionStiffnessFront = 30 + (carHandling * 0.5);
  const suspensionStiffnessRear = 28 + (carHandling * 0.5);
  
  // Grip level based on handling
  const gripLevel = 1.0 + ((carHandling - 8.0) * 0.15);
  
  // Realistic physics constants
  const wheelRadius = 0.35;
  const wheelWidth = 0.3;
  const chassisWidth = 1.8;
  const chassisLength = 4.2;
  const chassisHeight = 1.2;
  
  // Spawn at ground level with slight offset to ensure proper physics initialization
  const spawnHeight = 1.5;
  
  const [chassisBody, chassisApi] = useBox(() => ({
    mass: carMass,
    position: [0, spawnHeight, 0],
    args: [chassisWidth, chassisHeight, chassisLength],
    // Low center of mass for stability - prevents tipping
    offset: [0, -0.3, 0],
    // Realistic drag values
    linearDamping: 0.05,
    angularDamping: 2.0,
    // Sleep settings to prevent jitter when stationary
    sleepSpeedLimit: 0.5,
    sleepTimeLimit: 1,
  }));
  
  // Wheel positions relative to chassis - properly typed tuple array
  const wheelPositions: [number, number, number][] = [
    [-0.85, -0.3, 1.4],   // Front left
    [0.85, -0.3, 1.4],    // Front right
    [-0.85, -0.3, -1.4],  // Rear left
    [0.85, -0.3, -1.4],   // Rear right
  ];
  
  // Realistic suspension and wheel settings
  const [wheel1] = useBox(() => ({ 
    mass: 20, 
    args: [wheelWidth, wheelRadius, wheelRadius], 
    position: wheelPositions[0],
    // High friction to grip the track
    friction: 1.5,
    // Prevent wheels from falling through
    linearDamping: 0.3,
    angularDamping: 0.3,
  }));
  const [wheel2] = useBox(() => ({ 
    mass: 20, 
    args: [wheelWidth, wheelRadius, wheelRadius], 
    position: wheelPositions[1],
    friction: 1.5,
    linearDamping: 0.3,
    angularDamping: 0.3,
  }));
  const [wheel3] = useBox(() => ({ 
    mass: 20, 
    args: [wheelWidth, wheelRadius, wheelRadius], 
    position: wheelPositions[2],
    friction: 1.5,
    linearDamping: 0.3,
    angularDamping: 0.3,
  }));
  const [wheel4] = useBox(() => ({ 
    mass: 20, 
    args: [wheelWidth, wheelRadius, wheelRadius], 
    position: wheelPositions[3],
    friction: 1.5,
    linearDamping: 0.3,
    angularDamping: 0.3,
  }));
  
  const wheels = [wheel1, wheel2, wheel3, wheel4];

  // Enhanced raycast vehicle with realistic physics
  const [vehicle, vehicleApi] = useRaycastVehicle(() => ({
    chassisBody,
    wheels: [wheel1, wheel2, wheel3, wheel4],
    wheelInfos: [
      // Front left wheel
      { 
        axleLocal: [-1, 0, 0], 
        directionLocal: [0, -1, 0], 
        suspensionStiffness: suspensionStiffnessFront,  // Dynamic based on car handling
        suspensionRestLength: 0.21,  // 70% of max travel (0.3m)
        radius: wheelRadius, 
        isFrontWheel: true, 
        chassisConnectionPointLocal: wheelPositions[0] as [number, number, number],
        frictionSlip: 1.2 * gripLevel,         // Grip level based on handling
        rollInfluence: 0.1,      // Reduce roll for stability
        suspensionCompression: 4.5,
        suspensionRelaxation: 3.5,
        rollingFriction: 0.015,  // Rolling resistance
      },
      // Front right wheel
      { 
        axleLocal: [1, 0, 0], 
        directionLocal: [0, -1, 0], 
        suspensionStiffness: suspensionStiffnessFront, 
        suspensionRestLength: 0.21,
        radius: wheelRadius, 
        isFrontWheel: true, 
        chassisConnectionPointLocal: wheelPositions[1] as [number, number, number],
        frictionSlip: 1.2 * gripLevel,
        rollInfluence: 0.1,
        suspensionCompression: 4.5,
        suspensionRelaxation: 3.5,
        rollingFriction: 0.015,
      },
      // Rear left wheel
      { 
        axleLocal: [-1, 0, 0], 
        directionLocal: [0, -1, 0], 
        suspensionStiffness: suspensionStiffnessRear,  // Slightly softer rear for traction
        suspensionRestLength: 0.21,
        radius: wheelRadius, 
        isFrontWheel: false, 
        chassisConnectionPointLocal: wheelPositions[2] as [number, number, number],
        frictionSlip: 1.3 * gripLevel,  // Slightly more grip at rear
        rollInfluence: 0.15,
        suspensionCompression: 4.0,
        suspensionRelaxation: 3.0,
        rollingFriction: 0.015,
      },
      // Rear right wheel
      { 
        axleLocal: [1, 0, 0], 
        directionLocal: [0, -1, 0], 
        suspensionStiffness: suspensionStiffnessRear, 
        suspensionRestLength: 0.21,
        radius: wheelRadius, 
        isFrontWheel: false, 
        chassisConnectionPointLocal: wheelPositions[3] as [number, number, number],
        frictionSlip: 1.3 * gripLevel,
        rollInfluence: 0.15,
        suspensionCompression: 4.0,
        suspensionRelaxation: 3.0,
        rollingFriction: 0.015,
      },
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
  
  // Store velocity reference for physics calculations
  const velocityRef = useRef<[number, number, number]>([0, 0, 0]);

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
    // Realistic engine torque: use actual car torque value
    const gearRatios = [0, 3.8, 2.6, 1.9, 1.4, 1.1, 0.9];
    const gearRatio = gearRatios[gear] || 1;
    const maxEngineTorque = carTorque;  // Use actual torque from car data
    const maxForce = maxEngineTorque * gearRatio;  // Force = torque / wheel radius
    const maxBrakeForce = 20000;       // Strong brakes (20,000 Nm per axle)
    const maxSteerVal = 0.5;        // ~30 degrees max steering
    
    // Steering sensitivity based on handling (better handling = more responsive)
    const baseSteerSensitivity = 0.3 + ((carHandling - 8.0) * 0.05);

    // Track velocity for physics calculations
    chassisApi.velocity.subscribe((v) => {
      velocityRef.current = v;
      const speedMPH = Math.sqrt(v[0] ** 2 + v[2] ** 2) * 2.237;
      setSpeed(speedMPH);
      onSpeedChange(speedMPH);
    });

    // Smooth throttle response for realism
    let targetThrottle = 0;
    if (controls.forward) targetThrottle = 1;
    if (controls.backward) targetThrottle = -0.4;
    
    // Gradual throttle application (no instant response)
    setThrottle(t => t + (targetThrottle - t) * 0.15);

    // Automatic gear shifting based on RPM and speed
    const currentSpeed = speed;
    let newGear = 1;
    if (currentSpeed > 15) newGear = 2;
    if (currentSpeed > 30) newGear = 3;
    if (currentSpeed > 50) newGear = 4;
    if (currentSpeed > 80) newGear = 5;
    if (currentSpeed > 120) newGear = 6;
    
    if (newGear !== gear) {
      setGear(newGear);
      onGearChange(newGear);
    }

    // Realistic RPM calculation with gear ratios
    const baseRPM = 800;  // Idle RPM
    
    // RPM affected by speed, gear, and throttle
    const speedFactor = currentSpeed * 45;
    const throttleBoost = throttle > 0 ? throttle * 2000 : 0;
    const calculatedRPM = baseRPM + (speedFactor * gearRatio) + throttleBoost;
    const targetRPM = Math.min(calculatedRPM, 7500);
    
    // Smooth RPM transitions
    setRPM(r => r + (targetRPM - r) * 0.2);
    onRPMChange(rpm);

    // Apply engine force based on drivetrain
    const engineForce = throttle * maxForce;
    
    if (carDrivetrain === 'AWD') {
      // All-wheel drive - distribute to all wheels
      vehicleApi.applyEngineForce(engineForce * 0.45, 0);  // Front left
      vehicleApi.applyEngineForce(engineForce * 0.45, 1);  // Front right
      vehicleApi.applyEngineForce(engineForce * 0.55, 2);  // Rear left (slightly more rear bias)
      vehicleApi.applyEngineForce(engineForce * 0.55, 3); // Rear right
    } else if (carEngineLayout === 'Front') {
      // Front engine RWD - front weight bias, power to rear
      vehicleApi.applyEngineForce(0, 0);  // Front left
      vehicleApi.applyEngineForce(0, 1);  // Front right
      vehicleApi.applyEngineForce(engineForce * 0.85, 2);  // Rear left (more power for traction)
      vehicleApi.applyEngineForce(engineForce * 0.85, 3); // Rear right
    } else {
      // Mid/Rear engine RWD - rear weight bias
      vehicleApi.applyEngineForce(engineForce, 2);  // Rear left
      vehicleApi.applyEngineForce(engineForce, 3); // Rear right
    }

    // Front-wheel drive assist for front-engine cars at low speed
    if (currentSpeed < 15 && throttle > 0) {
      vehicleApi.applyEngineForce(engineForce * 0.3, 0);
      vehicleApi.applyEngineForce(engineForce * 0.3, 1);
    }

    // Steering with speed-dependent sensitivity
    const steerSpeedFactor = Math.max(0.3, 1 - (currentSpeed / 150));
    const steerValue = controls.left ? maxSteerVal * steerSpeedFactor : 
                       controls.right ? -maxSteerVal * steerSpeedFactor : 0;
    
    vehicleApi.setSteeringValue(steerValue, 0);  // Front left
    vehicleApi.setSteeringValue(steerValue, 1);  // Front right

    // Braking with anti-lock simulation
    let brakeForce = 0;
    if (controls.brake) {
      brakeForce = maxBrakeForce;
      // Reduce engine force when braking
      vehicleApi.applyEngineForce(0, 2);
      vehicleApi.applyEngineForce(0, 3);
    }
    
    vehicleApi.setBrake(brakeForce, 0);
    vehicleApi.setBrake(brakeForce, 1);
    vehicleApi.setBrake(brakeForce, 2);
    vehicleApi.setBrake(brakeForce, 3);

    // Simulate downforce at high speeds (reduces understeer)
    const downforceFactor = Math.min(currentSpeed / 100, 1) * 50;
    chassisApi.applyForce([0, -downforceFactor, 0], [0, 0, 0]);

    // Subscribe to position for camera and track bounds
    chassisApi.position.subscribe((p) => {
      chassisApi.rotation.subscribe((r) => {
        // Dynamic camera that follows car
        const offset = new Vector3(0, 2, -5);
        const rotation = new THREE.Euler(r[0], r[1], r[2]);
        offset.applyEuler(rotation);
        
        const targetPos = new Vector3(p[0] + offset.x, p[1] + offset.y, p[2] + offset.z);
        camera.position.lerp(targetPos, 0.08);
        
        // Look ahead of the car
        const lookTarget = new Vector3(p[0], p[1] + 0.5, p[2] - 2);
        lookTarget.applyEuler(new THREE.Euler(0, r[1], 0));
        camera.lookAt(lookTarget);
        
        // Subtle camera roll with steering
        camera.rotation.z = -steerValue * 0.15;
      });
    });
  });

  // Wheel visual positions matching physics
  const wheelVisualPositions: [number, number, number][] = [
    [-0.85, -0.3, 1.4],
    [0.85, -0.3, 1.4],
    [-0.85, -0.3, -1.4],
    [0.85, -0.3, -1.4],
  ];

  return (
    <group ref={vehicle}>
      <group ref={chassisBody}>
        <CarBody color={carColor} />
        
        {/* Wheels aligned with physics */}
        <Wheel position={wheelVisualPositions[0]} isFront={true} />
        <Wheel position={wheelVisualPositions[1]} isFront={true} />
        <Wheel position={wheelVisualPositions[2]} isFront={false} />
        <Wheel position={wheelVisualPositions[3]} isFront={false} />
      </group>
    </group>
  );
}

function Track() {
  const [ref] = usePlane(() => ({
    rotation: [Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  return (
    <group>
      <mesh ref={ref} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
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
    <Physics 
      gravity={[0, -9.81, 0]} 
      defaultContactMaterial={{ 
        friction: 1.0,      // High friction for grip
        restitution: 0.1,  // Low bounce
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3,
      }}
      broadphase="SAP"  // Sweep and prune for better performance
      allowSleep={true}  // Allow objects to sleep when stationary
    >
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
