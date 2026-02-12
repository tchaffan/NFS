"use client";

import { useEffect, useRef, useState } from 'react';

interface AudioEngineProps {
  rpm: number;
  speed: number;
  throttle: number;
  isDrifting: boolean;
  isAccelerating: boolean;
}

export default function useAudioEngine({ rpm, speed, throttle, isDrifting, isAccelerating }: AudioEngineProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const engineOscillatorsRef = useRef<OscillatorNode[]>([]);
  const engineGainsRef = useRef<GainNode[]>([]);
  const tireNoiseRef = useRef<AudioBufferSourceNode | null>(null);
  const tireGainRef = useRef<GainNode | null>(null);
  const windNoiseRef = useRef<AudioBufferSourceNode | null>(null);
  const windGainRef = useRef<GainNode | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAudio = async () => {
      if (isInitialized) return;
      
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        // Create engine sound layers
        const frequencies = [55, 110, 165, 220, 330]; // Harmonic series
        
        frequencies.forEach((freq, i) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          osc.type = i === 0 ? 'sawtooth' : 'sine';
          osc.frequency.value = freq;
          gain.gain.value = 0;
          
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.start();
          
          engineOscillatorsRef.current.push(osc);
          engineGainsRef.current.push(gain);
        });

        // Create tire screech noise
        const bufferSize = audioContext.sampleRate * 2;
        const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        tireNoiseRef.current = audioContext.createBufferSource();
        tireNoiseRef.current.buffer = noiseBuffer;
        tireNoiseRef.current.loop = true;
        
        tireGainRef.current = audioContext.createGain();
        tireGainRef.current.gain.value = 0;
        
        const tireFilter = audioContext.createBiquadFilter();
        tireFilter.type = 'bandpass';
        tireFilter.frequency.value = 2000;
        tireFilter.Q.value = 1;
        
        tireNoiseRef.current.connect(tireFilter);
        tireFilter.connect(tireGainRef.current);
        tireGainRef.current.connect(audioContext.destination);
        tireNoiseRef.current.start();

        // Create wind noise
        windNoiseRef.current = audioContext.createBufferSource();
        windNoiseRef.current.buffer = noiseBuffer;
        windNoiseRef.current.loop = true;
        
        windGainRef.current = audioContext.createGain();
        windGainRef.current.gain.value = 0;
        
        const windFilter = audioContext.createBiquadFilter();
        windFilter.type = 'lowpass';
        windFilter.frequency.value = 500;
        
        windNoiseRef.current.connect(windFilter);
        windFilter.connect(windGainRef.current);
        windGainRef.current.connect(audioContext.destination);
        windNoiseRef.current.start();

        setIsInitialized(true);
      } catch (error) {
        console.log('Audio initialization failed:', error);
      }
    };

    // Initialize on first user interaction
    const handleInteraction = () => {
      initAudio();
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };

    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('click', handleInteraction);

    return () => {
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      
      engineOscillatorsRef.current.forEach(osc => osc.stop());
      tireNoiseRef.current?.stop();
      windNoiseRef.current?.stop();
      audioContextRef.current?.close();
    };
  }, [isInitialized]);

  // Update engine sound based on RPM
  useEffect(() => {
    if (!isInitialized || !audioContextRef.current) return;

    const baseFreq = 30 + (rpm / 8000) * 100;
    const volume = isAccelerating ? 0.15 : 0.05;

    engineOscillatorsRef.current.forEach((osc, i) => {
      const harmonic = [1, 2, 3, 4, 6][i];
      osc.frequency.setTargetAtTime(baseFreq * harmonic, audioContextRef.current!.currentTime, 0.1);
    });

    engineGainsRef.current.forEach((gain, i) => {
      const gainValue = (volume / (i + 1)) * (0.5 + (rpm / 8000) * 0.5);
      gain.gain.setTargetAtTime(gainValue, audioContextRef.current!.currentTime, 0.1);
    });
  }, [rpm, isAccelerating, isInitialized]);

  // Tire screech on drift
  useEffect(() => {
    if (!isInitialized || !tireGainRef.current || !audioContextRef.current) return;

    const tireVolume = isDrifting ? 0.08 : 0;
    tireGainRef.current.gain.setTargetAtTime(tireVolume, audioContextRef.current.currentTime, 0.1);
  }, [isDrifting, isInitialized]);

  // Wind noise based on speed
  useEffect(() => {
    if (!isInitialized || !windGainRef.current || !audioContextRef.current) return;

    const windVolume = (speed / 200) * 0.1;
    windGainRef.current.gain.setTargetAtTime(windVolume, audioContextRef.current.currentTime, 0.1);
  }, [speed, isInitialized]);

  return { isInitialized };
}

// Sound effect player
export function playCrashSound(audioContext: AudioContext) {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(100, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(30, audioContext.currentTime + 0.3);
  
  gain.gain.setValueAtTime(0.5, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  osc.start();
  osc.stop(audioContext.currentTime + 0.3);
}

export function playTurboWhine(audioContext: AudioContext, intensity: number) {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800 + intensity * 400, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(2000 + intensity * 1000, audioContext.currentTime + 0.5);
  
  gain.gain.setValueAtTime(0.03 * intensity, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  osc.start();
  osc.stop(audioContext.currentTime + 0.5);
}
