'use client';

import Spline from '@splinetool/react-spline';
import { useState } from 'react';
import Image from 'next/image';

interface SplineSceneProps {
    scene: string;
    fallbackImage: string;
    className?: string;
}

export default function SplineScene({ scene, fallbackImage, className }: SplineSceneProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <div className={`relative w-full h-full ${className}`}>
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
                </div>
            )}

            {(hasError) ? (
                <Image
                    src={fallbackImage}
                    alt="Fallback"
                    fill
                    className="object-cover"
                    priority
                />
            ) : (
                <Spline
                    scene={scene}
                    onLoad={() => setIsLoaded(true)}
                    onError={() => setHasError(true)}
                />
            )}
        </div>
    );
}
