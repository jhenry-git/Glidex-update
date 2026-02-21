import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { SafetyFAQSchema } from '@/components/seo/SafetyFAQSchema';

const FAQS = [
    {
        question: "What are the requirements to rent a car?",
        answer: "You must be at least 21 years old and possess a valid driver's license (or an international driving permit if visiting Kenya) and a National ID or Passport. A refundable security deposit may also be required depending on the vehicle."
    },
    {
        question: "Is insurance included in the booking?",
        answer: "Yes, all GlideX rentals come with standard comprehensive insurance. Additional premium coverage options are available during checkout for maximum peace of mind."
    },
    {
        question: "Can I get the car delivered to me?",
        answer: "Absolutely! Many of our hosts offer delivery to key locations such as JKIA, SGR stations, and major hotels in Nairobi, Mombasa, and Kisumu. Delivery fees may apply based on distance."
    },
    {
        question: "What happens if the car breaks down?",
        answer: "GlideX provides 24/7 roadside assistance across Kenya. In the rare event of a breakdown, contact our support team immediately, and we will dispatch help or provide a replacement vehicle."
    },
    {
        question: "How do I become a host?",
        answer: "Becoming a host is simple. Create an account, verify your identity, and list your vehicle's details and photos. Once approved by our quality control team, you can start earning instantly!"
    }
];

export const StoryFAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-24 md:py-32 bg-brand-gray-soft relative overflow-hidden">
            <SafetyFAQSchema />
            <div className="max-w-4xl mx-auto px-6 relative z-10">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 md:mb-24 flex flex-col items-center text-center"
                >
                    <span className="text-micro text-brand-gray-text mb-6 block">Support & Guidance</span>
                    <h2 className="text-headline text-[clamp( ৩২p x,4vw,64px)] text-brand-black leading-[1.1]">
                        Clear Answers for <br />
                        <span className="text-brand-blue font-display">Open Roads</span>
                    </h2>
                </motion.div>

                <div className="flex flex-col border-t border-brand-gray-border">
                    {FAQS.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="border-b border-brand-gray-border"
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full py-8 flex items-center justify-between text-left group"
                                >
                                    <h3 className="text-xl md:text-2xl font-editorial font-medium text-brand-black group-hover:text-brand-blue transition-colors pr-8">
                                        {faq.question}
                                    </h3>
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full border border-brand-gray-border flex items-center justify-center group-hover:border-brand-blue transition-colors text-brand-black group-hover:text-brand-blue">
                                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="pb-8 text-brand-gray-text text-lg font-light leading-relaxed max-w-3xl">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-20 text-center"
                >
                    <button className="btn-dark">
                        Contact Support Team
                    </button>
                </motion.div>

            </div>
        </section>
    );
};
