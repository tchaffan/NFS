"use client";

import dynamic from 'next/dynamic';

const RacingGame = dynamic(() => import('@/components/RacingGame'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">NFS UNLEASHED</h1>
        <p className="text-xl">Loading Racing Experience...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <RacingGame />;
}
