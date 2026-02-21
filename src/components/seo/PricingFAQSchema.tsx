import React from 'react';

/**
 * Pricing FAQ Schema for Kenya Car Rental.
 * Targets high-intent booking keywords: cost, deposit, payment methods.
 * Best used on Homepage, Listings Page, and specific vehicle detail pages.
 */
export const PricingFAQSchema: React.FC = () => {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How much does it cost to rent a car in Kenya?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Car rental prices vary by vehicle type and duration. Economy cars typically start from around KES 3,500 per day while SUVs and luxury vehicles cost more."
                }
            },
            {
                "@type": "Question",
                "name": "Do I need to pay a security deposit?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Many car rental companies require a refundable security deposit to cover damages, traffic fines, or contract violations during the rental period."
                }
            },
            {
                "@type": "Question",
                "name": "What payment methods are accepted for renting a car in Kenya?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most car rental platforms in Kenya accept M-Pesa, major credit/debit cards (Visa, Mastercard), and sometimes bank transfers. Cash is rarely accepted for deposits."
                }
            },
            {
                "@type": "Question",
                "name": "What is included in the rental price?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The standard rental price typically includes the vehicle hire, basic third-party insurance, and routine maintenance. Fuel, tolls, and premium insurance are usually extra."
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
