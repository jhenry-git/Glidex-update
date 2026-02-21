/**
 * ListingsPage — Live car marketplace page.
 * Displays all available cars from Supabase with search, filter, and sort.
 */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CarGrid from '@/components/listings/CarGrid';
import SearchFilters from '@/components/listings/SearchFilters';
import { useCars } from '@/hooks/useCars';
import type { FormattedCar } from '@/types';
import { GeneralFAQSchema } from '@/components/seo/GeneralFAQSchema';
import { PricingFAQSchema } from '@/components/seo/PricingFAQSchema';

export default function ListingsPage() {
    const navigate = useNavigate();
    const { cars, loading, filters, setFilters, totalCount, filteredCount } =
        useCars();

    const handleCarClick = (car: FormattedCar) => {
        navigate(`/car/${car.id}`);
    };

    const handleClearFilters = () => {
        setFilters({
            searchQuery: '',
            category: 'All',
            sortType: 'newest',
        });
    };

    return (
        <div className="min-h-screen bg-[#F4F6F8]">
            {/* Grain overlay — consistent with home */}
            <div className="grain-overlay" />

            {/* Navbar */}
            <Navbar />

            {/* Main content */}
            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
                <GeneralFAQSchema />
                <PricingFAQSchema />
                {/* Page header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0B0F17] mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to home
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D7A04D] to-[#B8862D] flex items-center justify-center">
                            <Car className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[#0B0F17] font-display tracking-tight">
                                Available Cars
                            </h1>
                            <p className="text-sm text-gray-500">
                                Browse real cars uploaded by verified hosts across Kenya
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8">
                    <SearchFilters
                        filters={filters}
                        onChange={setFilters}
                        totalCount={totalCount}
                        filteredCount={filteredCount}
                    />
                </div>

                {/* Car Grid */}
                <CarGrid
                    cars={cars}
                    loading={loading}
                    onCarClick={handleCarClick}
                    onClearFilters={handleClearFilters}
                />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
