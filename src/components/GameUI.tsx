import { useState } from 'react';

"use client";

export interface CarData {
  id: string;
  name: string;
  manufacturer: string;
  class: 'GT3' | 'GT1' | 'Street' | 'Muscle' | 'Tuner';
  maxSpeed: number;
  acceleration: number;
  handling: number;
  power: number;
  color: string;
  price: number;
  weight: number; // kg
}

export interface TrackData {
  id: string;
  name: string;
  location: string;
  length: number;
  laps: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  variants: string[];
}

export const CARS: CarData[] = [
  { id: 'porsche_gt3', name: '911 GT3 RS', manufacturer: 'Porsche', class: 'GT3', maxSpeed: 193, acceleration: 8.5, handling: 9.0, power: 518, color: '#ff6600', price: 185000, weight: 1440 },
  { id: 'lamborghini_gallardo', name: 'Gallardo LP 570-4', manufacturer: 'Lamborghini', class: 'GT3', maxSpeed: 192, acceleration: 8.4, handling: 8.8, power: 562, color: '#cccc00', price: 177000, weight: 1340 },
  { id: 'nissan_gtr', name: 'GT-R R35', manufacturer: 'Nissan', class: 'GT1', maxSpeed: 196, acceleration: 8.7, handling: 8.5, power: 485, color: '#333333', price: 79000, weight: 1740 },
  { id: 'mclaren_mp4', name: 'MP4-12C', manufacturer: 'McLaren', class: 'GT3', maxSpeed: 207, acceleration: 9.0, handling: 9.2, power: 616, color: '#ff0000', price: 245000, weight: 1475 },
  { id: 'bmw_m3', name: 'M3 E92 GTS', manufacturer: 'BMW', class: 'GT3', maxSpeed: 190, acceleration: 8.3, handling: 8.9, power: 450, color: '#ff6600', price: 135000, weight: 1595 },
  { id: 'ford_mustang', name: 'GT500', manufacturer: 'Ford', class: 'Muscle', maxSpeed: 180, acceleration: 7.8, handling: 7.0, power: 662, color: '#ffffff', price: 55000, weight: 1770 },
  { id: 'toyota_supra', name: 'Supra A80', manufacturer: 'Toyota', class: 'Tuner', maxSpeed: 175, acceleration: 7.5, handling: 7.8, power: 326, color: '#cc0000', price: 45000, weight: 1665 },
  { id: 'audi_r8', name: 'R8 LMS GT3', manufacturer: 'Audi', class: 'GT3', maxSpeed: 198, acceleration: 8.8, handling: 9.1, power: 570, color: '#ff0000', price: 210000, weight: 1465 },
  { id: 'mercedes_slr', name: 'SLR McLaren', manufacturer: 'Mercedes', class: 'GT1', maxSpeed: 206, acceleration: 8.9, handling: 8.7, power: 617, color: '#cccccc', price: 195000, weight: 1875 },
  { id: 'chevrolet_c6', name: 'Corvette Z06', manufacturer: 'Chevrolet', class: 'GT3', maxSpeed: 198, acceleration: 8.6, handling: 8.4, power: 505, color: '#ff0000', price: 88000, weight: 1420 },
];

export const TRACKS: TrackData[] = [
  { id: 'nurburgring', name: 'Nürburgring', location: 'Germany', length: 20.83, laps: 3, difficulty: 'Expert', variants: ['Day', 'Night', 'Wet'] },
  { id: 'spa', name: 'Spa-Francorchamps', location: 'Belgium', length: 7.0, laps: 6, difficulty: 'Expert', variants: ['Day', 'Night', 'Wet', 'Foggy'] },
  { id: 'silverstone', name: 'Silverstone', location: 'UK', length: 5.89, laps: 5, difficulty: 'Medium', variants: ['Day', 'Night'] },
  { id: 'monza', name: 'Monza', location: 'Italy', length: 5.79, laps: 5, difficulty: 'Medium', variants: ['Day', 'Night'] },
  { id: 'suzuka', name: 'Suzuka', location: 'Japan', length: 5.81, laps: 5, difficulty: 'Hard', variants: ['Day', 'Night', 'Wet'] },
  { id: 'laguna', name: 'Laguna Seca', location: 'USA', length: 3.62, laps: 8, difficulty: 'Hard', variants: ['Day', 'Night'] },
  { id: 'hockenheim', name: 'Hockenheimring', location: 'Germany', length: 4.57, laps: 6, difficulty: 'Medium', variants: ['Day', 'Night', 'Wet'] },
  { id: 'brands', name: 'Brands Hatch', location: 'UK', length: 3.92, laps: 7, difficulty: 'Medium', variants: ['Day', 'Night'] },
  { id: 'road_america', name: 'Road America', location: 'USA', length: 6.51, laps: 4, difficulty: 'Medium', variants: ['Day', 'Night', 'Wet'] },
  { id: 'bathurst', name: 'Mount Panorama', location: 'Australia', length: 6.21, laps: 4, difficulty: 'Expert', variants: ['Day', 'Night', 'Wet'] },
];

