import React from 'react';
import { motion } from 'framer-motion';
import { Compass, BookOpen, Map } from 'lucide-react';

const values = [
    {
        title: "Curated by Locals",
        description: "Every listing is more than just a car; it's a vetted story. Our Kenyan hosts share vehicles that know the terrain and the tales.",
        icon: BookOpen,
        color: "text-ochre-600",
        bg: "bg-ochre-50/80",
        border: "border-ochre-200"
    },
    {
        title: "Beyond the GPS",
        description: "Discover hidden routes and local secrets shared directly by our community of hosts. The best destinations aren't always on the map.",
        icon: Compass,
        color: "text-safari-green-600",
        bg: "bg-safari-green-50/80",
        border: "border-safari-green-200"
    },
    {
        title: "Drive the Narrative",
        description: "You aren't just renting a ride. You become the storyteller, weaving your own chapter into the vibrant tapestry of East Africa.",
        icon: Map,
        color: "text-terracotta-600",
        bg: "bg-terracotta-50/80",
        border: "border-terracotta-200"
    }
];

export const EditorialValues: React.FC = () => {
    return (
        <section className="py-32 bg-white relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-sand-50/50 skew-x-12 -mr-32 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

                    {/* Left Typography Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="lg:w-5/12 max-w-xl text-center lg:text-left"
                    >
                        <span className="text-sand-500 font-sans tracking-[0.2em] text-xs uppercase mb-6 block font-medium">
                            Our Philosophy
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-editorial text-sand-950 mb-8 leading-[1.15]">
                            Why We <br className="hidden lg:block" /> Tell <span className="italic text-safari-green-700">Stories</span>
                        </h2>
                        <p className="text-lg text-sand-600 font-light leading-relaxed mb-8">
                            We believe travel is measured not in miles, but in memories. GlideX is built to connect you with the heartbeat of Kenya through the unique perspectives of the people who live it.
                        </p>
                        <div className="h-px w-24 bg-ochre-300 mx-auto lg:mx-0" />
                    </motion.div>

                    {/* Right Editorial Grid */}
                    <div className="lg:w-7/12 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 auto-rows-max">
                        {values.map((item, index) => {
                            const Icon = item.icon;
                            // Offset middle item vertically on larger screens
                            const offsetClass = index === 1 ? 'md:translate-y-12' : '';

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
                                    className={`relative flex flex-col p-8 lg:p-10 bg-white border ${item.border} rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${offsetClass} hover:-translate-y-2 transition-transform duration-500`}
                                >
                                    <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center mb-8`}>
                                        <Icon className={`w-5 h-5 ${item.color}`} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-2xl font-editorial text-sand-900 mb-4">{item.title}</h3>
                                    <p className="text-sand-600 font-light leading-relaxed text-sm lg:text-base">
                                        {item.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};
