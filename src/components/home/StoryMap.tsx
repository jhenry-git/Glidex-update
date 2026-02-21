import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MAP_MARKERS = [
    {
        id: 'mara',
        title: 'Maasai Mara',
        storySnippet: 'The great migration seen from the sun-roof of a Land Cruiser.',
        x: '25%',
        y: '65%',
        image: 'https://images.unsplash.com/photo-1547469447-9dc478cdbc0b?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'nairobi',
        title: 'Nairobi',
        storySnippet: 'Navigating the vibrant city nights in absolute luxury.',
        x: '45%',
        y: '55%',
        image: 'https://images.unsplash.com/photo-1594916383610-85f269a84d43?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'mombasa',
        title: 'Mombasa Coast',
        storySnippet: 'Where the road ends and the ocean breeze takes over.',
        x: '75%',
        y: '80%',
        image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'nanyuki',
        title: 'Nanyuki',
        storySnippet: 'Highland chills perfectly combated with heated leather seats.',
        x: '40%',
        y: '40%',
        image: 'https://images.unsplash.com/photo-1574514578842-88229b4e6ac1?auto=format&fit=crop&q=80&w=600'
    }
];

export const StoryMap: React.FC = () => {
    const [activeMarker, setActiveMarker] = useState<string | null>(null);
    const navigate = useNavigate();

    return (
        <section className="py-32 bg-sand-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Text Column */}
                    <div className="lg:w-1/3 z-20">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Navigation className="w-5 h-5 text-safari-green-600" />
                                <span className="text-sand-500 font-sans tracking-[0.2em] text-xs uppercase font-medium">
                                    Interactive Map
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-editorial text-sand-950 mb-6 leading-tight">
                                Choose Your <br /> <span className="italic text-safari-green-700">Coordinates</span>
                            </h2>

                            <p className="text-lg text-sand-600 font-light leading-relaxed mb-10">
                                Kenya is vast, and every route offers a different narrative. Explore the map to discover stories from across the country, and find the perfect vehicle to write your own chapter.
                            </p>

                            <button
                                onClick={() => navigate('/listings')}
                                className="px-8 py-4 bg-safari-green-700 hover:bg-safari-green-800 text-white font-sans text-sm tracking-widest uppercase transition-colors"
                            >
                                Start Your Journey
                            </button>
                        </motion.div>
                    </div>

                    {/* Map Column */}
                    <div className="lg:w-2/3 relative w-full aspect-square md:aspect-[4/3] bg-sand-200/50 mix-blend-multiply overflow-hidden shadow-inner">
                        {/* Abstract map pattern or image background */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-30 mix-blend-luminosity grayscale" />
                        <div className="absolute inset-0 bg-safari-green-900/10 mix-blend-overlay" />

                        {/* Map Pins */}
                        {MAP_MARKERS.map((marker) => (
                            <div
                                key={marker.id}
                                className="absolute"
                                style={{ left: marker.x, top: marker.y }}
                            >
                                {/* The Pin */}
                                <div
                                    className="relative z-20 -translate-x-1/2 -translate-y-full cursor-pointer group"
                                    onMouseEnter={() => setActiveMarker(marker.id)}
                                    onClick={() => setActiveMarker(marker.id)}
                                >
                                    <div className="absolute w-4 h-4 rounded-full bg-ochre-500/30 animate-ping -translate-x-1/2 -translate-y-1/2 top-full left-1/2" />
                                    <MapPin className="w-8 h-8 text-ochre-600 drop-shadow-lg transform group-hover:scale-110 group-hover:-translate-y-1 transition-all" />
                                </div>

                                {/* The Hover Card */}
                                <AnimatePresence>
                                    {activeMarker === marker.id && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-white shadow-2xl overflow-hidden p-1 flex flex-col"
                                            onMouseLeave={() => setActiveMarker(null)}
                                        >
                                            <div className="h-32 overflow-hidden mb-3">
                                                <img
                                                    src={marker.image}
                                                    alt={marker.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="px-4 pb-4">
                                                <h4 className="font-editorial text-xl text-sand-950 mb-2">{marker.title}</h4>
                                                <p className="text-xs text-sand-500 font-sans leading-relaxed">
                                                    {marker.storySnippet}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};
