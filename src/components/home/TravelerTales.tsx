import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote, ShieldCheck, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_TALES = [
    {
        id: 'tale-1',
        author: "Sarah Weaver",
        role: "Photographer & Traveler",
        location: "Lamu Archipelago",
        quote: "The road to Lamu changed how I see travel. It wasn't just about the destination, but the rhythm of the journey.",
        fullStory: "We took the coastal route, windows down, salt in our hair. The Land Cruiser absorbed every bump, making the rugged terrain feel like part of a grander adventure rather than an obstacle. By the time we reached the ferry, I realized the drive itself had been the reset I was looking for.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200",
        carUsed: "Land Cruiser Prado",
        host: {
            name: 'Ochieng',
            title: 'The Coastal Expert',
            rating: 4.8,
            reviews: 215,
            image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=400',
        }
    },
    {
        id: 'tale-2',
        author: "David Kamau",
        role: "Architecture Enthusiast",
        location: "Nairobi Highlands",
        quote: "There's a specific kind of freedom in taking a luxury sedan up winding mountain roads at sunrise.",
        fullStory: "I've always loved the contrast of Nairobi—the bustling city giving way to serene, mist-covered tea farms in under an hour. Driving the Mercedes through those early morning switchbacks, feeling the crisp highland air, felt like being let in on a secret the rest of the world hadn't woken up to yet.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200",
        carUsed: "Mercedes-Benz E-Class",
        host: {
            name: 'Grace Mwangi',
            title: 'The City Executive',
            rating: 4.9,
            reviews: 89,
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
        }
    }
];

export const TravelerTales: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % MOCK_TALES.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + MOCK_TALES.length) % MOCK_TALES.length);
    };

    const currentTale = MOCK_TALES[currentIndex];

    return (
        <section className="bg-brand-black text-white overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

                {/* Left side: Large Portrait Photography */}
                <div className="relative w-full h-[60vh] lg:h-full overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentTale.id}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="absolute inset-0 pointer-events-none"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                            <img
                                src={currentTale.image}
                                alt={currentTale.author}
                                className="w-full h-full object-cover object-top"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Floating Traveler info on image */}
                    <div className="absolute bottom-12 left-8 lg:left-16 z-20">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTale.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <h4 className="text-2xl font-editorial font-medium mb-1">{currentTale.author}</h4>
                                <p className="text-brand-gray-text font-sans text-xs tracking-widest uppercase">{currentTale.role} • {currentTale.location}</p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right side: Magazine Style Typography layout */}
                <div className="flex flex-col justify-center px-8 py-16 lg:p-24 relative lg:min-h-screen">
                    <Quote className="absolute top-12 right-12 lg:top-24 lg:right-24 w-32 h-32 text-white/[0.03] rotate-180 pointer-events-none" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`content-${currentTale.id}`}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="max-w-xl mx-auto lg:mx-0 relative z-10 w-full"
                        >
                            <span className="text-brand-blue font-sans tracking-[0.2em] text-xs uppercase mb-8 block font-medium">
                                Community Spotlight
                            </span>

                            <h2 className="text-headline text-[clamp(28px,4vw,48px)] leading-[1.1] mb-10 text-white">
                                "{currentTale.quote}"
                            </h2>

                            <p className="text-lg text-brand-gray-text font-light leading-relaxed mb-12">
                                {currentTale.fullStory}
                            </p>

                            {/* Integrated Host Info */}
                            <div className="bg-white/5 border border-white/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 backdrop-blur-sm">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img
                                            src={currentTale.host.image}
                                            alt={currentTale.host.name}
                                            className="w-16 h-16 rounded-full object-cover grayscale-[20%]"
                                        />
                                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-brand-black">
                                            <ShieldCheck className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-brand-gray-text uppercase tracking-widest mb-1 font-semibold">Hosted By</span>
                                        <span className="text-white font-editorial text-lg">{currentTale.host.name}</span>
                                        <div className="flex items-center gap-1.5 text-[10px] text-yellow-400 font-sans mt-0.5">
                                            <Star className="w-3 h-3 fill-yellow-400" />
                                            <span>{currentTale.host.rating} ({currentTale.host.reviews} trips)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:items-end">
                                    <span className="text-[10px] text-brand-gray-text uppercase tracking-widest mb-1 font-semibold">Vehicle</span>
                                    <span className="text-white/80 font-sans text-sm">{currentTale.carUsed}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() => navigate('/stories')}
                                    className="text-xs font-sans tracking-widest uppercase text-white hover:text-brand-blue transition-colors border-b border-brand-blue pb-1"
                                >
                                    Read Full Story
                                </button>

                                {/* Navigation Controls */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handlePrev}
                                        className="p-3 rounded-full border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all text-white"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="p-3 rounded-full border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all text-white"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
};
