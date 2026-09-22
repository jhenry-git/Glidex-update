import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: 'When is the best time to visit Kenya for the Great Migration?',
        answer:
            'The world-famous Great Migration in Maasai Mara reaches its peak between July and October when millions of wildebeest, zebras, and gazelles cross the Mara River. However, Kenya offers phenomenal year-round wildlife viewing: January through March is fantastic for predator sightings and calving season with clear, sunny skies.',
    },
    {
        question: 'Are national park entrance fees and accommodations included?',
        answer:
            'Yes. Our full-package safaris are all-inclusive: covering Maasai Mara, Amboseli, or Samburu park entry fees, full-board accommodation at trusted tented camps or lodges, unlimited game drives in our custom 4x4 cruisers, and professional guide services. We also offer vehicle-only rental options if you have already booked your own lodges.',
    },
    {
        question: 'Can I rent a 4x4 for a self-drive safari without a guide?',
        answer:
            'Yes! GlideX provides self-drive 4x4 Land Cruiser Prados and SUVs for qualified drivers. Every self-drive rental includes comprehensive commercial insurance, unlimited mileage options, GPS tracking, and 24/7 roadside mechanical assistance across Kenya.',
    },
    {
        question: 'What makes GlideX 4x4 Safari Land Cruisers special?',
        answer:
            'Our vehicles are purpose-built for the African savanna: heavy-duty off-road suspension, full hydraulic pop-up roofs allowing 360° unobstructed photography, guaranteed window seats for every traveler, electric cooler boxes for chilled drinks, 220V/USB charging outlets for camera equipment, and UHF two-way radios.',
    },
    {
        question: 'How far in advance should we book our safari?',
        answer:
            'For peak migration months (July to October) and festive seasons (December), we strongly advise booking 2 to 4 months ahead to secure preferred lodges and cruiser allocations. For off-peak months, we can readily confirm safari bookings within 3 to 7 days.',
    },
    {
        question: 'What happens after I submit my enquiry?',
        answer:
            'Our Nairobi-based safari desk will review your dates, preferred parks, and group size. You will receive a detailed PDF itinerary breakdown with transparent pricing and vehicle choices via WhatsApp or email within 1 to 2 business hours.',
    },
];

export const SafariFAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 bg-[#F4F6F8]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B0F17]/5 text-[#0B0F17] text-xs font-semibold uppercase tracking-wider mb-3">
                        <HelpCircle className="w-3.5 h-3.5 text-[#D7A04D]" />
                        Frequently Asked Questions
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0B0F17] tracking-tight mb-3">
                        Planning Your Kenya Safari
                    </h2>
                    <p className="text-base text-gray-600">
                        Everything you need to know about booking safaris, vehicle choices, and park logistics.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden transition-all duration-200"
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors cursor-pointer"
                                    aria-expanded={isOpen}
                                >
                                    <span className="text-base font-bold text-[#0B0F17]">
                                        {faq.question}
                                    </span>
                                    <div
                                        className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                                            isOpen ? 'rotate-180 bg-[#D7A04D]/15 text-[#B8862D]' : 'text-gray-500'
                                        }`}
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </button>

                                {isOpen && (
                                    <div className="px-6 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
