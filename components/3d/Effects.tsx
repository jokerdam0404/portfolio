'use client';

import { EffectComposer, Bloom, N8AO, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';

export default function Effects() {
    return (
        <EffectComposer>
            {/* Ambient Occlusion for realistic contact shadows */}
            <N8AO
                aoRadius={0.5}
                intensity={1}
                distanceFalloff={0.5}
                color="#000000"
            />

            {/* Selective bloom for emissive elements */}
            <Bloom
                intensity={0.5}
                luminanceThreshold={0.8}
                luminanceSmoothing={0.9}
                mipmapBlur
            />

            {/* Filmic tone mapping for professional color grading */}
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
    );
}
