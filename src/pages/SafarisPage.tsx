import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SafariHero } from '@/components/safaris/SafariHero';
import { SafariPackages } from '@/components/safaris/SafariPackages';
import { SafariFleetSection } from '@/components/safaris/SafariFleetSection';
import { SafariTrustMetrics } from '@/components/safaris/SafariTrustMetrics';
import { SafariEnquiryForm } from '@/components/safaris/SafariEnquiryForm';
import { SafariFAQ } from '@/components/safaris/SafariFAQ';
import { useOgMeta } from '@/hooks/useOgMeta';
import { MessageSquare, Calendar } from 'lucide-react';
import { buildSafariWhatsAppUrl } from '@/api/safariEnquiries';

export default function SafarisPage() {
    const location = useLocation();
    const [selectedPackage, setSelectedPackage] = useState<string | undefined>(undefined);
    const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>(undefined);
    const [showStickyBar, setShowStickyBar] = useState(false);

    // Parse query params on load (e.g. ?package=maasai-mara or ?package=Amboseli)
    useEffect(() => {
        window.scrollTo(0, 0);

        const params = new URLSearchParams(location.search);
        const pkgParam = params.get('package');
        const vehicleParam = params.get('vehicle');

        if (pkgParam) {
            if (pkgParam.toLowerCase().includes('mara')) {
                setSelectedPackage('3-Day Maasai Mara Big Five Expedition');
            } else if (pkgParam.toLowerCase().includes('amboseli')) {
                setSelectedPackage('4-Day Amboseli & Tsavo: Giants Under Kilimanjaro');
            } else if (pkgParam.toLowerCase().includes('samburu')) {
                setSelectedPackage('5-Day Samburu & Ol Pejeta Northern Circuit');
            } else if (pkgParam.toLowerCase().includes('beach')) {
                setSelectedPackage('7-Day Ultimate Bush & Beach: Mara + Diani');
            } else {
                setSelectedPackage(pkgParam);
            }

            // Smooth scroll to enquiry after brief delay for render
            setTimeout(() => {
                const el = document.getElementById('enquiry');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }

        if (vehicleParam) {
            setSelectedVehicle(vehicleParam);
        }
    }, [location.search]);

    // Track scroll for mobile sticky quote button
    useEffect(() => {
        const handleScroll = () => {
            setShowStickyBar(window.scrollY > 450);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const structuredData = useMemo(() => ({
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "TravelAgency",
                "name": "GlideX Safaris & Tours Kenya",
                "url": "https://glidexp.com/safaris",
                "logo": "https://glidexp.com/logo.png",
                "description": "Kenya's premier African safari tour operator and 4x4 safari vehicle rental service.",
                "telephone": "+254768266255",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Nairobi",
                    "addressCountry": "KE"
                },
                "priceRange": "$$$"
            },
            {
                "@type": "TouristTrip",
                "name": "Maasai Mara Big Five Migration Safari",
                "touristType": ["Wildlife Enthusiasts", "Families", "Adventure Travelers"],
                "offers": {
                    "@type": "Offer",
                    "priceCurrency": "USD",
                    "price": "580.00",
                    "availability": "https://schema.org/InStock"
                }
            }
        ]
    }), []);

    useOgMeta({
        title: "African Safaris & 4x4 Car Rentals in Kenya | GlideX Tours",
        description: "Experience the Maasai Mara, Amboseli, and Samburu with GlideX. Handcrafted wildlife safaris bundled with custom 4x4 Safari Land Cruisers and certified guides.",
        url: "https://glidexp.com/safaris",
        image: "https://glidexp.com/ads/safaris/safari_ad_landscape.jpg",
        structuredData
    });

    const scrollToEnquiry = (packageName?: string) => {
        if (packageName) {
            setSelectedPackage(packageName);
        }
        const el = document.getElementById('enquiry');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSelectVehicle = (vehicleName: string) => {
        setSelectedVehicle(vehicleName);
        scrollToEnquiry();
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />

            <main className="flex-grow">
                {/* 1. Hero Section */}
                <SafariHero onOpenEnquiry={scrollToEnquiry} />

                {/* 2. Packages & Itineraries */}
                <SafariPackages onSelectPackage={scrollToEnquiry} />

                {/* 3. 4x4 Fleet & Rental Advantage */}
                <SafariFleetSection onSelectVehicle={handleSelectVehicle} />

                {/* 4. Trust, Stats & Reviews */}
                <SafariTrustMetrics />

                {/* 5. Core Lead Capture / Enquiry Form */}
                <SafariEnquiryForm
                    preselectedPackage={selectedPackage}
                    preselectedVehicle={selectedVehicle}
                />

                {/* 6. Frequently Asked Questions */}
                <SafariFAQ />
            </main>

            <Footer />

            {/* Mobile Sticky Quick-Action Bar (High Conversion for Google Ads on Mobile) */}
            {showStickyBar && (
                <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl flex md:hidden items-center justify-between gap-3 animate-fade-in">
                    <div className="flex-1">
                        <span className="text-xs font-bold text-[#0B0F17] block leading-tight">
                            Kenya Safaris & 4x4 Fleet
                        </span>
                        <span className="text-[11px] text-gray-500 block">
                            Custom quotes in 1-2 hrs
                        </span>
                    </div>

                    <button
                        onClick={() => scrollToEnquiry()}
                        className="px-4 py-2.5 rounded-xl bg-[#D7A04D] text-[#0B0F17] font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Get Quote</span>
                    </button>

                    <a
                        href={buildSafariWhatsAppUrl({ safariPackage: selectedPackage || 'Kenya Safari' })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-[#25D366] text-white shadow-sm active:scale-95 transition-all flex items-center justify-center"
                        aria-label="Chat on WhatsApp"
                    >
                        <MessageSquare className="w-4 h-4" />
                    </a>
                </div>
            )}
        </div>
    );
}
