import React from 'react';

/**
 * Safety & Insurance FAQ Schema for Kenya Car Rental.
 * Targets trust metrics for tourists: CDW, insurance, breakdowns.
 * Best used on Homepage, FAQ Page, and specific safety policy pages.
 */
export const SafetyFAQSchema: React.FC = () => {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Is insurance included in car rental in Kenya?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most rental cars include basic insurance such as third-party liability coverage. Additional protection like Collision Damage Waiver (CDW) may be offered to reduce liability."
                }
            },
            {
                "@type": "Question",
                "name": "What is CDW insurance?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Collision Damage Waiver (CDW) is an optional level of protection that limits your financial liability right down to the excess amount if the rental car is damaged in an accident."
                }
            },
            {
                "@type": "Question",
                "name": "What happens if the rental car breaks down?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Reputable rental companies provide 24/7 roadside assistance and will repair or replace the vehicle if mechanical issues occur."
                }
            },
            {
                "@type": "Question",
                "name": "What happens if the rental car is damaged?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "If you have an accident, you must contact the rental company immediately. Your liability depends on your insurance coverage (e.g., whether you purchased CDW) and the security deposit withheld."
                }
            },
            {
                "@type": "Question",
                "name": "Who pays traffic fines?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The renter is responsible for any traffic fines or parking tickets incurred during the rental period. These are usually deducted from the security deposit or charged to your payment method."
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
