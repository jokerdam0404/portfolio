'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WormholeParams, DEFAULT_WORMHOLE_PARAMS, PhysicsValidation } from './PhysicsEngine';

interface PhysicsControlsProps {
    params: WormholeParams;
    onParamsChange: (params: WormholeParams) => void;
    showAdvanced?: boolean;
    className?: string;
}

interface SliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    unit: string;
    description: string;
    onChange: (value: number) => void;
    scientificNotation?: boolean;
}

/**
 * Physics-Based Slider Control
 *
 * Displays the parameter with its physical meaning and units
 */
function PhysicsSlider({
    label,
    value,
    min,
    max,
    step,
    unit,
    description,
    onChange,
    scientificNotation = false
}: SliderProps) {
    const formatValue = (v: number) => {
        if (scientificNotation && Math.abs(v) < 0.01) {
            return v.toExponential(2);
        }
        return v.toFixed(step < 1 ? Math.ceil(-Math.log10(step)) : 0);
    };

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-mono text-blue-300">{label}</label>
                <span className="text-sm font-mono text-white">
                    {formatValue(value)} {unit}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-blue-900/50 rounded-lg appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none
                           [&::-webkit-slider-thumb]:w-4
                           [&::-webkit-slider-thumb]:h-4
                           [&::-webkit-slider-thumb]:rounded-full
                           [&::-webkit-slider-thumb]:bg-blue-400
                           [&::-webkit-slider-thumb]:shadow-lg
                           [&::-webkit-slider-thumb]:shadow-blue-500/50
                           hover:[&::-webkit-slider-thumb]:bg-blue-300
                           transition-all"
            />
            <p className="text-xs text-gray-400 mt-1 font-mono">{description}</p>
        </div>
    );
}

/**
 * Interactive Physics Controls Panel
 *
 * Provides real-time adjustment of wormhole parameters with
 * scientific explanations and constraint validation.
 *
 * Based on Morris-Thorne wormhole physics where:
 * - Throat radius (b0) is the minimum circumferential radius
 * - Length (W) is the proper distance through the wormhole
 * - Mass (M) affects gravitational lensing strength
 * - Spin (a) introduces frame-dragging (Kerr-like effects)
 */
