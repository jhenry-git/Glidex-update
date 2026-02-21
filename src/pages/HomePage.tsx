import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { StoryHero } from '../components/home/StoryHero';
import { FeaturedStories } from '../components/home/FeaturedStories';
import { TrustValueProps } from '../components/home/TrustValueProps';
import { TravelerTales } from '../components/home/TravelerTales';
import { StoryMap } from '../components/home/StoryMap';
import { JourneyGenerator } from '../components/home/JourneyGenerator';
import { StoryFAQ } from '../components/home/StoryFAQ';
import { fetchCars } from '@/api/cars';
import type { FormattedCar } from '@/types';
import { GeneralFAQSchema } from '@/components/seo/GeneralFAQSchema';
import { PricingFAQSchema } from '@/components/seo/PricingFAQSchema';
import { SafetyFAQSchema } from '@/components/seo/SafetyFAQSchema';

export default function HomePage() {
    const [featuredCars, setFeaturedCars] = useState<FormattedCar[]>([]);

    useEffect(() => {
        // Set document title
        document.title = "GlideX – Rent, Host & Chauffeur Cars in Kenya";

        // Fetch top cars for the Featured Fleet section
        fetchCars()
            .then((cars) => {
                setFeaturedCars(cars.slice(0, 3));
            })
            .catch((err) => {
                console.error("Failed to fetch featured cars:", err);
            });

        // Scroll to top on mount
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />

            <main className="flex-grow">
                <GeneralFAQSchema />
                <PricingFAQSchema />
                <SafetyFAQSchema />
                <StoryHero />
                <FeaturedStories cars={featuredCars} />
                <TrustValueProps />
                <TravelerTales />
                <StoryMap />
                <JourneyGenerator />
                <StoryFAQ />
            </main>

            <Footer />
        </div>
    );
}
