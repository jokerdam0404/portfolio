'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

interface PerformanceStats {
    fps: number;
    frameTime: number;
    memory?: number;
    drawCalls?: number;
    triangles?: number;
}

interface PerformanceMonitorProps {
    onChange?: (stats: PerformanceStats) => void;
    onDegradePerformance?: () => void;
    targetFPS?: number;
}

/**
 * Performance Monitor for Three.js Scenes
 *
 * Features:
 * - Real-time FPS tracking
 * - Memory usage monitoring
 * - Draw call and triangle count
 * - Automatic quality degradation when FPS drops
 * - Performance budget alerts
 */
export function PerformanceMonitor({
    onChange,
    onDegradePerformance,
    targetFPS = 30,
}: PerformanceMonitorProps) {
    const { gl, scene } = useThree();
    const frameCount = useRef(0);
    const lastTime = useRef(performance.now());
    const frameTimesRef = useRef<number[]>([]);
    const [stats, setStats] = useState<PerformanceStats>({
        fps: 60,
        frameTime: 16.67,
    });

    useFrame(() => {
        frameCount.current++;
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime.current;

        // Store frame times for averaging
        frameTimesRef.current.push(deltaTime);
        if (frameTimesRef.current.length > 60) {
            frameTimesRef.current.shift();
        }

        // Update stats every second
        if (deltaTime >= 1000) {
            const avgFrameTime =
                frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
            const fps = 1000 / avgFrameTime;

            const newStats: PerformanceStats = {
                fps: Math.round(fps),
                frameTime: avgFrameTime,
            };

            // Get renderer info
            if (gl.info) {
                newStats.drawCalls = gl.info.render.calls;
                newStats.triangles = gl.info.render.triangles;
            }

            // Get memory usage (if available)
            if ((performance as any).memory) {
                newStats.memory = Math.round(
                    (performance as any).memory.usedJSHeapSize / 1048576
                ); // MB
            }

            setStats(newStats);
            onChange?.(newStats);

            // Check if performance degradation is needed
            if (fps < targetFPS && onDegradePerformance) {
                onDegradePerformance();
            }

            frameCount.current = 0;
            lastTime.current = currentTime;
        }
    });

    return null;
}

/**
 * Performance HUD (Development Mode)
 */
export function PerformanceHUD() {
    const [stats, setStats] = useState<PerformanceStats>({
        fps: 60,
        frameTime: 16.67,
    });

    const getFPSColor = (fps: number) => {
        if (fps >= 55) return '#00ff00';
        if (fps >= 30) return '#ffff00';
        return '#ff0000';
    };

    return (
        <>
            <PerformanceMonitor onChange={setStats} />
            <div className="absolute top-4 left-4 font-mono text-xs space-y-1 bg-black/70 p-3 rounded backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <span className="text-gray-400">FPS:</span>
                    <span style={{ color: getFPSColor(stats.fps) }} className="font-bold">
                        {stats.fps}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400">Frame:</span>
                    <span className="text-white">{stats.frameTime.toFixed(2)}ms</span>
                </div>
                {stats.drawCalls !== undefined && (
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400">Calls:</span>
                        <span className="text-white">{stats.drawCalls}</span>
                    </div>
                )}
                {stats.triangles !== undefined && (
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400">Tris:</span>
                        <span className="text-white">{(stats.triangles / 1000).toFixed(1)}k</span>
                    </div>
                )}
                {stats.memory !== undefined && (
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400">Mem:</span>
                        <span className="text-white">{stats.memory}MB</span>
                    </div>
                )}
            </div>
        </>
    );
}

/**
 * Adaptive Quality Controller
 *
 * Automatically adjusts scene quality based on performance
 */
export function useAdaptiveQuality(initialQuality: 'low' | 'medium' | 'high' = 'high') {
    const [quality, setQuality] = useState(initialQuality);
    const degradeCount = useRef(0);

    const handleDegrade = () => {
        degradeCount.current++;

        // Only degrade if performance is consistently poor
        if (degradeCount.current > 3) {
            setQuality((prev) => {
                if (prev === 'high') return 'medium';
                if (prev === 'medium') return 'low';
                return 'low';
            });
            degradeCount.current = 0;
        }
    };

    const handleImprove = () => {
        // Tentatively try to improve quality
        setQuality((prev) => {
            if (prev === 'low') return 'medium';
            if (prev === 'medium') return 'high';
            return 'high';
        });
        degradeCount.current = 0;
    };

    useEffect(() => {
        // Try to improve quality every 30 seconds if running smoothly
        const interval = setInterval(() => {
            if (degradeCount.current === 0) {
                handleImprove();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    return { quality, onDegrade: handleDegrade };
}
