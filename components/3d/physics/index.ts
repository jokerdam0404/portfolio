/**
 * Physics Module for Wormhole Visualization
 *
 * This module provides scientifically accurate general relativity calculations
 * for visualizing traversable wormholes based on the Morris-Thorne metric.
 *
 * References:
 * - Morris, M.S. & Thorne, K.S. (1988). "Wormholes in spacetime and their use
 *   for interstellar travel: A tool for teaching general relativity."
 *   American Journal of Physics, 56(5), 395-412.
 *
 * - James, O., von Tunzelmann, E., Franklin, P., & Thorne, K.S. (2015).
 *   "Visualizing Interstellar's Wormhole." American Journal of Physics, 83, 486.
 *   arXiv:1502.03809
 *
 * - James, O., von Tunzelmann, E., Franklin, P., & Thorne, K.S. (2015).
 *   "Gravitational Lensing by Spinning Black Holes in Astrophysics, and in the
 *   Movie Interstellar." Classical and Quantum Gravity, 32(6), 065001.
 *   arXiv:1502.03808
 */

// Core Physics Engine
export {
    CONSTANTS,
    DEFAULT_WORMHOLE_PARAMS,
    MorrisThorneMetric,
    GeodesicIntegrator,
    GravitationalLensing,
    CelestialSphereMapper,
    PhysicsPrecomputation,
    PhysicsValidation,
    type WormholeParams,
    type RayState,
    type CameraParams
} from './PhysicsEngine';

// React Components
export { default as PhysicsWormhole, type PhysicsData } from './PhysicsWormhole';
export { default as PhysicsControls, PhysicsHUD } from './PhysicsControls';
export { default as EquationDisplay, EquationOverlay } from './EquationDisplay';
