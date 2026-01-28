/**
 * Optimization Utilities for WebGL Wormhole
 *
 * Helper functions and utilities for performance optimization,
 * device detection, and quality management.
 */

/**
 * Device capability detection
 */
export interface DeviceCapability {
    tier: 'low' | 'medium' | 'high';
    isMobile: boolean;
    hasDiscreteGPU: boolean;
    supportsWebGL2: boolean;
    memoryGB?: number;
    cores?: number;
}

export function detectDeviceCapability(): DeviceCapability {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );

    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');

    if (!gl) {
        return {
            tier: 'low',
            isMobile,
            hasDiscreteGPU: false,
            supportsWebGL2: false,
        };
    }

    const supportsWebGL2 = !!canvas.getContext('webgl2');

    // Try to detect GPU
    let hasDiscreteGPU = false;
    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');

    if (debugInfo) {
        const renderer = (gl as WebGLRenderingContext).getParameter(
            debugInfo.UNMASKED_RENDERER_WEBGL
        ) as string;

        // Discrete GPUs usually have NVIDIA, AMD, or high-end Intel Iris
        hasDiscreteGPU =
            /NVIDIA|AMD|Radeon|GeForce|Quadro|Tesla|Iris Pro|Iris Plus/i.test(renderer);
    }

    // Detect memory (approximation)
    let memoryGB: number | undefined;
    if ((navigator as any).deviceMemory) {
        memoryGB = (navigator as any).deviceMemory;
    }

    // Detect CPU cores
    let cores: number | undefined;
    if (navigator.hardwareConcurrency) {
        cores = navigator.hardwareConcurrency;
    }

    // Determine tier
    let tier: 'low' | 'medium' | 'high' = 'medium';

    if (isMobile) {
        // Mobile devices
        if (memoryGB && memoryGB >= 6) {
            tier = 'medium';
        } else {
            tier = 'low';
        }
    } else {
        // Desktop devices
        if (hasDiscreteGPU && supportsWebGL2) {
            tier = 'high';
        } else if (supportsWebGL2) {
            tier = 'medium';
        } else {
            tier = 'low';
        }
    }

    return {
        tier,
        isMobile,
        hasDiscreteGPU,
        supportsWebGL2,
        memoryGB,
        cores,
    };
}

/**
 * Quality presets for different tiers
 */
export interface QualityPreset {
    particleCounts: {
        cosmic: number;
        energy: number;
        stars: number;
    };
    enablePostProcessing: boolean;
    enableAntialiasing: boolean;
    dpr: number | [number, number];
    shadowMapSize: number;
    targetFPS: number;
}

export const QUALITY_PRESETS: Record<'low' | 'medium' | 'high', QualityPreset> = {
    low: {
        particleCounts: {
            cosmic: 800,
            energy: 150,
            stars: 400,
        },
        enablePostProcessing: false,
        enableAntialiasing: false,
        dpr: 1,
        shadowMapSize: 512,
        targetFPS: 30,
    },
    medium: {
        particleCounts: {
            cosmic: 2500,
            energy: 400,
            stars: 800,
        },
        enablePostProcessing: false,
        enableAntialiasing: false,
        dpr: [1, 1.5],
        shadowMapSize: 1024,
        targetFPS: 50,
    },
    high: {
        particleCounts: {
            cosmic: 4000,
            energy: 800,
            stars: 1500,
        },
        enablePostProcessing: true,
        enableAntialiasing: true,
        dpr: [1, 2],
        shadowMapSize: 2048,
        targetFPS: 60,
    },
};

/**
 * Get recommended quality preset for current device
 */
export function getRecommendedQuality(): QualityPreset {
    const capability = detectDeviceCapability();
    return QUALITY_PRESETS[capability.tier];
}

/**
 * Memory budget calculator
 */
