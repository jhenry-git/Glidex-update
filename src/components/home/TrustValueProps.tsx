import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Phone, Shield } from 'lucide-react';

const VALUES = [
    {
        id: 'verified',
        title: "Verified Hosts",
        description: "Every host is screened, every car is tracked. Rent with confidence from real people.",
        image: "/verified_circle_car.jpg", // Using placeholders since we don't have the actual App_2 images
        fallbackImage: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800&h=800",
        icon: UserCheck,
        caption: "ID-verified • GPS-tracked • Reviewed",
        cta: "Meet the hosts"
    },
    {
        id: 'support',
        title: "24/7 Support",
        description: "Roadside, in-app chat, or a quick call—our team is here anytime you need us.",
        image: "/support_circle_car.jpg",
        fallbackImage: "https://images.unsplash.com/photo-1521783988139-89397d761dce?auto=format&fit=crop&q=80&w=800&h=800",
        icon: Phone,
        caption: "Typical response: under 5 minutes",
        cta: "Get help"
    },
    {
        id: 'chauffeur',
        title: "Chauffeur Service",
        description: "Prefer to be driven? Book a professional chauffeur for meetings, events, or airport transfers.",
        image: "/chauffeur_circle_car.jpg",
        fallbackImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800&h=800",
        icon: Shield,
        caption: "Airport • Corporate • Events",
        cta: "Book a chauffeur"
    }
];

export const TrustValueProps: React.FC = () => {
    return (
        <section className="w-full bg-white pb-32 pt-16 overflow-hidden">
            <div className="flex flex-col gap-24 md:gap-40 w-full overflow-x-hidden">
                {VALUES.map((value, index) => {
                    const isEven = index % 2 === 0;
                    const Icon = value.icon;

                    return (
                        <div key={value.id} className="relative w-full flex flex-col justify-center">
                            <div className={`max-w-7xl mx-auto px-6 w-full flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center relative gap-8 md:gap-0`}>

                                {/* Circle Image */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, x: isEven ? 50 : -50 }}
                                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className={`w-[85vw] md:w-[48vw] max-w-[600px] aspect-square rounded-full overflow-hidden circle-image z-[2] relative ${isEven ? 'md:-ml-[12%]' : 'md:-mr-[12%]'}`}
                                >
                                    <img
                                        src={value.fallbackImage}
                                        alt={value.title}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>

                                {/* Overlapping Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                                    className="w-[90vw] md:w-[45vw] max-w-[500px] bg-white rounded-[28px] card-shadow z-[3] p-8 md:p-12 flex flex-col justify-center relative mt-[-15%] md:mt-0"
                                >
                                    <h2 className="text-headline text-[clamp( ৩২p x,4vw,64px)] text-brand-black mb-6 leading-[1.1]">
                                        {value.title.split(' ').map((word, i) => (
                                            <React.Fragment key={i}>
                                                {word}
                                                {i === 0 && <br />}
                                            </React.Fragment>
                                        ))}
                                    </h2>

                                    <p className="text-brand-gray-text text-lg leading-relaxed mb-8">
                                        {value.description}
                                    </p>

                                    <div className="flex flex-col gap-6 mt-auto">
                                        <button className="btn-secondary w-fit text-sm">
                                            <Icon className="w-4 h-4 mr-2 inline-block" />
                                            {value.cta}
                                        </button>
                                        <p className="text-micro text-brand-gray-text">{value.caption}</p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
