'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const scenes = [
    {
        id: 'space',
        image: '/images/space-soaring.png',
        title: 'Soaring Through',
        subtitle: 'The Unknown',
        progress: [0, 0.33],
    },
    {
        id: 'wormhole',
        image: '/images/wormhole-drop.png',
        title: 'Diving Into',
        subtitle: 'Opportunity',
        progress: [0.33, 0.66],
    },
    {
        id: 'trading',
        image: '/images/trading-floor.png',
        title: 'Precision Capital.',
        subtitle: 'Measured Returns.',
        progress: [0.66, 1],
    },
];

interface SceneProps {
    scene: typeof scenes[0];
    scrollYProgress: any;
}

function SceneLayer({ scene, scrollYProgress }: SceneProps) {
    const opacity = useTransform(
        scrollYProgress,
        [
            scene.progress[0] - 0.1,
            scene.progress[0],
            scene.progress[1],
            scene.progress[1] + 0.1,
        ],
        [0, 1, 1, 0]
    );

    const scale = useTransform(
        scrollYProgress,
        [scene.progress[0], scene.progress[1]],
        [1.2, 1]
    );

    return (
        <motion.div
            style={{ opacity, scale }}
            className="absolute inset-0"
        >
            <Image
                src={scene.image}
                alt={`${scene.title} ${scene.subtitle}`}
                fill
                className="object-cover"
                priority
                quality={90}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        </motion.div>
    );
}

function SceneText({ scene, scrollYProgress }: SceneProps) {
    const textOpacity = useTransform(
        scrollYProgress,
        [
            scene.progress[0],
            scene.progress[0] + 0.05,
            scene.progress[1] - 0.05,
            scene.progress[1],
        ],
        [0, 1, 1, 0]
    );

    const textY = useTransform(
        scrollYProgress,
        [scene.progress[0], scene.progress[1]],
        [50, -50]
    );

    return (
        <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
        >
            <h1 className="text-7xl md:text-9xl font-bold mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
                    {scene.title}
                </span>
            </h1>
            <p className="text-4xl md:text-6xl font-light text-white/90">
                {scene.subtitle}
            </p>
        </motion.div>
    );
}

export default function CinematicHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const [activeScene, setActiveScene] = useState(0);

    useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            const newScene = scenes.findIndex(
                (scene) => latest >= scene.progress[0] && latest < scene.progress[1]
            );
            if (newScene !== -1 && newScene !== activeScene) {
                setActiveScene(newScene);
            }
        });

        return () => unsubscribe();
    }, [scrollYProgress, activeScene]);

    return (
        <div ref={containerRef} className="relative h-[300vh]">
            {/* Sticky viewport */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {scenes.map((scene) => (
                    <SceneLayer
                        key={scene.id}
                        scene={scene}
                        scrollYProgress={scrollYProgress}
                    />
                ))}

                {/* Text overlay */}
                <div className="absolute inset-0 pointer-events-none">
                    {scenes.map((scene) => (
                        <SceneText
                            key={`text-${scene.id}`}
                            scene={scene}
                            scrollYProgress={scrollYProgress}
                        />
                    ))}
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{
                        opacity: scrollYProgress.get() > 0.05 ? 0 : 1,
                        y: 0,
                    }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
                >
                    <motion.div
                        className="flex flex-col items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                    >
                        <motion.span
                            className="text-sm text-white/60 uppercase tracking-widest font-mono"
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Scroll to explore
                        </motion.span>
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{
                                duration: 1.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="w-6 h-10 border-2 border-[#D4AF37]/40 rounded-full flex items-start justify-center p-2 relative overflow-hidden"
                        >
                            <motion.div
                                animate={{ y: [0, 16, 16] }}
                                transition={{
                                    duration: 1.8,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="w-1 h-2 bg-[#D4AF37] rounded-full"
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

