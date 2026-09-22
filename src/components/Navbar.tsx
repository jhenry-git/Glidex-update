import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Car, ChevronDown, MapPin, Compass } from 'lucide-react';

interface NavLocation {
    name: string;
    label: string;
    href: string;
}

const locationsList: NavLocation[] = [
    { name: 'Nairobi', label: 'Car Rental Nairobi', href: '/listings?location=Nairobi' },
    { name: 'Mombasa', label: 'Car Rental Mombasa', href: '/listings?location=Mombasa' },
    { name: 'Kisumu', label: 'Car Rental Kisumu', href: '/listings?location=Kisumu' },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [locationsOpen, setLocationsOpen] = useState(false);
    const [mobileLocationsOpen, setMobileLocationsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Track scroll position for subtle shadow enhancement
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setLocationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const handleLinkClick = () => {
        setMenuOpen(false);
        setLocationsOpen(false);
    };

    return (
        <>
            {/* Top Navigation Bar — Always solid/frosted for guaranteed readability & contrast */}
            <header
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200/80 py-3'
                    : 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-3.5'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    {/* Brand Logo */}
                    <Link to="/" onClick={handleLinkClick} className="flex items-center gap-2.5 z-[101] shrink-0 group">
                        <img
                            src="/logo.png"
                            alt="GlideX Logo"
                            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                            Glide<span className="text-brand-blue">X</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium text-gray-700">
                        <Link
                            to="/"
                            className={`px-3 py-2 rounded-lg transition-colors ${isHomePage
                                ? 'text-brand-blue font-semibold bg-blue-50/60'
                                : 'hover:text-brand-blue hover:bg-gray-50'
                                }`}
                        >
                            Home
                        </Link>

                        <a
                            href={isHomePage ? '#instant' : '/#instant'}
                            className="px-3 py-2 rounded-lg hover:text-brand-blue hover:bg-gray-50 transition-colors"
                        >
                            How It Works
                        </a>

                        {/* Locations Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setLocationsOpen(!locationsOpen)}
                                onMouseEnter={() => setLocationsOpen(true)}
                                className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors ${locationsOpen ? 'text-brand-blue bg-gray-50' : 'hover:text-brand-blue hover:bg-gray-50'
                                    }`}
                                aria-expanded={locationsOpen}
                                aria-haspopup="true"
                            >
                                <span>Locations</span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${locationsOpen ? 'rotate-180 text-brand-blue' : 'text-gray-400'}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {locationsOpen && (
                                <div
                                    onMouseLeave={() => setLocationsOpen(false)}
                                    className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[110] animate-in fade-in slide-in-from-top-2 duration-150"
                                >
                                    <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                                        Major Rental Hubs
                                    </div>
                                    {locationsList.map((loc) => (
                                        <Link
                                            key={loc.name}
                                            to={loc.href}
                                            onClick={handleLinkClick}
                                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-brand-blue transition-colors"
                                        >
                                            <MapPin className="w-4 h-4 text-brand-blue shrink-0" />
                                            <span>{loc.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Browse Cars */}
                        <Link
                            to="/listings"
                            className={`px-3 py-2 rounded-lg transition-colors ${location.pathname === '/listings'
                                ? 'text-brand-blue font-semibold bg-blue-50/60'
                                : 'hover:text-brand-blue hover:bg-gray-50'
                                }`}
                        >
                            Browse Cars
                        </Link>

                        {/* Safaris & Tours (Highlighted with NEW badge) */}
                        <Link
                            to="/safaris"
                            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${location.pathname.startsWith('/safaris') || location.pathname.startsWith('/tours')
                                ? 'text-amber-700 font-semibold bg-amber-50/80 border border-amber-200/60'
                                : 'text-gray-800 hover:text-amber-700 hover:bg-amber-50/50'
                                }`}
                        >
                            <Compass className="w-4 h-4 text-amber-600" />
                            <span>Safaris & Tours</span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-800 border border-amber-400/30">
                                New
                            </span>
                        </Link>

                        <a
                            href={isHomePage ? '#closing' : '/#closing'}
                            className="px-3 py-2 rounded-lg hover:text-brand-blue hover:bg-gray-50 transition-colors"
                        >
                            Contact
                        </a>
                    </nav>

                    {/* Right-hand side Action Buttons */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        {/* Login Link */}
                        <Link
                            to="/login"
                            className="text-sm font-medium text-gray-700 hover:text-brand-blue px-3 py-2 rounded-lg hover:bg-gray-100/80 transition-colors hidden sm:inline-flex"
                        >
                            Login
                        </Link>

                        {/* Primary Book Now CTA */}
                        <Link
                            to="/listings"
                            className="btn-primary text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-sm flex items-center gap-1.5"
                        >
                            <Car className="w-4 h-4" />
                            <span>Book a car</span>
                        </Link>

                        {/* Mobile / Tablet Menu Button */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden relative z-[101] w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors"
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={menuOpen}
                        >
                            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile / Tablet Navigation Overlay */}
            <div
                className={`fixed inset-0 z-[99] md:hidden transition-all duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setMenuOpen(false)}
                />

                {/* Mobile Drawer */}
                <div
                    className={`absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl flex flex-col justify-between pt-20 pb-8 px-6 overflow-y-auto transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className="flex flex-col gap-1.5">
                        <Link
                            to="/"
                            onClick={handleLinkClick}
                            className={`text-base font-semibold py-2.5 px-3 rounded-xl transition-colors ${isHomePage ? 'bg-blue-50 text-brand-blue' : 'text-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            Home
                        </Link>

                        <a
                            href={isHomePage ? '#instant' : '/#instant'}
                            onClick={handleLinkClick}
                            className="text-base font-semibold py-2.5 px-3 rounded-xl text-gray-800 hover:bg-gray-50 transition-colors"
                        >
                            How It Works
                        </a>

                        {/* Mobile Locations Accordion */}
                        <div>
                            <button
                                onClick={() => setMobileLocationsOpen(!mobileLocationsOpen)}
                                className="w-full flex items-center justify-between text-base font-semibold py-2.5 px-3 rounded-xl text-gray-800 hover:bg-gray-50 transition-colors"
                            >
                                <span>Locations</span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileLocationsOpen ? 'rotate-180 text-brand-blue' : 'text-gray-400'}`} />
                            </button>
                            {mobileLocationsOpen && (
                                <div className="pl-4 py-1 flex flex-col gap-1">
                                    {locationsList.map((loc) => (
                                        <Link
                                            key={loc.name}
                                            to={loc.href}
                                            onClick={handleLinkClick}
                                            className="flex items-center gap-2 py-2 px-3 text-sm text-gray-600 hover:text-brand-blue rounded-lg hover:bg-gray-50"
                                        >
                                            <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                                            <span>{loc.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link
                            to="/listings"
                            onClick={handleLinkClick}
                            className="text-base font-semibold py-2.5 px-3 rounded-xl text-gray-800 hover:bg-gray-50 transition-colors"
                        >
                            Browse Cars
                        </Link>

                        {/* Safaris & Tours in mobile menu */}
                        <Link
                            to="/safaris"
                            onClick={handleLinkClick}
                            className="text-base font-semibold py-2.5 px-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/60 flex items-center justify-between transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                <Compass className="w-4 h-4 text-amber-600" />
                                <span>Safaris & Tours</span>
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-white">
                                New
                            </span>
                        </Link>

                        <a
                            href={isHomePage ? '#closing' : '/#closing'}
                            onClick={handleLinkClick}
                            className="text-base font-semibold py-2.5 px-3 rounded-xl text-gray-800 hover:bg-gray-50 transition-colors"
                        >
                            Contact
                        </a>

                        <div className="border-t border-gray-100 my-2 pt-2">
                            <Link
                                to="/login"
                                onClick={handleLinkClick}
                                className="block text-base font-semibold py-2.5 px-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Login to Your Account
                            </Link>
                            <Link
                                to="/dashboard"
                                onClick={handleLinkClick}
                                className="block text-sm text-gray-500 py-1 px-3 hover:text-brand-blue transition-colors"
                            >
                                Host Dashboard
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Book a car CTA */}
                    <div className="pt-4 border-t border-gray-100">
                        <Link
                            to="/listings"
                            onClick={handleLinkClick}
                            className="btn-primary w-full py-3.5 text-center text-sm font-semibold rounded-full shadow-md flex items-center justify-center gap-2"
                        >
                            <Car className="w-4 h-4" />
                            <span>Book a Car Now</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