export function calculateMemoryBudget(particleCount: number): {
    estimatedMB: number;
    withinBudget: boolean;
} {
    // Estimate: Each particle needs position (3), velocity (3), color (3), size (1) = 10 floats
    // Float32 = 4 bytes
    const bytesPerParticle = 10 * 4;
    const totalBytes = particleCount * bytesPerParticle;
    const estimatedMB = totalBytes / (1024 * 1024);

    // Budget: 50MB for particles (conservative)
    const budget = 50;
    const withinBudget = estimatedMB <= budget;

    return { estimatedMB, withinBudget };
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return function (this: any, ...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Debounce function for resize events
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null;
    return function (this: any, ...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func.apply(this, args);
        };
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get viewport dimensions
 */
export function getViewportDimensions(): { width: number; height: number } {
    if (typeof window === 'undefined') {
        return { width: 1920, height: 1080 };
    }
    return {
        width: window.innerWidth,
        height: window.innerHeight,
    };
}

/**
 * Calculate optimal particle count for viewport
 */
export function getOptimalParticleCount(quality: 'low' | 'medium' | 'high'): number {
    const { width, height } = getViewportDimensions();
    const pixels = width * height;

    // Base counts
    const baseCounts = {
        low: 1000,
        medium: 3000,
        high: 5000,
    };

    // Scale based on viewport size
    // 1920x1080 = 2,073,600 pixels (baseline)
    const baseline = 1920 * 1080;
    const scale = Math.min(pixels / baseline, 2); // Cap at 2x

    return Math.floor(baseCounts[quality] * scale);
}

/**
 * FPS tracking utility
 */
export class FPSTracker {
    private frames: number[] = [];
    private lastTime = performance.now();

    update(): number {
        const currentTime = performance.now();
        const delta = currentTime - this.lastTime;
        this.lastTime = currentTime;

        if (delta > 0) {
            const fps = 1000 / delta;
            this.frames.push(fps);

            // Keep last 60 frames
            if (this.frames.length > 60) {
                this.frames.shift();
            }
        }

        return this.getAverageFPS();
    }

    getAverageFPS(): number {
        if (this.frames.length === 0) return 60;
        const sum = this.frames.reduce((a, b) => a + b, 0);
        return sum / this.frames.length;
    }

    isPerformanceGood(targetFPS = 30): boolean {
        return this.getAverageFPS() >= targetFPS;
    }

    reset(): void {
        this.frames = [];
        this.lastTime = performance.now();
    }
}

/**
 * WebGL capability check
 */
export function checkWebGLCapabilities(): {
    supported: boolean;
    version: 1 | 2 | null;
    extensions: string[];
    maxTextureSize: number;
    maxViewportDims: [number, number];
} {
    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2');
    const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (gl2) {
        const extensions = gl2.getSupportedExtensions() || [];
        return {
            supported: true,
            version: 2,
            extensions,
            maxTextureSize: gl2.getParameter(gl2.MAX_TEXTURE_SIZE),
            maxViewportDims: gl2.getParameter(gl2.MAX_VIEWPORT_DIMS),
        };
    }

    if (gl1) {
        const extensions = (gl1 as WebGLRenderingContext).getSupportedExtensions() || [];
        return {
            supported: true,
            version: 1,
            extensions,
            maxTextureSize: (gl1 as WebGLRenderingContext).getParameter(
                (gl1 as WebGLRenderingContext).MAX_TEXTURE_SIZE
            ),
            maxViewportDims: (gl1 as WebGLRenderingContext).getParameter(
                (gl1 as WebGLRenderingContext).MAX_VIEWPORT_DIMS
            ),
        };
    }

    return {
        supported: false,
        version: null,
        extensions: [],
        maxTextureSize: 0,
        maxViewportDims: [0, 0],
    };
}

/**
 * Battery status check (for further optimization)
 */
export async function getBatteryStatus(): Promise<{
    charging: boolean;
    level: number;
    shouldOptimize: boolean;
}> {
    if (!('getBattery' in navigator)) {
        return { charging: true, level: 1, shouldOptimize: false };
    }

    try {
        const battery = await (navigator as any).getBattery();
        return {
            charging: battery.charging,
            level: battery.level,
            shouldOptimize: !battery.charging && battery.level < 0.2,
        };
    } catch {
        return { charging: true, level: 1, shouldOptimize: false };
    }
}

/**
 * Network speed detection (for asset loading)
 */
export function getNetworkSpeed(): 'slow' | 'medium' | 'fast' {
    if (!('connection' in navigator)) {
        return 'medium';
    }

    const connection = (navigator as any).connection;
    const effectiveType = connection?.effectiveType;

    if (effectiveType === '4g') return 'fast';
    if (effectiveType === '3g') return 'medium';
    return 'slow';
}

/**
 * Export device report for debugging
 */
export function generateDeviceReport(): string {
    const capability = detectDeviceCapability();
    const webgl = checkWebGLCapabilities();
    const viewport = getViewportDimensions();

    return `
=== Device Capability Report ===

Tier: ${capability.tier.toUpperCase()}
Mobile: ${capability.isMobile ? 'Yes' : 'No'}
Discrete GPU: ${capability.hasDiscreteGPU ? 'Yes' : 'No'}
WebGL 2.0: ${capability.supportsWebGL2 ? 'Yes' : 'No'}
Memory: ${capability.memoryGB || 'Unknown'} GB
CPU Cores: ${capability.cores || 'Unknown'}

WebGL Version: ${webgl.version || 'Not supported'}
Max Texture Size: ${webgl.maxTextureSize}px
Max Viewport: ${webgl.maxViewportDims[0]}x${webgl.maxViewportDims[1]}px

Current Viewport: ${viewport.width}x${viewport.height}px

Reduced Motion: ${prefersReducedMotion() ? 'Yes' : 'No'}

Recommended Settings:
- Quality: ${capability.tier}
- Particles: ${getOptimalParticleCount(capability.tier)}
- Target FPS: ${QUALITY_PRESETS[capability.tier].targetFPS}
    `.trim();
}