interface GameUIProps {
  onCarSelect: (car: CarData) => void;
  onTrackSelect: (track: TrackData) => void;
  onStartRace: () => void;
  selectedCar: CarData | null;
  selectedTrack: TrackData | null;
  mode: 'career' | 'quickrace' | 'timeattack' | 'drift';
}

export default function GameUI({ 
  onCarSelect, 
  onTrackSelect, 
  onStartRace, 
  selectedCar, 
  selectedTrack,
  mode 
}: GameUIProps) {
  const [activeTab, setActiveTab] = useState<'cars' | 'tracks'>('cars');

  const getClassColor = (carClass: string) => {
    switch (carClass) {
      case 'GT3': return 'bg-yellow-500';
      case 'GT1': return 'bg-red-500';
      case 'Street': return 'bg-blue-500';
      case 'Muscle': return 'bg-orange-500';
      case 'Tuner': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-orange-400';
      case 'Expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-40">
      <div className="w-[90%] max-w-6xl h-[80%] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-4xl font-black text-white">GARAGE</h2>
            <p className="text-gray-400">{mode.toUpperCase()} MODE</p>
          </div>
          
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-gray-500 text-xs uppercase">Selected Car</p>
              <p className="text-white font-bold">{selectedCar?.name || 'None'}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs uppercase">Selected Track</p>
              <p className="text-white font-bold">{selectedTrack?.name || 'None'}</p>
            </div>
          </div>

          <button
            onClick={onStartRace}
            disabled={!selectedCar || !selectedTrack}
            className={`px-8 py-3 text-xl font-bold rounded-lg transition-all ${
              selectedCar && selectedTrack
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            START RACE
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setActiveTab('cars')}
            className={`px-6 py-2 font-bold rounded-t-lg ${
              activeTab === 'cars' 
                ? 'bg-white text-black' 
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            CARS ({CARS.length})
          </button>
          <button
            onClick={() => setActiveTab('tracks')}
            className={`px-6 py-2 font-bold rounded-t-lg ${
              activeTab === 'tracks' 
                ? 'bg-white text-black' 
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            TRACKS ({TRACKS.length})
          </button>
        </div>

        <div className="flex-1 bg-gray-900 rounded-b-lg p-4 overflow-auto">
          {activeTab === 'cars' && (
            <div className="grid grid-cols-5 gap-4">
              {CARS.map((car) => (
                <button
                  key={car.id}
                  onClick={() => onCarSelect(car)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCar?.id === car.id
                      ? 'border-red-500 bg-red-500/20'
                      : 'border-gray-700 hover:border-gray-500 bg-gray-800'
                  }`}
                >
                  <div 
                    className="w-full h-24 rounded-lg mb-3 flex items-center justify-center"
                    style={{ backgroundColor: car.color + '40' }}
                  >
                    <div className="text-4xl">🏎️</div>
                  </div>
                  
                  <h3 className="text-white font-bold text-sm">{car.name}</h3>
                  <p className="text-gray-500 text-xs">{car.manufacturer}</p>
                  
                  <div className={`inline-block px-2 py-0.5 rounded text-xs font-bold text-black mt-2 ${getClassColor(car.class)}`}>
                    {car.class}
                  </div>
                  
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Power</span>
                      <span className="text-white">{car.power} HP</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Max Speed</span>
                      <span className="text-white">{car.maxSpeed} MPH</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Handling</span>
                      <span className="text-white">{car.handling}/10</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'tracks' && (
            <div className="grid grid-cols-5 gap-4">
              {TRACKS.map((track) => (
                <button
                  key={track.id}
                  onClick={() => onTrackSelect(track)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTrack?.id === track.id
                      ? 'border-red-500 bg-red-500/20'
                      : 'border-gray-700 hover:border-gray-500 bg-gray-800'
                  }`}
                >
                  <div className="w-full h-24 rounded-lg mb-3 bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center">
                    <div className="text-4xl">🏁</div>
                  </div>
                  
                  <h3 className="text-white font-bold text-sm">{track.name}</h3>
                  <p className="text-gray-500 text-xs">{track.location}</p>
                  
                  <p className={`font-bold text-xs mt-2 ${getDifficultyColor(track.difficulty)}`}>
                    {track.difficulty}
                  </p>
                  
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Length</span>
                      <span className="text-white">{track.length.toFixed(2)} km</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Laps</span>
                      <span className="text-white">{track.laps}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {track.variants.map((v) => (
                        <span key={v} className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
