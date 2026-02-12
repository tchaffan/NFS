"use client";

import { useState, useEffect, useMemo } from 'react';

interface MainMenuProps {
  onStartRace: (mode: 'career' | 'quickrace' | 'timeattack' | 'drift') => void;
}

export default function MainMenu({ onStartRace }: MainMenuProps) {
  const [selectedButton, setSelectedButton] = useState(0);
  
  const buttons = useMemo(() => [
    { mode: 'career' as const, label: 'CAREER', color: 'from-red-600 to-red-700', desc: 'Rise from street racer to pro champion' },
    { mode: 'quickrace' as const, label: 'QUICK RACE', color: 'from-gray-600 to-gray-700', desc: 'Instant racing action' },
    { mode: 'timeattack' as const, label: 'TIME ATTACK', color: 'from-blue-600 to-blue-700', desc: 'Beat the clock, set lap records' },
    { mode: 'drift' as const, label: 'DRIFT TRIALS', color: 'from-purple-600 to-purple-700', desc: 'Master the art of controlled chaos' },
  ], []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        setSelectedButton(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        setSelectedButton(prev => Math.min(buttons.length - 1, prev + 1));
      } else if (e.key === 'Enter') {
        onStartRace(buttons[selectedButton].mode);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [buttons, selectedButton, onStartRace]);

  return (
    <div className="absolute inset-0 z-50 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-red-950">
        {/* Animated grid */}
        <div className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'center top',
            animation: 'gridMove 20s linear infinite'
          }}
        />
        
        {/* Ambient light rays */}
        <div className="absolute top-0 left-1/4 w-96 h-full bg-gradient-to-b from-red-500/20 to-transparent blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-full bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Logo */}
        <div className="text-center mb-16">
          <div className="mb-4">
            <span className="text-red-500 text-lg tracking-[0.5em] font-bold">ELECTRONIC ARTS</span>
          </div>
          
          <h1 className="text-9xl font-black text-white tracking-[0.2em] drop-shadow-2xl" style={{
            textShadow: '0 0 60px rgba(220,20,60,0.5), 0 0 120px rgba(220,20,60,0.3)',
            WebkitTextStroke: '2px rgba(255,255,255,0.3)'
          }}>
            NFS
          </h1>
          <h2 className="text-7xl font-black text-red-500 tracking-[0.3em] mt-2 drop-shadow-xl" style={{
            textShadow: '0 0 40px rgba(220,20,60,0.8)'
          }}>
            UNLEASHED
          </h2>
          
          <p className="text-gray-400 text-xl mt-6 tracking-wider">
            A Spiritual Successor to Need for Speed: Shift 2
          </p>
        </div>

        {/* Menu Buttons */}
        <div className="space-y-4 w-full max-w-md">
          {buttons.map((button, index) => (
            <button
              key={button.mode}
              onClick={() => onStartRace(button.mode)}
              onMouseEnter={() => setSelectedButton(index)}
              className={`w-full px-8 py-5 text-left transition-all duration-200 transform ${
                selectedButton === index 
                  ? 'scale-105 translate-x-4' 
                  : 'scale-100 opacity-60 hover:opacity-80 hover:translate-x-2'
              }`}
            >
              <div className={`bg-gradient-to-r ${button.color} rounded-lg p-4 shadow-2xl border-2 ${
                selectedButton === index ? 'border-white' : 'border-transparent'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-black tracking-wider ${
                    selectedButton === index ? 'text-white' : 'text-white/80'
                  }`}>
                    {button.label}
                  </span>
                  {selectedButton === index && (
                    <span className="text-white text-2xl">▶</span>
                  )}
                </div>
                <p className="text-white/70 text-sm mt-1">{button.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-black text-white">145+</p>
            <p className="text-gray-500 text-sm">Licensed Vehicles</p>
          </div>
          <div>
            <p className="text-4xl font-black text-white">101</p>
            <p className="text-gray-500 text-sm">Real Tracks</p>
          </div>
          <div>
            <p className="text-4xl font-black text-white">4K</p>
            <p className="text-gray-500 text-sm">60 FPS</p>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 text-center text-gray-600 text-sm">
          <p>© 2024 NFS Unleashed. This is a fan-made tribute.</p>
          <p className="mt-2">Built with Three.js and React</p>
        </div>
      </div>

      {/* Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10" 
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)'
        }}
      />
    </div>
  );
}
