'use client';

import { useEffect, useState, ReactNode } from 'react';

interface WebGLGuardProps {
    children: ReactNode;
    fallback?: ReactNode;
}

function checkWebGLSupport(): boolean {
    if (typeof window === 'undefined') return true;

    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
    } catch {
        return false;
    }
}

function StaticFallback() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center px-6 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-block px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-6 border border-amber-500/20">
                        Master Craftsmanship
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Precision
                        <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                            Crafted
                        </span>
                    </h1>
                    <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
                        The ultimate professional cleaver, forged from premium carbon steel with an ergonomic hardwood handle.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="#features" className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all duration-300">
                            Explore Features
                        </a>
                        <a href="#cta" className="px-8 py-4 border border-zinc-600 text-white font-semibold rounded-xl hover:bg-zinc-800 transition-all duration-300">
                            Get Yours
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="min-h-screen py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-white text-center mb-16">
                        Exceptional Features
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Razor Sharp', desc: 'Hand-sharpened blade with precision 15° cutting angle', icon: '⚔️' },
                            { title: 'Perfect Balance', desc: 'Weighted for effortless control and reduced fatigue', icon: '⚖️' },
                            { title: 'Built to Last', desc: 'Premium materials ensure generations of reliable use', icon: '🛡️' },
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-zinc-400">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Details Section */}
            <section id="details" className="min-h-screen py-20 px-6 bg-zinc-900/50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold text-white text-center mb-16">
                        Technical Specifications
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {[
                            { label: 'Blade Material', value: 'High Carbon Steel' },
                            { label: 'Handle', value: 'Pakkawood' },
                            { label: 'Total Length', value: '12 inches' },
                            { label: 'Blade Length', value: '7 inches' },
                            { label: 'Weight', value: '1.2 lbs' },
                            { label: 'Edge Angle', value: '15° per side' },
                        ].map((spec, i) => (
                            <div key={i} className="flex justify-between items-center p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
                                <span className="text-zinc-400">{spec.label}</span>
                                <span className="text-white font-medium">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="cta" className="min-h-screen flex items-center justify-center px-6 py-20">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Elevate Your Kitchen?
                    </h2>
                    <p className="text-xl text-zinc-400 mb-8">
                        Join thousands of professional chefs who trust our craftsmanship.
                    </p>
                    <button className="px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-lg font-semibold rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all duration-300 shadow-lg shadow-amber-500/20">
                        Order Now — $199
                    </button>
                </div>
            </section>
        </div>
    );
}

export function WebGLGuard({ children, fallback }: WebGLGuardProps) {
    const [isSupported, setIsSupported] = useState<boolean | null>(null);

    useEffect(() => {
        setIsSupported(checkWebGLSupport());
    }, []);

    // Still checking
    if (isSupported === null) {
        return null;
    }

    // WebGL not supported
    if (!isSupported) {
        return <>{fallback || <StaticFallback />}</>;
    }

    // WebGL supported
    return <>{children}</>;
}
