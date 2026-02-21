import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { FormattedCar } from '@/types';

interface FeaturedStoriesProps {
    cars: FormattedCar[];
}

const MOCK_STORIES = [
    {
        id: 'story-1',
        title: "The Safari Dawn",
        excerpt: "The air was crisp and thick with anticipation. At 5AM in Amboseli, the world is hushed. Then, through the morning mist, a herd of elephants emerged, right beside our path. A moment of pure magic.",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800&h=800",
        readTime: "4 min read",
        location: "Amboseli",
        carIndex: 0
    },
    {
        id: 'story-2',
        title: "Chasing specific Coastal Breezes",
        excerpt: "Leaving the city behind, the highway stretched out like a promise. With the windows down and salt heavy in the air, the rhythmic hum of the tires sang a song of freedom all the way to Diani's white sands.",
        image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=800&h=800",
        readTime: "3 min read",
        location: "Diani Beach",
        carIndex: 1
    },
    {
        id: 'story-3',
        title: "Into the Rift Valley",
        excerpt: "As the sun began its descent, painting the sky in violent hues of violet and gold, we navigated the dramatic escarpment. The Great Rift Valley unfolded below us—a vast, ancient canvas demanding our awe.",
        image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=800&h=800",
        readTime: "5 min read",
        location: "Great Rift Valley",
        carIndex: 2
    }
];

export const FeaturedStories: React.FC<FeaturedStoriesProps> = ({ cars }) => {
    const navigate = useNavigate();

    return (
        <section className="w-full bg-brand-gray-soft pb-32 pt-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-16 md:mb-24 flex justify-between items-end border-b border-brand-gray-border pb-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="text-brand-blue font-sans tracking-[0.15em] text-xs uppercase mb-4 block font-medium">
                        Instant Booking
                    </span>
                    <h2 className="text-headline text-[clamp( ৩২p x,4vw,64px)] text-brand-black leading-[1.1]">
                        Journeys that <br /><span className="text-brand-blue font-display">move</span> you
                    </h2>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    onClick={() => navigate('/listings')}
                    className="hidden md:flex items-center gap-3 text-brand-black font-medium hover:text-brand-blue transition-colors group pb-2"
                >
                    <span className="text-micro font-bold">Browse Kenya Car Inventory</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </div>

            <div className="flex flex-col gap-24 md:gap-40 w-full overflow-x-hidden">
                {MOCK_STORIES.map((story, index) => {
                    const isEven = index % 2 === 0;
                    const car = cars[story.carIndex];
                    const carName = car ? `${car.brand} ${car.model}` : "Premium SUV";

                    return (
                        <div key={story.id} className="relative w-full flex flex-col justify-center">
                            <div className={`max-w-7xl mx-auto px-6 w-full flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center relative gap-8 md:gap-0`}>

                                {/* Circle Image */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, x: isEven ? -50 : 50 }}
                                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className={`w-[85vw] md:w-[48vw] max-w-[600px] aspect-square rounded-full overflow-hidden circle-image z-[2] relative ${isEven ? 'md:-mr-[12%]' : 'md:-ml-[12%]'}`}
                                >
                                    <img src={story.image} alt={story.title} className="w-full h-full object-cover" loading="lazy" />
                                </motion.div>

                                {/* Overlapping Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                                    className="w-[90vw] md:w-[45vw] max-w-[500px] bg-white rounded-[28px] card-shadow z-[3] p-8 md:p-12 flex flex-col justify-center relative mt-[-15%] md:mt-0"
                                >
                                    <div className="mb-6 flex justify-between items-center w-full">
                                        <div className="flex items-center gap-1.5 bg-brand-gray-muted px-3 py-1.5 rounded-full border border-brand-gray-border">
                                            <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                                            <span className="text-micro text-brand-gray-text tracking-wider bg-transparent p-0">{story.location}</span>
                                        </div>
                                        <span className="text-xs text-brand-gray-text font-sans tracking-widest uppercase">{story.readTime}</span>
                                    </div>

                                    <h3 className="text-headline text-[clamp(24px,3vw,40px)] text-brand-black mb-6 leading-tight">
                                        {story.title}
                                    </h3>

                                    <p className="text-brand-gray-text text-lg font-light leading-relaxed mb-10">
                                        {story.excerpt}
                                    </p>

                                    <div className="flex flex-col gap-5 border-t border-brand-gray-border pt-8 mt-auto">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-sans text-brand-gray-text uppercase tracking-widest font-semibold">Featured Vehicle</span>
                                            <span className="text-sm font-sans text-brand-black font-bold">{carName}</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3 mt-2">
                                            <button onClick={() => navigate('/listings')} className="btn-primary flex-1 text-sm py-3.5 px-0 w-full sm:w-auto shadow-sm">
                                                Book Rental Instantly
                                            </button>
                                            <button onClick={() => navigate('/stories')} className="btn-secondary flex-1 text-sm py-3.5 px-0 w-full sm:w-auto">
                                                Read Chapter
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-center mt-16 md:hidden">
                <button
                    onClick={() => navigate('/listings')}
                    className="flex items-center gap-3 text-brand-black font-medium transition-colors group"
                >
                    <span className="text-micro font-bold">Browse Kenya Car Inventory</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </section>
    );
};

