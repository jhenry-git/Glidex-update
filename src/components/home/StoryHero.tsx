import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SearchBar } from './SearchBar';

export const StoryHero: React.FC = () => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, 200]);
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);

    return (
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-brand-gray-soft pt-20">
            {/* Grain overlay */}
            <div className="grain-overlay" />

            {/* Centralized Circle Video/Image */}
            <motion.div
                style={{ y, opacity }}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-[72vmin] h-[72vmin] z-[2] circle-image shadow-2xl"
            >
                <div className="absolute inset-0 bg-brand-black/10 z-10" />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-105"
                >
                    <source src="/promo.mp4" type="video/mp4" />
                </video>
            </motion.div>

            {/* Typography & Search */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 h-full flex flex-col justify-between py-12 pointer-events-none min-h-[85vh]">

                {/* Headline - top left */}
                <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mt-[5vh] md:mt-[10vh] max-w-3xl pointer-events-auto"
                >
                    <h1 className="text-headline text-[clamp(44px,6vw,96px)] text-brand-black">
                        <span className="block">Drive Your</span>
                        <span className="block text-brand-blue font-display">Story</span>
                        <span className="block text-brand-gray-text">With GlideX</span>
                    </h1>
                </motion.div>

                {/* Subtext and Search - bottom */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-auto mb-[5vh] flex flex-col gap-6 pointer-events-auto w-full"
                >
                    <p className="text-lg md:text-xl text-brand-gray-text max-w-xl font-light leading-relaxed">
                        Rent, host, and chauffeur luxury vehicles across Kenya. Book instantly and hit the road.
                    </p>

                    {/* Search Component */}
                    <div className="w-full max-w-4xl shadow-2xl bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden">
                        <SearchBar />
                    </div>
                </motion.div>

            </div>

            {/* Micro labels */}
            <div className="absolute right-[6vw] top-[15vh] z-10 hidden lg:block">
                <span className="text-micro text-brand-blue">Instant Booking</span>
            </div>
            <div className="absolute left-[6vw] bottom-[4vh] z-10 hidden md:block">
                <span className="text-micro text-brand-gray-text">Nairobi • Mombasa • Kisumu</span>
            </div>
        </section>
    );
};
