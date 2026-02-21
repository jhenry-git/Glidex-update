import React from 'react';

/**
 * General FAQ Schema for Kenya Car Rental.
 * Targets informational searches: required docs, minimum age, daily rentals, etc.
 * Best used on Homepage, Listings Page, and FAQ Page.
 */
export const GeneralFAQSchema: React.FC = () => {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What documents do I need to rent a car in Kenya?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You need a valid driving license, a national ID or passport, and sometimes a refundable security deposit depending on the rental company."
                }
            },
            {
                "@type": "Question",
                "name": "What is the minimum age to rent a car in Kenya?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most car rental companies require drivers to be between 21 and 25 years old with at least two years of driving experience."
                }
            },
            {
                "@type": "Question",
                "name": "Can I rent a car for one day in Kenya?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, most car rental companies allow daily rentals with flexible booking durations depending on availability."
                }
            },
            {
                "@type": "Question",
                "name": "Is there a mileage limit when renting a car?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Some rentals offer unlimited mileage while others may have daily limits. Always confirm mileage policies before booking."
                }
            },
            {
                "@type": "Question",
                "name": "Can I add an additional driver?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, additional drivers can usually be added if they meet the same license and age requirements, sometimes for an extra fee."
                }
            },
            {
                "@type": "Question",
                "name": "Do car rental companies offer airport pickup in Kenya?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Many rental companies offer airport pickup and drop-off services at major airports like JKIA for an additional charge."
                }
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
};
