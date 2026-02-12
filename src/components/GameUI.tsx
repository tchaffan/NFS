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
  // GT3-specific properties
  engineLayout: 'Front' | 'Mid' | 'Rear';
  engineType: string;
  displacement: number; // liters
  torque: number; // Nm
  liveries: { name: string; primary: string; secondary: string; accent: string }[];
  handlingNotes: string;
  drivetrain: 'RWD' | 'AWD';
  restrictor: number; // mm restrictor plate
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
  // Porsche 911 GT3 R (992) - Rear Engine
  { 
    id: 'porsche_911_gt3_r', 
    name: '911 GT3 R (992)', 
    manufacturer: 'Porsche', 
    class: 'GT3', 
    maxSpeed: 199, 
    acceleration: 8.8, 
    handling: 9.2, 
    power: 550, 
    color: '#0066b2', 
    price: 245000, 
    weight: 1270,
    engineLayout: 'Rear',
    engineType: '4.2L Flat-6 NA',
    displacement: 4.2,
    torque: 465,
    liveries: [
      { name: 'Manthey EMA Gulf', primary: '#003399', secondary: '#ff6600', accent: '#ffffff' },
      { name: 'Martini', primary: '#ffffff', secondary: '#cc0000', accent: '#003399' }
    ],
    handlingNotes: 'Snappy rotation, rear bias demands throttle control; stable at 180mph',
    drivetrain: 'RWD',
    restrictor: 0
  },
  // BMW M4 GT3 Evo - Front Engine
  { 
    id: 'bmw_m4_gt3_evo', 
    name: 'M4 GT3 Evo', 
    manufacturer: 'BMW', 
    class: 'GT3', 
    maxSpeed: 197, 
    acceleration: 8.7, 
    handling: 8.8, 
    power: 590, 
    color: '#0066b2', 
    price: 235000, 
    weight: 1290,
    engineLayout: 'Front',
    engineType: '3.0L I6 Turbo',
    displacement: 3.0,
    torque: 650,
    liveries: [
      { name: 'M Motorsport', primary: '#0066b2', secondary: '#ffffff', accent: '#cc0000' }
    ],
    handlingNotes: 'Forgiving, high top-speed king; easy for beginners',
    drivetrain: 'RWD',
    restrictor: 0
  },
  // Mercedes-AMG GT3 Evo - Front Engine
  { 
    id: 'mercedes_amg_gt3_evo', 
    name: 'AMG GT3 Evo', 
    manufacturer: 'Mercedes-AMG', 
    class: 'GT3', 
    maxSpeed: 198, 
    acceleration: 8.6, 
    handling: 8.7, 
    power: 550, 
    color: '#00aaff', 
    price: 249000, 
    weight: 1330,
    engineLayout: 'Front',
    engineType: '6.2L V8 NA',
    displacement: 6.2,
    torque: 675,
    liveries: [
      { name: 'Petronas', primary: '#00aaff', secondary: '#009944', accent: '#ffffff' },
      { name: 'Classic Silver', primary: '#cccccc', secondary: '#ffffff', accent: '#000000' }
    ],
    handlingNotes: 'Stable straight-line rocket, soft tires',
    drivetrain: 'RWD',
    restrictor: 0
  },
  // Audi R8 LMS GT3 Evo II - Mid Engine
  { 
    id: 'audi_r8_gt3_evo2', 
    name: 'R8 LMS GT3 Evo II', 
    manufacturer: 'Audi', 
    class: 'GT3', 
    maxSpeed: 201, 
    acceleration: 8.9, 
    handling: 9.3, 
    power: 585, 
    color: '#ffcc00', 
    price: 229000, 
    weight: 1290,
    engineLayout: 'Mid',
    engineType: '5.2L V10 NA',
    displacement: 5.2,
    torque: 550,
    liveries: [
      { name: 'Phoenix Yellow', primary: '#ffcc00', secondary: '#000000', accent: '#ffffff' },
      { name: 'WRT White', primary: '#ffffff', secondary: '#cc0000', accent: '#000000' }
    ],
    handlingNotes: 'Rotation king, narrow setup window',
    drivetrain: 'RWD',
    restrictor: 43
  },
  // Ferrari 296 GT3 - Mid Engine
  { 
    id: 'ferrari_296_gt3', 
    name: '296 GT3', 
    manufacturer: 'Ferrari', 
    class: 'GT3', 
    maxSpeed: 202, 
    acceleration: 9.0, 
    handling: 9.2, 
    power: 600, 
    color: '#cc0000', 
    price: 259000, 
    weight: 1250,
    engineLayout: 'Mid',
    engineType: '2.9L V6 Turbo',
    displacement: 2.9,
    torque: 710,
    liveries: [
      { name: 'AF Corse Red', primary: '#cc0000', secondary: '#ffcc00', accent: '#000000' },
      { name: '499P Tricolor', primary: '#cc0000', secondary: '#ffffff', accent: '#009446' }
    ],
    handlingNotes: 'Balanced pace monster, grippy',
    drivetrain: 'RWD',
    restrictor: 0
  },
  // Lamborghini Huracán GT3 Evo2 - Mid Engine
  { 
    id: 'lamborghini_huracan_gt3_evo2', 
    name: 'Huracán GT3 Evo2', 
    manufacturer: 'Lamborghini', 
    class: 'GT3', 
    maxSpeed: 198, 
    acceleration: 8.8, 
    handling: 9.1, 
    power: 580, 
    color: '#666666', 
    price: 239000, 
    weight: 1290,
    engineLayout: 'Mid',
    engineType: '5.2L V10 NA',
    displacement: 5.2,
    torque: 560,
    liveries: [
      { name: 'Grigio', primary: '#666666', secondary: '#000000', accent: '#ff6600' },
      { name: 'Squadra Orange', primary: '#ff6600', secondary: '#000000', accent: '#ffffff' }
    ],
    handlingNotes: 'Drifty fun, Evo2 aero upgrade',
    drivetrain: 'RWD',
    restrictor: 54
  },
  // McLaren 720S GT3 Evo - Mid Engine
  { 
    id: 'mclaren_720s_gt3_evo', 
    name: '720S GT3 Evo', 
    manufacturer: 'McLaren', 
    class: 'GT3', 
    maxSpeed: 205, 
    acceleration: 9.1, 
    handling: 9.4, 
    power: 590, 
    color: '#ff6600', 
    price: 269000, 
    weight: 1280,
    engineLayout: 'Mid',
    engineType: '4.0L V8 Turbo',
    displacement: 4.0,
    torque: 770,
    liveries: [
      { name: 'MS7 Papaya', primary: '#ff6600', secondary: '#000000', accent: '#ffffff' },
      { name: 'Loctite Concepts', primary: '#003399', secondary: '#00ccff', accent: '#ff6600' }
    ],
    handlingNotes: 'Stable mid-engine, rotates like a go-kart',
    drivetrain: 'RWD',
    restrictor: 0
  },
  // Aston Martin Vantage GT3 - Front Engine
  { 
    id: 'aston_martin_vantage_gt3', 
    name: 'Vantage GT3', 
    manufacturer: 'Aston Martin', 
    class: 'GT3', 
    maxSpeed: 196, 
    acceleration: 8.6, 
    handling: 8.9, 
    power: 550, 
    color: '#006633', 
    price: 229000, 
    weight: 1290,
    engineLayout: 'Front',
    engineType: '4.0L V8 Turbo',
    displacement: 4.0,
    torque: 700,
    liveries: [
      { name: 'AMR Green/Gold', primary: '#006633', secondary: '#cca300', accent: '#ffffff' },
      { name: 'TF Silver', primary: '#cccccc', secondary: '#000000', accent: '#cc0000' }
    ],
    handlingNotes: 'Easy drive, good tires',
    drivetrain: 'RWD',
    restrictor: 0
  },
  // Corvette Z06 GT3.R - Front-Mid Engine
  { 
    id: 'corvette_z06_gt3r', 
    name: 'Z06 GT3.R', 
    manufacturer: 'Chevrolet', 
    class: 'GT3', 
    maxSpeed: 198, 
    acceleration: 8.7, 
    handling: 8.8, 
    power: 590, 
    color: '#ffcc00', 
    price: 219000, 
    weight: 1290,
    engineLayout: 'Front',
    engineType: '5.5L V8 NA',
    displacement: 5.5,
    torque: 595,
    liveries: [
      { name: 'Pratt & Miller Yellow', primary: '#ffcc00', secondary: '#000000', accent: '#ffffff' },
      { name: 'Hendrick Blue', primary: '#003399', secondary: '#ffffff', accent: '#cc0000' }
    ],
    handlingNotes: 'Improved balance, V8 bellow',
    drivetrain: 'RWD',
    restrictor: 0
  },
  // Ford Mustang GT3 - Front Engine
  { 
    id: 'ford_mustang_gt3', 
    name: 'Mustang GT3', 
    manufacturer: 'Ford', 
    class: 'GT3', 
    maxSpeed: 197, 
    acceleration: 8.6, 
    handling: 8.5, 
    power: 585, 
    color: '#003399', 
    price: 199000, 
    weight: 1290,
    engineLayout: 'Front',
    engineType: '5.4L V8 NA',
    displacement: 5.4,
    torque: 570,
    liveries: [
      { name: 'Multimatic Blue', primary: '#003399', secondary: '#ffffff', accent: '#cc0000' },
      { name: 'Risi Orange', primary: '#ff6600', secondary: '#000000', accent: '#ffffff' }
    ],
    handlingNotes: 'Newcomer, straight-line pull',
    drivetrain: 'RWD',
    restrictor: 0
  }
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
