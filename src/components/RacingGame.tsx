"use client";

import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { EffectComposer, Bloom, Vignette, DepthOfField, ChromaticAberration } from '@react-three/postprocessing';
import { Suspense, useState } from 'react';
import GameScene from './GameScene';
import HUD from './HUD';
import MainMenu from './MainMenu';
import GameUI from './GameUI';
import { CARS, TRACKS, CarData, TrackData } from './GameUI';

type GameMode = 'career' | 'quickrace' | 'timeattack' | 'drift';
type GameState = 'menu' | 'garage' | 'racing' | 'paused';

export default function RacingGame() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedMode, setSelectedMode] = useState<GameMode>('quickrace');
  const [selectedCar, setSelectedCar] = useState<CarData | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<TrackData | null>(null);
  
  // HUD state
  const [speed, setSpeed] = useState(0);
  const [rpm, setRPM] = useState(0);
  const [gear, setGear] = useState(1);
  const [lapTime, setLapTime] = useState(0);
  const [lap, setLap] = useState(1);
  const [position, setPosition] = useState(1);

  const startRace = (mode: GameMode) => {
    setSelectedMode(mode);
    setGameState('garage');
  };

  const handleStartRace = () => {
    if (selectedCar && selectedTrack) {
      setGameState('racing');
    }
  };

  const handleCarSelect = (car: CarData) => {
    setSelectedCar(car);
  };

  const handleTrackSelect = (track: TrackData) => {
    setSelectedTrack(track);
  };

  return (
    <div className="w-full h-screen relative overflow-hidden bg-black">
      {gameState === 'menu' && (
        <MainMenu onStartRace={startRace} />
      )}
      
      {gameState === 'garage' && selectedCar === null && (
        <div className="absolute inset-0 bg-black/95 flex items-center justify-center z-40">
          <div className="text-center">
            <h2 className="text-6xl font-black text-white mb-8">SELECT YOUR CAR</h2>
            <p className="text-gray-400 mb-8">Choose from 145+ licensed vehicles</p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto px-8">
              {CARS.map((car) => (
                <button
                  key={car.id}
                  onClick={() => handleCarSelect(car)}
                  className="p-6 bg-gray-800 hover:bg-gray-700 rounded-lg border-2 border-gray-700 hover:border-red-500 transition-all"
                >
                  <div 
                    className="w-full h-20 rounded mb-4 flex items-center justify-center text-5xl"
                    style={{ backgroundColor: car.color + '30' }}
                  >
                    🏎️
                  </div>
                  <h3 className="text-white font-bold">{car.name}</h3>
                  <p className="text-gray-500 text-sm">{car.manufacturer}</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold mt-2 ${
                    car.class === 'GT3' ? 'bg-yellow-500' :
                    car.class === 'GT1' ? 'bg-red-500' :
                    car.class === 'Muscle' ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`}>
                    {car.class}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {gameState === 'garage' && selectedCar !== null && selectedTrack === null && (
        <div className="absolute inset-0 bg-black/95 flex items-center justify-center z-40">
          <div className="text-center">
            <h2 className="text-6xl font-black text-white mb-8">SELECT TRACK</h2>
            <p className="text-gray-400 mb-8">Choose from 101 real-world tracks</p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto px-8">
              {TRACKS.map((track) => (
                <button
                  key={track.id}
                  onClick={() => handleTrackSelect(track)}
                  className="p-6 bg-gray-800 hover:bg-gray-700 rounded-lg border-2 border-gray-700 hover:border-red-500 transition-all"
                >
                  <div className="w-full h-20 rounded mb-4 bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center text-5xl">
                    🏁
                  </div>
                  <h3 className="text-white font-bold">{track.name}</h3>
                  <p className="text-gray-500 text-sm">{track.location}</p>
                  <div className="flex gap-2 mt-2 justify-center">
                    <span className={`text-xs font-bold ${
                      track.difficulty === 'Easy' ? 'text-green-400' :
                      track.difficulty === 'Medium' ? 'text-yellow-400' :
                      track.difficulty === 'Hard' ? 'text-orange-400' :
                      'text-red-400'
                    }`}>
                      {track.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs mt-1">{track.length.toFixed(2)} km • {track.laps} laps</p>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setSelectedCar(null)}
              className="mt-8 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              ← Back to Cars
            </button>
          </div>
        </div>
      )}

      {gameState === 'garage' && selectedCar && selectedTrack && (
        <GameUI
          onCarSelect={handleCarSelect}
          onTrackSelect={handleTrackSelect}
          onStartRace={handleStartRace}
          selectedCar={selectedCar}
          selectedTrack={selectedTrack}
          mode={selectedMode}
        />
      )}
      
      {gameState === 'racing' && (
        <>
          <Canvas
            shadows
            camera={{ position: [0, 1.5, -3], fov: 75 }}
            gl={{ antialias: true, alpha: false }}
          >
            <Suspense fallback={null}>
              <GameScene 
                onSpeedChange={setSpeed}
                onRPMChange={setRPM}
                onGearChange={setGear}
                onLapTimeChange={setLapTime}
                selectedCar={selectedCar}
                selectedTrack={selectedTrack}
              />
              <EffectComposer>
                <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.9} intensity={1.2} />
                <Vignette eskil={false} offset={0.1} darkness={0.4} />
                <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={3} />
                <ChromaticAberration offset={[0.001, 0.001]} />
              </EffectComposer>
            </Suspense>
          </Canvas>
          
          <HUD 
            speed={speed}
            rpm={rpm}
            gear={gear}
            lapTime={lapTime}
            lap={lap}
            position={position}
            mode={selectedMode}
            carName={selectedCar?.name || ''}
            trackName={selectedTrack?.name || ''}
          />
        </>
      )}
    </div>
  );
}
