# Active Context: NFS Unleashed Racing Game

## Current State

**Project Status**: ✅ Complete

NFS Unleashed is a fully playable 3D racing game built with Next.js 16, React 19, Three.js, and @react-three/cannon physics engine. The game features realistic racing physics, multiple cars and tracks, game modes, and immersive visual/audio effects.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] NFS Unleashed racing game implementation
- [x] Three.js 3D racing scene with physics
- [x] 10 GT3 cars (Porsche 911 GT3 R, BMW M4 GT3 Evo, Mercedes-AMG GT3 Evo, Audi R8 LMS GT3 Evo II, Ferrari 296 GT3, Lamborghini Huracán GT3 Evo2, McLaren 720S GT3 Evo, Aston Martin Vantage GT3, Corvette Z06 GT3.R, Ford Mustang GT3)
- [x] 10 famous tracks (Nürburgring, Spa, Silverstone, Monza, etc.)
- [x] Game modes: Career, Quick Race, Time Attack, Drift
- [x] Cockpit HUD with RPM, speed, gear, lap time
- [x] Post-processing effects (bloom, vignette, DOF, chromatic aberration)
- [x] Engine audio with Web Audio API
- [x] Build verification and TypeScript/lint checks
- [x] Fixed track orientation (car now spawns above ground with gravity pulling down)
- [x] Realistic car physics: low center of mass, proper suspension (35 stiffness, 0.21m rest), rolling friction 0.015, engine torque scaled with gears, 20,000 Nm brakes, ~30° max steering
- [x] Updated car roster with authentic GT3 specs: engine layouts (Front/Mid/Rear), displacement, torque, drivetrain (RWD/AWD), iconic liveries, handling characteristics
- [x] Dynamic physics per car: suspension stiffness, grip levels, steering sensitivity based on handling rating
- [x] Engine-specific power delivery: rear-engine cars (Porsche) to rear wheels, mid-engine cars balanced, front-engine cars with torque vectoring
- [x] Top-down camera view: car appears at top of screen, road at bottom
- [x] Fixed NaN speed values in HUD and physics calculations
- [x] Comprehensive NaN protection for speed, RPM, gear, and physics calculations

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

The template is ready. Next steps depend on user requirements:

1. What type of application to build
2. What features are needed
3. Design/branding preferences

## Quick Start Guide

### To add a new page:

Create a file at `src/app/[route]/page.tsx`:
```tsx
export default function NewPage() {
  return <div>New page content</div>;
}
```

### To add components:

Create `src/components/` directory and add components:
```tsx
// src/components/ui/Button.tsx
export function Button({ children }: { children: React.ReactNode }) {
  return <button className="px-4 py-2 bg-blue-600 text-white rounded">{children}</button>;
}
```

### To add a database:

Follow `.kilocode/recipes/add-database.md`

### To add API routes:

Create `src/app/api/[route]/route.ts`:
```tsx
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello" });
}
```

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Pending Improvements

- [ ] Add more recipes (auth, email, etc.)
- [ ] Add example components
- [ ] Add testing setup recipe

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-02-12 | Fixed car/track orientation and implemented realistic physics per Unity specs |
| 2026-02-12 | Updated car roster with 10 authentic GT3 cars: Porsche 911 GT3 R, BMW M4 GT3 Evo, Mercedes-AMG GT3 Evo, Audi R8 LMS GT3 Evo II, Ferrari 296 GT3, Lamborghini Huracán GT3 Evo2, McLaren 720S GT3 Evo, Aston Martin Vantage GT3, Corvette Z06 GT3.R, Ford Mustang GT3 |
| 2026-02-12 | Added GT3 car properties: engine layout, displacement, torque, drivetrain, iconic liveries, handling notes |
| 2026-02-12 | Dynamic physics per car: suspension/grip/steering tuned by handling rating, engine-specific power delivery
