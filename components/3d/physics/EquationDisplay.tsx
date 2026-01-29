'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WormholeParams, MorrisThorneMetric, GravitationalLensing } from './PhysicsEngine';
import { PhysicsData } from './PhysicsWormhole';

interface EquationDisplayProps {
    params: WormholeParams;
    physicsData?: PhysicsData;
    className?: string;
    mode?: 'minimal' | 'detailed' | 'educational';
}

/**
 * Real-Time Equation Display Component
 *
 * Shows the actual physics equations being solved with current parameter values.
 * Designed for educational purposes and scientific transparency.
 *
 * Features:
 * - Live metric tensor components
 * - Christoffel symbol values
 * - Geodesic equation terms
 * - Lensing calculations
 * - Performance metrics
 */
export default function EquationDisplay({
    params,
    physicsData,
    className = '',
    mode = 'detailed'
}: EquationDisplayProps) {
    const [activeTab, setActiveTab] = useState<'metric' | 'geodesic' | 'lensing' | 'energy'>('metric');
    const [sampleL, setSampleL] = useState(0); // Sample position for calculations
    const [sampleTheta, setSampleTheta] = useState(Math.PI / 2);

    // Create metric calculator
    const metric = useMemo(() => new MorrisThorneMetric(params), [params]);
    const lensing = useMemo(() => new GravitationalLensing(params), [params]);

    // Calculate metric values at sample point
    const metricValues = useMemo(() => {
        const r = metric.circumferentialRadius(sampleL);
        const components = metric.getMetricComponents(sampleL, sampleTheta);
        const christoffel = metric.getChristoffelSymbols(sampleL, sampleTheta);

        return { r, components, christoffel };
    }, [metric, sampleL, sampleTheta]);

    // Calculate lensing values
    const lensingValues = useMemo(() => {
        const impactParam = params.throatRadius * 2;
        const deflection = lensing.deflectionAngle(impactParam);
        const einsteinRadius = lensing.einsteinRingRadius(10, 100);
        const redshift = lensing.gravitationalRedshift(sampleL);
        const magnification = lensing.magnification(impactParam, 50);

        return { impactParam, deflection, einsteinRadius, redshift, magnification };
    }, [lensing, params, sampleL]);

    if (mode === 'minimal') {
        return (
            <div className={`bg-black/70 backdrop-blur-sm rounded-lg p-3 font-mono text-xs ${className}`}>
                <div className="text-blue-400 mb-2">LIVE PHYSICS</div>
                <div className="text-green-300 space-y-1">
                    <div>r(l={sampleL.toFixed(1)}) = {metricValues.r.toFixed(4)}</div>
                    <div>delta_phi = {lensingValues.deflection.toFixed(4)} rad</div>
                    <div>z = {lensingValues.redshift.toFixed(4)}</div>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'metric', label: 'Metric Tensor' },
        { id: 'geodesic', label: 'Geodesics' },
        { id: 'lensing', label: 'Lensing' },
        { id: 'energy', label: 'Energy Conditions' }
    ] as const;

    return (
        <motion.div
            className={`bg-black/80 backdrop-blur-md rounded-lg border border-blue-500/30 overflow-hidden ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="p-3 border-b border-blue-500/20 bg-blue-900/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-green-400 text-lg">&#8721;</span>
                        <span className="text-white font-semibold text-sm">Real-Time Equations</span>
                    </div>
                    {physicsData && (
                        <span className="text-xs text-gray-400 font-mono">
                            {physicsData.frameTime.toFixed(1)}ms/frame
                        </span>
                    )}
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-blue-500/20">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 px-3 py-2 text-xs font-mono transition-colors
                            ${activeTab === tab.id
                                ? 'bg-blue-900/40 text-blue-300 border-b-2 border-blue-400'
                                : 'text-gray-400 hover:text-gray-200 hover:bg-blue-900/20'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Sample Point Controls */}
            <div className="p-3 bg-gray-900/30 border-b border-gray-700/50">
                <div className="text-xs text-gray-400 mb-2 font-mono">EVALUATION POINT</div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-500">l (radial)</label>
                        <input
                            type="range"
                            min={-5}
                            max={5}
                            step={0.1}
                            value={sampleL}
                            onChange={(e) => setSampleL(parseFloat(e.target.value))}
                            className="w-full h-1 bg-gray-700 rounded appearance-none cursor-pointer"
                        />
                        <span className="text-xs text-white font-mono">{sampleL.toFixed(2)}</span>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">theta (polar)</label>
                        <input
                            type="range"
                            min={0.1}
                            max={Math.PI - 0.1}
                            step={0.1}
                            value={sampleTheta}
                            onChange={(e) => setSampleTheta(parseFloat(e.target.value))}
                            className="w-full h-1 bg-gray-700 rounded appearance-none cursor-pointer"
                        />
                        <span className="text-xs text-white font-mono">{(sampleTheta * 180 / Math.PI).toFixed(1)} deg</span>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 min-h-[200px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'metric' && (
                        <motion.div
                            key="metric"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <div>
                                <h4 className="text-xs font-mono text-gray-400 mb-2">MORRIS-THORNE METRIC</h4>
                                <div className="bg-gray-900/50 rounded p-3 font-mono text-sm">
                                    <div className="text-green-300 mb-2">
                                        ds<sup>2</sup> = -c<sup>2</sup>dt<sup>2</sup> + dl<sup>2</sup> + r(l)<sup>2</sup>(d&#952;<sup>2</sup> + sin<sup>2</sup>&#952; d&#966;<sup>2</sup>)
                                    </div>
                                    <div className="text-blue-300 text-xs mt-2">
                                        r(l) = sqrt(b<sub>0</sub><sup>2</sup> + l<sup>2</sup>) = sqrt({params.throatRadius.toFixed(2)}<sup>2</sup> + l<sup>2</sup>)
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-mono text-gray-400 mb-2">METRIC COMPONENTS at (l={sampleL.toFixed(2)}, &#952;={(sampleTheta * 180 / Math.PI).toFixed(1)} deg)</h4>
                                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                                    <div className="bg-gray-900/50 p-2 rounded">
                                        <span className="text-gray-400">g<sub>tt</sub> = </span>
                                        <span className="text-cyan-300">{metricValues.components.gtt.toFixed(4)}</span>
                                    </div>
                                    <div className="bg-gray-900/50 p-2 rounded">
                                        <span className="text-gray-400">g<sub>ll</sub> = </span>
                                        <span className="text-cyan-300">{metricValues.components.gll.toFixed(4)}</span>
                                    </div>
                                    <div className="bg-gray-900/50 p-2 rounded">
                                        <span className="text-gray-400">g<sub>&#952;&#952;</sub> = </span>
                                        <span className="text-cyan-300">{metricValues.components.gThetaTheta.toFixed(4)}</span>
                                    </div>
                                    <div className="bg-gray-900/50 p-2 rounded">
                                        <span className="text-gray-400">g<sub>&#966;&#966;</sub> = </span>
                                        <span className="text-cyan-300">{metricValues.components.gPhiPhi.toFixed(4)}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-mono text-gray-400 mb-2">CIRCUMFERENTIAL RADIUS</h4>
                                <div className="bg-gray-900/50 rounded p-3 font-mono text-sm">
                                    <span className="text-gray-400">r({sampleL.toFixed(2)}) = </span>
                                    <span className="text-yellow-300">{metricValues.r.toFixed(4)}</span>
                                    <span className="text-gray-500 ml-2">(throat at r = {params.throatRadius.toFixed(2)})</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'geodesic' && (
                        <motion.div
                            key="geodesic"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <div>
                                <h4 className="text-xs font-mono text-gray-400 mb-2">GEODESIC EQUATION</h4>
                                <div className="bg-gray-900/50 rounded p-3 font-mono text-sm text-green-300">
                                    d<sup>2</sup>x<sup>&#956;</sup>/d&#955;<sup>2</sup> + &#915;<sup>&#956;</sup><sub>&#945;&#946;</sub> (dx<sup>&#945;</sup>/d&#955;)(dx<sup>&#946;</sup>/d&#955;) = 0
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    For null geodesics (light rays), &#955; is an affine parameter along the ray path.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xs font-mono text-gray-400 mb-2">CHRISTOFFEL SYMBOLS &#915;<sup>&#956;</sup><sub>&#945;&#946;</sub></h4>
                                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                                    <div className="bg-gray-900/50 p-2 rounded">
                                        <span className="text-gray-400">&#915;<sup>l</sup><sub>&#952;&#952;</sub> = </span>
                                        <span className="text-cyan-300">{metricValues.christoffel.l_thetaTheta.toFixed(4)}</span>
                                    </div>
                                    <div className="bg-gray-900/50 p-2 rounded">
                                        <span className="text-gray-400">&#915;<sup>l</sup><sub>&#966;&#966;</sub> = </span>
                                        <span className="text-cyan-300">{metricValues.christoffel.l_phiPhi.toFixed(4)}</span>
                                    </div>
                                    <div className="bg-gray-900/50 p-2 rounded">
                                        <span className="text-gray-400">&#915;<sup>&#952;</sup><sub>l&#952;</sub> = </span>
                                        <span className="text-cyan-300">{metricValues.christoffel.theta_lTheta.toFixed(4)}</span>
                                    </div>
                                    <div className="bg-gray-900/50 p-2 rounded">
                                        <span className="text-gray-400">&#915;<sup>&#952;</sup><sub>&#966;&#966;</sub> = </span>
                                        <span className="text-cyan-300">{metricValues.christoffel.theta_phiPhi.toFixed(4)}</span>
                                    </div>
                                    <div className="bg-gray-900/50 p-2 rounded">
                                        <span className="text-gray-400">&#915;<sup>&#966;</sup><sub>l&#966;</sub> = </span>
                                        <span className="text-cyan-300">{metricValues.christoffel.phi_lPhi.toFixed(4)}</span>
                                    </div>
                                    <div className="bg-gray-900/50 p-2 rounded">
                                        <span className="text-gray-400">&#915;<sup>&#966;</sup><sub>&#952;&#966;</sub> = </span>
                                        <span className="text-cyan-300">{metricValues.christoffel.phi_thetaPhi.toFixed(4)}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-mono text-gray-400 mb-2">INTEGRATION METHOD</h4>
                                <div className="bg-gray-900/50 rounded p-3 font-mono text-xs text-gray-300">
                                    <p className="mb-1">4th-order Runge-Kutta with adaptive step size</p>
                                    <p className="text-blue-300">Step size scales with r/b<sub>0</sub> near throat</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'lensing' && (
                        <motion.div
                            key="lensing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <div>
                                <h4 className="text-xs font-mono text-gray-400 mb-2">LIGHT DEFLECTION ANGLE</h4>
                                <div className="bg-gray-900/50 rounded p-3 font-mono text-sm">
                                    <div className="text-green-300 mb-2">
                                        &#948;&#966; = 4GM/(c<sup>2</sup>b)
                                    </div>
                                    <div className="text-xs text-gray-300">
                                        For impact parameter b = {lensingValues.impactParam.toFixed(2)}:
                                    </div>
                                    <div className="text-yellow-300 text-lg">
                                        &#948;&#966; = {lensingValues.deflection.toFixed(4)} rad = {(lensingValues.deflection * 180 / Math.PI).toFixed(2)} deg
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-mono text-gray-400 mb-2">EINSTEIN RING</h4>
                                <div className="bg-gray-900/50 rounded p-3 font-mono text-sm">
                                    <div className="text-green-300 mb-2">
                                        &#952;<sub>E</sub> = sqrt(4GM D<sub>LS</sub> / (c<sup>2</sup> D<sub>L</sub> D<sub>S</sub>))
                                    </div>
                                    <div className="text-yellow-300">
                                        &#952;<sub>E</sub> = {lensingValues.einsteinRadius.toFixed(6)} rad
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-mono text-gray-400 mb-2">GRAVITATIONAL REDSHIFT</h4>
                                <div className="bg-gray-900/50 rounded p-3 font-mono text-sm">
                                    <div className="text-green-300 mb-2">
                                        z = sqrt(1 - r<sub>s</sub>/r) - 1
                                    </div>
                                    <div className="text-xs text-gray-300">
                                        At l = {sampleL.toFixed(2)}:
                                    </div>
                                    <div className="text-yellow-300 text-lg">
                                        z = {lensingValues.redshift.toFixed(6)}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {lensingValues.redshift > 0 ? 'Redshifted (wavelength stretched)' : 'Blueshifted (wavelength compressed)'}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-mono text-gray-400 mb-2">MAGNIFICATION</h4>
                                <div className="bg-gray-900/50 rounded p-3 font-mono text-sm">
                                    <div className="text-yellow-300">
                                        &#956; = {lensingValues.magnification.toFixed(2)}x
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        Total magnification from multiple images
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'energy' && (
                        <motion.div
                            key="energy"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <div>
                                <h4 className="text-xs font-mono text-gray-400 mb-2">ENERGY CONDITIONS</h4>
                                <div className="bg-red-900/30 border border-red-500/30 rounded p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-red-400 text-lg">&#9888;</span>
                                        <span className="text-red-300 font-semibold text-sm">Null Energy Condition Violated</span>
                                    </div>
                                    <p className="text-xs text-gray-300 mb-2">
                                        Morris-Thorne wormholes require exotic matter that violates the null energy condition (NEC):
                                    </p>
                                    <div className="bg-gray-900/50 rounded p-2 font-mono text-sm text-green-300">
                                        T<sub>&#956;&#957;</sub> k<sup>&#956;</sup> k<sup>&#957;</sup> {'<'} 0 for some null vector k<sup>&#956;</sup>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-mono text-gray-400 mb-2">STRESS-ENERGY REQUIREMENTS</h4>
                                <div className="bg-gray-900/50 rounded p-3 font-mono text-xs">
                                    <p className="text-gray-300 mb-2">At the throat (l = 0), exotic matter must provide:</p>
                                    <div className="text-yellow-300 mb-1">
                                        &#961; = -1/(8&#960;G b<sub>0</sub><sup>2</sup>) = {(-1 / (8 * Math.PI * params.throatRadius * params.throatRadius)).toExponential(2)}
                                    </div>
                                    <p className="text-gray-400 mt-2">
                                        This negative energy density is required to keep the throat open against gravitational collapse.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-mono text-gray-400 mb-2">EINSTEIN FIELD EQUATIONS</h4>
                                <div className="bg-gray-900/50 rounded p-3 font-mono text-sm text-green-300">
                                    G<sub>&#956;&#957;</sub> = (8&#960;G/c<sup>4</sup>) T<sub>&#956;&#957;</sub>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    The wormhole geometry determines the required stress-energy tensor through Einstein&apos;s equations.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xs font-mono text-gray-400 mb-2">FLARE-OUT CONDITION</h4>
                                <div className="bg-gray-900/50 rounded p-3 font-mono text-xs text-gray-300">
                                    <p className="mb-1">At the throat, the shape function must satisfy:</p>
                                    <div className="text-green-300">b&apos;(r<sub>0</sub>) {'<'} 1</div>
                                    <p className="mt-1 text-gray-400">
                                        This ensures the wormhole &quot;flares out&quot; rather than pinches off.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer with paper references */}
            <div className="p-3 bg-gray-900/30 border-t border-gray-700/50">
                <div className="text-xs text-gray-500 font-mono">
                    Based on: Morris & Thorne (1988), James et al. arXiv:1502.03809
                </div>
            </div>
        </motion.div>
    );
}

/**
 * Compact equation overlay for in-scene display
 */
export function EquationOverlay({ params }: { params: WormholeParams }) {
    const metric = useMemo(() => new MorrisThorneMetric(params), [params]);
    const r0 = metric.circumferentialRadius(0);

    return (
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded p-2 font-mono text-xs text-green-300">
            <div className="opacity-80">
                ds<sup>2</sup> = -dt<sup>2</sup> + dl<sup>2</sup> + r<sup>2</sup>d&#937;<sup>2</sup>
            </div>
            <div className="mt-1 text-cyan-300">
                r<sub>throat</sub> = {r0.toFixed(2)}
            </div>
        </div>
    );
}
