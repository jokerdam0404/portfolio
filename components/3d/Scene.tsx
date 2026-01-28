'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { Environment, Preload } from '@react-three/drei';
import Effects from './Effects';

interface SceneProps {
    children?: React.ReactNode;
    className?: string;
}

export default function Scene({ children, className = '' }: SceneProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className={`w-full h-full ${className}`}>
            <Canvas
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                }}
                dpr={[1, 2]}
                camera={{ position: [0, 0, 5], fov: 45 }}
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    {/* Premium studio lighting */}
                    <ambientLight intensity={0.4} />
                    <directionalLight
                        position={[10, 10, 5]}
                        intensity={1.5}
                        castShadow
                        shadow-mapSize={[2048, 2048]}
                    />
                    <directionalLight
                        position={[-5, 5, -5]}
                        intensity={0.5}
                        color="#a0c4ff"
                    />

                    {/* HDR Environment for reflections */}
                    <Environment preset="studio" />

                    {children}

                    {/* Postprocessing effects */}
                    <Effects />

                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
}
