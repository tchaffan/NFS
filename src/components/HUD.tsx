"use client";

interface HUDProps {
  speed: number;
  rpm: number;
  gear: number;
  lapTime: number;
  lap?: number;
  position?: number;
  mode: 'career' | 'quickrace' | 'timeattack' | 'drift';
  carName?: string;
  trackName?: string;
}

export default function HUD({ speed, rpm, gear, lapTime, lap = 1, position = 1, mode, carName = '', trackName = '' }: HUDProps) {
  // Safeguard against NaN values
  const safeSpeed = isNaN(speed) || !isFinite(speed) ? 0 : Math.abs(speed);
  const safeRpm = isNaN(rpm) || !isFinite(rpm) ? 0 : rpm;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  const rpmPercent = (safeRpm / 8000) * 100;
  const redlineStart = 85;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Bar - Race Info */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex justify-between items-start">
          {/* Left - Car and Track */}
          <div className="space-y-1">
            {carName && (
              <div className="flex items-center gap-3">
                <span className="text-white/50 text-xs uppercase tracking-wider">Car</span>
                <span className="text-white font-bold">{carName}</span>
              </div>
            )}
            {trackName && (
              <div className="flex items-center gap-3">
                <span className="text-white/50 text-xs uppercase tracking-wider">Track</span>
                <span className="text-white font-bold">{trackName}</span>
              </div>
            )}
          </div>

          {/* Center - Mode */}
          <div className="bg-red-600/80 backdrop-blur-sm px-6 py-2 rounded-b-lg">
            <p className="text-white text-xl font-black tracking-wider">{mode.toUpperCase()}</p>
          </div>

          {/* Right - Position and Lap */}
          <div className="flex gap-6">
            <div className="text-right">
              <p className="text-white/50 text-xs uppercase tracking-wider">Position</p>
              <p className="text-white text-3xl font-black">
                {position}<span className="text-lg text-white/50">/12</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-xs uppercase tracking-wider">Lap</p>
              <p className="text-white text-3xl font-black">{lap}</p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-xs uppercase tracking-wider">Time</p>
              <p className="text-white text-2xl font-mono font-bold">{formatTime(lapTime)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Right - Speedometer and RPM */}
      <div className="absolute bottom-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
        <div className="space-y-4">
          {/* RPM Bar */}
          <div className="bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-white/10 w-80">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70 text-xs uppercase tracking-wider">RPM</span>
              <span className="text-white text-lg font-mono font-bold">{Math.round(safeRpm)}</span>
            </div>
            <div className="h-4 bg-gray-900 rounded-full overflow-hidden relative">
              {/* Gear indicator marks */}
              <div className="absolute inset-0 flex">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="flex-1 border-r border-gray-800 last:border-0" />
                ))}
              </div>
              <div 
                className={`h-full transition-all duration-75 ${
                  rpmPercent > redlineStart 
                    ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-500 animate-pulse' 
                    : 'bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500'
                }`}
                style={{ width: `${Math.min(rpmPercent, 100)}%` }}
              />
            </div>
            {rpmPercent > redlineStart && (
              <p className="text-red-500 text-xs mt-1 font-bold animate-pulse">● REDLINE</p>
            )}
          </div>

          {/* Speed and Gear Display */}
          <div className="bg-black/80 backdrop-blur-sm p-6 rounded-lg border border-white/10">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Speed</p>
                <p className="text-white text-7xl font-bold font-mono leading-none">
                  {Math.round(safeSpeed)}
                </p>
                <p className="text-white/70 text-sm mt-1">MPH</p>
              </div>
              
              {/* Gear Indicator */}
              <div className="flex flex-col items-center">
                <div className={`text-8xl font-black leading-none transition-all ${
                  gear === 0 ? 'text-gray-500' :
                  gear === -1 ? 'text-red-500' :
                  rpmPercent > redlineStart ? 'text-red-500 animate-pulse' :
                  'text-white'
                }`}>
                  {gear === 0 ? 'N' : gear === -1 ? 'R' : gear}
                </div>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5, 6].map((g) => (
                    <div 
                      key={g}
                      className={`w-2 h-4 rounded-sm ${
                        gear === g ? 'bg-red-500' : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Speed bar */}
            <div className="mt-4">
              <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-cyan-400"
                  style={{ width: `${Math.min((safeSpeed / 200) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Left - Controls */}
      <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
        <div className="bg-black/60 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/10 text-white/70 text-xs space-y-1">
          <p><span className="font-bold text-white">W/↑</span> Accelerate</p>
          <p><span className="font-bold text-white">S/↓</span> Brake/Reverse</p>
          <p><span className="font-bold text-white">A/← D/→</span> Steer</p>
          <p><span className="font-bold text-white">SPACE</span> Handbrake</p>
          <p><span className="font-bold text-white">C</span> Camera</p>
          <p><span className="font-bold text-white">ESC</span> Menu</p>
        </div>
      </div>

      {/* Center - Speed Effect (G-force indicator) */}
      {safeSpeed > 100 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20" 
            style={{ 
              transform: `scale(${1 + (safeSpeed - 100) / 500})`,
              opacity: Math.min((safeSpeed - 100) / 200, 0.5)
            }} 
          />
        </div>
      )}

      {/* Corner Decorations */}
      <div className="absolute top-24 left-4 w-24 h-24 border-l-2 border-t-2 border-white/20" />
      <div className="absolute top-24 right-4 w-24 h-24 border-r-2 border-t-2 border-white/20" />
      <div className="absolute bottom-32 left-4 w-24 h-24 border-l-2 border-b-2 border-white/20" />
      <div className="absolute bottom-32 right-4 w-24 h-24 border-r-2 border-b-2 border-white/20" />
    </div>
  );
}
