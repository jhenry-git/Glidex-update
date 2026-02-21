import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Car } from 'lucide-react';

const homeLinks = [
    { label: 'How it works', href: '#instant' },
    { label: 'Hosts', href: '#verified' },
    { label: 'Support', href: '#support' },
    { label: 'Contact', href: '#closing' },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    // Track scroll position for glassmorphism background
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const handleLinkClick = () => setMenuOpen(false);

    return (
        <>
            {/* Desktop + Mobile Top Bar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-[100] px-6 py-4 flex items-center justify-between transition-all duration-300 ${scrolled || !isHomePage ? 'bg-[rgba(244,246,248,0.85)] backdrop-blur-xl shadow-sm' : 'bg-transparent'
                    }`}
            >
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 z-[101]">
                    <img src="/logo.png" alt="GlideX Emblem" className="h-8 w-auto object-contain" />
                    <span className="font-display text-xl font-bold text-[#0B0F17]">GlideX</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {isHomePage &&
                        homeLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-[#0B0F17] hover:text-[#D7A04D] transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    <Link
                        to="/listings"
                        className={`text-sm font-medium transition-colors ${location.pathname === '/listings'
                            ? 'text-[#D7A04D]'
                            : 'text-[#0B0F17] hover:text-[#D7A04D]'
                            }`}
                    >
                        Browse Cars
                    </Link>
                </div>

                {/* Right side: CTA + Hamburger */}
                <div className="flex items-center gap-3">
                    <Link to="/listings" className="btn-primary text-sm hidden sm:inline-flex">
                        <Car className="w-4 h-4 mr-2" />
                        Book a car
                    </Link>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden relative z-[101] w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-[99] md:hidden transition-all duration-400 ${menuOpen
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                    }`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-[rgba(244,246,248,0.97)] backdrop-blur-xl"
                    onClick={() => setMenuOpen(false)}
                />

                {/* Menu Content */}
                <div className="relative z-[1] flex flex-col items-center justify-center h-full gap-2 px-8">
                    {isHomePage &&
                        homeLinks.map((link, i) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={handleLinkClick}
                                className={`text-3xl font-display font-bold text-[#0B0F17] hover:text-[#D7A04D] transition-all duration-300 py-3 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                    }`}
                                style={{ transitionDelay: menuOpen ? `${i * 60 + 100}ms` : '0ms' }}
                            >
                                {link.label}
                            </a>
                        ))}

                    {/* Browse Cars link */}
                    <Link
                        to="/listings"
                        onClick={handleLinkClick}
                        className={`text-3xl font-display font-bold text-[#0B0F17] hover:text-[#D7A04D] transition-all duration-300 py-3 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                            }`}
                        style={{
                            transitionDelay: menuOpen
                                ? `${(isHomePage ? homeLinks.length : 0) * 60 + 100}ms`
                                : '0ms',
                        }}
                    >
                        Browse Cars
                    </Link>

                    {/* Mobile CTA */}
                    <Link
                        to="/listings"
                        onClick={handleLinkClick}
                        className={`btn-primary text-base mt-6 transition-all duration-300 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                            }`}
                        style={{
                            transitionDelay: menuOpen
                                ? `${((isHomePage ? homeLinks.length : 0) + 1) * 60 + 100}ms`
                                : '0ms',
                        }}
                    >
                        Book a car
                    </Link>
                </div>
            </div>
        </>
    );
}
