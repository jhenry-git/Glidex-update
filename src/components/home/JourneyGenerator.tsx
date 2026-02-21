import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type QuizState = 'start' | 'q1' | 'q2' | 'result';

interface DestinationResult {
    route: string;
    description: string;
    carType: string;
    image: string;
}

export const JourneyGenerator: React.FC = () => {
    const [quizState, setQuizState] = useState<QuizState>('start');
    const [vibe, setVibe] = useState<string>('');
    const [companion, setCompanion] = useState<string>('');
    const navigate = useNavigate();

    const handleStart = () => setQuizState('q1');

    const handleQ1Select = (selectedVibe: string) => {
        setVibe(selectedVibe);
        setQuizState('q2');
    };

    const handleQ2Select = (selectedCompanion: string) => {
        setCompanion(selectedCompanion);
        setQuizState('result');
    };

    const resetQuiz = () => {
        setVibe('');
        setCompanion('');
        setQuizState('start');
    };

    // Very simple logic to determine result
    const getResult = (): DestinationResult => {
        if (vibe === 'wild' && companion === 'group') {
            return {
                route: 'The Great Migration Circuit',
                description: 'A bumpy, thrilling off-road expedition across the Maasai Mara ecosystem.',
                carType: '7-Seater 4x4 Safari Cruiser',
                image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800'
            };
        }
        if (vibe === 'relax' && companion === 'solo') {
            return {
                route: 'Coastal Escape to Kilifi',
                description: 'A smooth highway cruise down to the serene, white-sand beaches of the North Coast.',
                carType: 'Premium Luxury Sedan',
                image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=800'
            };
        }
        if (vibe === 'culture' && companion === 'partner') {
            return {
                route: 'Nairobi Art & Culinary Tour',
                description: 'Navigating the vibrant city streets to uncover hidden galleries and premier dining spots.',
                carType: 'Sleek Executive SUV',
                image: 'https://images.unsplash.com/photo-1594916383610-85f269a84d43?auto=format&fit=crop&q=80&w=800'
            };
        }
        // Fallback
        return {
            route: 'The Rift Valley Escarpment',
            description: 'A breathtaking drive overlooking the floor of the Great Rift, perfect for dramatic sunsets.',
            carType: 'Capable Premium Crossover',
            image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=800'
        };
    };

    return (
        <section className="py-32 bg-[#0a0a09] relative overflow-hidden flex items-center min-h-[80vh]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20 sepia-[.3] mix-blend-luminosity" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a09] via-transparent to-[#0a0a09]" />

            <div className="max-w-4xl mx-auto px-6 relative z-10 w-full text-center">
                <AnimatePresence mode="wait">

                    {/* START STATE */}
                    {quizState === 'start' && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-2xl mx-auto"
                        >
                            <span className="text-ochre-500 font-sans tracking-[0.2em] text-sm uppercase mb-6 block font-medium">
                                Journey Generator
                            </span>
                            <h2 className="text-5xl md:text-7xl font-editorial text-sand-50 mb-8 leading-[1.1]">
                                What story will you <span className="italic text-ochre-400">write?</span>
                            </h2>
                            <p className="text-xl text-sand-300 font-light mb-12">
                                Not sure where the road should take you? Answer two quick questions and let us script your perfect Kenyan adventure.
                            </p>
                            <button
                                onClick={handleStart}
                                className="px-10 py-4 bg-ochre-600 hover:bg-ochre-700 text-white font-sans text-sm tracking-widest uppercase transition-colors"
                            >
                                Begin the Prologue
                            </button>
                        </motion.div>
                    )}

                    {/* QUESTION 1 */}
                    {quizState === 'q1' && (
                        <motion.div
                            key="q1"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-3xl mx-auto"
                        >
                            <h3 className="text-3xl md:text-5xl font-editorial text-sand-50 mb-12">
                                What is the tone of this chapter?
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { id: 'wild', label: 'Wild & Untamed', desc: 'Dust, wildlife, and off-road thrills' },
                                    { id: 'relax', label: 'Coastal Serenity', desc: 'Ocean breezes and smooth highways' },
                                    { id: 'culture', label: 'Urban Pulse', desc: 'City lights and modern luxury' }
                                ].map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleQ1Select(option.id)}
                                        className="p-8 border border-white/10 hover:border-ochre-500 hover:bg-white/5 transition-all text-left flex flex-col group"
                                    >
                                        <span className="text-xl font-editorial text-sand-100 group-hover:text-ochre-400 mb-3 block">
                                            {option.label}
                                        </span>
                                        <span className="text-sm text-sand-400 font-sans font-light">
                                            {option.desc}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* QUESTION 2 */}
                    {quizState === 'q2' && (
                        <motion.div
                            key="q2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-3xl mx-auto"
                        >
                            <h3 className="text-3xl md:text-5xl font-editorial text-sand-50 mb-12">
                                Who are the supporting characters?
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { id: 'solo', label: 'A Solo Journey', desc: 'Just me and the open road' },
                                    { id: 'partner', label: 'A Duo Adventure', desc: 'Traveling with my partner in crime' },
                                    { id: 'group', label: 'The Ensemble Cast', desc: 'Family or friends, the more the merrier' }
                                ].map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleQ2Select(option.id)}
                                        className="p-8 border border-white/10 hover:border-safari-green-500 hover:bg-white/5 transition-all text-left flex flex-col group"
                                    >
                                        <span className="text-xl font-editorial text-sand-100 group-hover:text-safari-green-400 mb-3 block">
                                            {option.label}
                                        </span>
                                        <span className="text-sm text-sand-400 font-sans font-light">
                                            {option.desc}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* RESULT */}
                    {quizState === 'result' && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white/5 p-8 md:p-12 border border-white/10 backdrop-blur-md max-w-4xl mx-auto flex flex-col md:flex-row text-left gap-10 items-center"
                        >
                            <div className="w-full md:w-1/2">
                                <span className="text-safari-green-400 font-sans tracking-[0.2em] text-xs uppercase mb-4 block font-medium">
                                    Your Suggested Journey
                                </span>
                                <h3 className="text-3xl md:text-4xl font-editorial text-sand-50 mb-4 leading-tight">
                                    {getResult().route}
                                </h3>
                                <p className="text-sand-300 font-light mb-8 leading-relaxed">
                                    {getResult().description}
                                </p>

                                <div className="bg-black/40 p-5 border-l-2 border-ochre-500 mb-8">
                                    <span className="block text-xs text-sand-500 uppercase tracking-wider mb-1">Recommended Mount</span>
                                    <span className="text-lg text-sand-100 font-medium">{getResult().carType}</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => navigate('/search')}
                                        className="px-6 py-3 bg-white text-black font-sans text-sm tracking-widest uppercase hover:bg-sand-200 transition-colors flex items-center gap-2"
                                    >
                                        Find Vehicles <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={resetQuiz}
                                        className="p-3 text-sand-400 hover:text-white transition-colors"
                                        title="Retake Quiz"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 aspect-square md:aspect-[4/5] overflow-hidden">
                                <img
                                    src={getResult().image}
                                    alt="Journey suggestion"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </section>
    );
};