export default function PhysicsControls({
    params,
    onParamsChange,
    showAdvanced = false,
    className = ''
}: PhysicsControlsProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showEquations, setShowEquations] = useState(false);

    // Validate exotic matter requirements when params change
    const exoticMatterInfo = PhysicsValidation.checkExoticMatter(params);

    const handleParamChange = useCallback((key: keyof WormholeParams, value: number) => {
        const newParams = { ...params, [key]: value };

        // Physical constraints
        if (key === 'throatRadius' && value < 0.1) {
            value = 0.1; // Minimum throat radius for numerical stability
        }

        if (key === 'mass' && value > params.throatRadius * 0.4) {
            // Prevent mass from exceeding what would create an event horizon
            value = params.throatRadius * 0.4;
        }

        onParamsChange({ ...params, [key]: value });
    }, [params, onParamsChange]);

    const resetToDefault = useCallback(() => {
        onParamsChange(DEFAULT_WORMHOLE_PARAMS);
    }, [onParamsChange]);

    // Preset configurations
    const presets = [
        {
            name: 'Interstellar (Gargantua)',
            params: { throatRadius: 1.0, length: 2.0, mass: 0.1, spin: 0.0 },
            description: 'Based on Kip Thorne\'s calculations for the movie'
        },
        {
            name: 'Wide Throat',
            params: { throatRadius: 2.0, length: 1.0, mass: 0.05, spin: 0.0 },
            description: 'Larger throat, less extreme lensing'
        },
        {
            name: 'Strong Lensing',
            params: { throatRadius: 0.5, length: 3.0, mass: 0.2, spin: 0.0 },
            description: 'Tighter throat with strong gravitational effects'
        },
        {
            name: 'Long Tunnel',
            params: { throatRadius: 1.0, length: 5.0, mass: 0.1, spin: 0.0 },
            description: 'Extended proper length through wormhole'
        }
    ];

    return (
        <motion.div
            className={`bg-black/80 backdrop-blur-md rounded-lg border border-blue-500/30 ${className}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-blue-900/20 transition-colors rounded-t-lg"
            >
                <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-mono text-sm">PHYSICS</span>
                    <span className="text-white font-semibold">Wormhole Parameters</span>
                </div>
                <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="text-blue-400"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.span>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 border-t border-blue-500/20">
                            {/* Presets */}
                            <div className="mb-6">
                                <h4 className="text-xs font-mono text-gray-400 mb-2">PRESETS</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {presets.map((preset) => (
                                        <button
                                            key={preset.name}
                                            onClick={() => onParamsChange(preset.params)}
                                            className="p-2 text-xs text-left bg-blue-900/30 hover:bg-blue-800/50
                                                     rounded border border-blue-500/20 hover:border-blue-400/50
                                                     transition-all group"
                                            title={preset.description}
                                        >
                                            <span className="text-blue-300 group-hover:text-blue-200">
                                                {preset.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Main Controls */}
                            <div className="space-y-4">
                                <PhysicsSlider
                                    label="Throat Radius (b0)"
                                    value={params.throatRadius}
                                    min={0.1}
                                    max={5.0}
                                    step={0.1}
                                    unit="r_s"
                                    description="Minimum radius at wormhole throat. r(l) = sqrt(b0^2 + l^2)"
                                    onChange={(v) => handleParamChange('throatRadius', v)}
                                />

                                <PhysicsSlider
                                    label="Proper Length (W)"
                                    value={params.length}
                                    min={0.5}
                                    max={10.0}
                                    step={0.1}
                                    unit="b0"
                                    description="Proper distance from one mouth to the other through the throat"
                                    onChange={(v) => handleParamChange('length', v)}
                                />

                                <PhysicsSlider
                                    label="Mass Parameter (M)"
                                    value={params.mass}
                                    min={0.01}
                                    max={0.5}
                                    step={0.01}
                                    unit="M_sun"
                                    description="Effective mass for gravitational lensing. Deflection ~ 4GM/bc^2"
                                    onChange={(v) => handleParamChange('mass', v)}
                                />

                                {showAdvanced && (
                                    <PhysicsSlider
                                        label="Spin Parameter (a)"
                                        value={params.spin}
                                        min={0.0}
                                        max={0.998}
                                        step={0.01}
                                        unit="M"
                                        description="Frame-dragging parameter. a = J/Mc (Kerr-like extension)"
                                        onChange={(v) => handleParamChange('spin', v)}
                                    />
                                )}
                            </div>

                            {/* Exotic Matter Warning */}
                            <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
                                <div className="flex items-start gap-2">
                                    <span className="text-yellow-400 text-lg">&#9888;</span>
                                    <div>
                                        <h5 className="text-yellow-300 text-sm font-semibold mb-1">
                                            Exotic Matter Required
                                        </h5>
                                        <p className="text-yellow-200/70 text-xs font-mono">
                                            Morris-Thorne wormholes require matter with negative energy density
                                            (violating the Null Energy Condition). At the throat, the minimum
                                            violation is:
                                        </p>
                                        <p className="text-yellow-300 text-xs font-mono mt-1">
                                            rho + p {'<'} {exoticMatterInfo.minimumNECViolation.toExponential(2)} / (8 pi G b0^2)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Equations Toggle */}
                            <button
                                onClick={() => setShowEquations(!showEquations)}
                                className="mt-4 w-full p-2 text-sm text-blue-300 hover:text-blue-200
                                         bg-blue-900/20 hover:bg-blue-800/30 rounded transition-colors"
                            >
                                {showEquations ? 'Hide Equations' : 'Show Governing Equations'}
                            </button>

                            <AnimatePresence>
                                {showEquations && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="mt-3 p-3 bg-gray-900/50 rounded border border-gray-700 overflow-hidden"
                                    >
                                        <h5 className="text-xs font-mono text-gray-400 mb-2">
                                            MORRIS-THORNE METRIC
                                        </h5>
                                        <div className="font-mono text-xs text-green-300 space-y-2">
                                            <p>ds^2 = -c^2 dt^2 + dl^2 + r(l)^2 (d theta^2 + sin^2 theta d phi^2)</p>
                                            <p className="text-gray-400">where:</p>
                                            <p>r(l) = sqrt(b0^2 + l^2) = sqrt({params.throatRadius.toFixed(2)}^2 + l^2)</p>
                                        </div>

                                        <h5 className="text-xs font-mono text-gray-400 mt-4 mb-2">
                                            GEODESIC EQUATION
                                        </h5>
                                        <div className="font-mono text-xs text-green-300">
                                            <p>d^2 x^mu/d lambda^2 + Gamma^mu_ab dx^a/d lambda dx^b/d lambda = 0</p>
                                        </div>

                                        <h5 className="text-xs font-mono text-gray-400 mt-4 mb-2">
                                            LIGHT DEFLECTION
                                        </h5>
                                        <div className="font-mono text-xs text-green-300">
                                            <p>delta phi = 4GM/(c^2 b) = {(4 * params.mass).toFixed(3)}/b radians</p>
                                        </div>

                                        <h5 className="text-xs font-mono text-gray-400 mt-4 mb-2">
                                            EINSTEIN RING RADIUS
                                        </h5>
                                        <div className="font-mono text-xs text-green-300">
                                            <p>theta_E = sqrt(4GM D_LS / (c^2 D_L D_S))</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Reset Button */}
                            <button
                                onClick={resetToDefault}
                                className="mt-4 w-full p-2 text-sm text-gray-400 hover:text-white
                                         border border-gray-600 hover:border-gray-400 rounded transition-colors"
                            >
                                Reset to Default
                            </button>

                            {/* References */}
                            <div className="mt-4 pt-3 border-t border-gray-700">
                                <h5 className="text-xs font-mono text-gray-500 mb-1">REFERENCES</h5>
                                <ul className="text-xs text-gray-400 space-y-1">
                                    <li>Morris & Thorne (1988) - Am. J. Phys. 56, 395</li>
                                    <li>James et al. (2015) - arXiv:1502.03809</li>
                                    <li>Oliver et al. (2015) - arXiv:1502.03808</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/**
 * Compact physics info display for HUD overlay
 */
export function PhysicsHUD({ params }: { params: WormholeParams }) {
    const schwarzschildRadius = 2 * params.mass;
    const photonSphereRadius = 1.5 * schwarzschildRadius;
    const iscoRadius = 3 * schwarzschildRadius; // Innermost stable circular orbit

    return (
        <div className="bg-black/60 backdrop-blur-sm rounded p-3 font-mono text-xs">
            <h4 className="text-blue-400 mb-2">PHYSICS DATA</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-300">
                <span>Throat radius:</span>
                <span className="text-white">{params.throatRadius.toFixed(2)} r_s</span>

                <span>Schwarzschild r:</span>
                <span className="text-white">{schwarzschildRadius.toFixed(3)} M</span>

                <span>Photon sphere:</span>
                <span className="text-white">{photonSphereRadius.toFixed(3)} M</span>

                <span>ISCO:</span>
                <span className="text-white">{iscoRadius.toFixed(3)} M</span>

                <span>Mass param:</span>
                <span className="text-white">{params.mass.toFixed(3)} M_sun</span>

                <span>Wormhole length:</span>
                <span className="text-white">{params.length.toFixed(2)} b0</span>
            </div>
        </div>
    );
}
