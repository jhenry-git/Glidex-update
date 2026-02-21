import React from 'react';
import { MapPin, Calendar, Car, Search } from 'lucide-react';

export const SearchBar: React.FC = () => {
    return (
        <div className="w-full bg-white border border-brand-gray-border p-2 md:p-3">
            <div className="flex flex-col md:flex-row gap-2 items-center">
                {/* Location */}
                <div className="flex-1 w-full bg-brand-gray-muted hover:bg-brand-gray-soft transition-colors p-3 flex items-center gap-3">
                    <MapPin className="text-brand-blue w-5 h-5 flex-shrink-0" />
                    <div className="flex flex-col w-full">
                        <span className="text-[10px] font-sans text-brand-gray-text uppercase tracking-widest font-semibold mb-1">Local</span>
                        <input
                            type="text"
                            placeholder="Nairobi, Mombasa..."
                            className="bg-transparent border-none outline-none text-brand-charcoal placeholder:text-brand-gray-text font-medium w-full text-sm"
                        />
                    </div>
                </div>

                {/* Dates */}
                <div className="flex-1 w-full bg-brand-gray-muted hover:bg-brand-gray-soft transition-colors p-3 flex items-center gap-3">
                    <Calendar className="text-brand-blue w-5 h-5 flex-shrink-0" />
                    <div className="flex flex-col w-full">
                        <span className="text-[10px] font-sans text-brand-gray-text uppercase tracking-widest font-semibold mb-1">When</span>
                        <input
                            type="text"
                            placeholder="Pick up - Drop off"
                            className="bg-transparent border-none outline-none text-brand-charcoal placeholder:text-brand-gray-text font-medium w-full text-sm"
                        />
                    </div>
                </div>

                {/* Car Type */}
                <div className="flex-1 w-full bg-brand-gray-muted hover:bg-brand-gray-soft transition-colors p-3 flex items-center gap-3">
                    <Car className="text-brand-blue w-5 h-5 flex-shrink-0" />
                    <div className="flex flex-col w-full">
                        <span className="text-[10px] font-sans text-brand-gray-text uppercase tracking-widest font-semibold mb-1">Vehicle</span>
                        <select className="bg-transparent border-none outline-none text-brand-charcoal font-medium w-full cursor-pointer appearance-none text-sm">
                            <option value="">All Types</option>
                            <option value="suv">4x4 SUV</option>
                            <option value="sedan">Luxury Sedan</option>
                            <option value="van">Chauffeur Van</option>
                        </select>
                    </div>
                </div>

                {/* Search Button */}
                <button
                    className="w-full md:w-auto h-full min-h-[56px] px-8 bg-brand-blue hover:bg-brand-blue-hover text-white font-sans text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300"
                >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                </button>
            </div>
        </div>
    );
};
