'use client';

import { useProgress, Html } from '@react-three/drei';

export function Loader() {
    const { progress } = useProgress();

    return (
        <Html center>
            <div className="flex flex-col items-center justify-center min-w-[300px]">
                {/* Logo/Icon */}
                <div className="relative w-20 h-20 mb-8">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 animate-pulse" />
                    <div className="absolute inset-2 rounded-full bg-zinc-900 flex items-center justify-center">
                        <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                </div>

                {/* Progress Text */}
                <p className="text-2xl font-light text-white mb-4 tracking-wider">
                    {Math.round(progress)}%
                </p>

                {/* Progress Bar */}
                <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Loading Text */}
                <p className="text-zinc-500 text-sm mt-4 animate-pulse">
                    Loading experience...
                </p>
            </div>
        </Html>
    );
}

export function FullScreenLoader() {
    const { progress } = useProgress();

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
            {/* Logo/Icon */}
            <div className="relative w-24 h-24 mb-10">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 animate-spin-slow" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-2 rounded-full bg-zinc-900 flex items-center justify-center">
                    <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                </div>
            </div>

            {/* Brand Name */}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
                CLEAVER PRO
            </h1>
            <p className="text-zinc-500 text-sm mb-8">Master Craftsmanship</p>

            {/* Progress */}
            <div className="flex flex-col items-center">
                <p className="text-4xl font-light text-white mb-6 tracking-widest tabular-nums">
                    {Math.round(progress)}%
                </p>

                <div className="w-72 h-1.5 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                    <div
                        className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 transition-all duration-300 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <p className="text-zinc-600 text-xs mt-6 tracking-wider uppercase">
                    {progress < 30 ? 'Loading textures...' : progress < 70 ? 'Building scene...' : 'Almost ready...'}
                </p>
            </div>
        </div>
    );
}
