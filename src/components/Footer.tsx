import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, MapPin } from 'lucide-react';

const footerLinks = [
    { label: 'How it works', href: '#instant', isAnchor: true },
    { label: 'Hosts', href: '#verified', isAnchor: true },
    { label: 'Support', href: '#support', isAnchor: true },
    { label: 'Browse Cars', href: '/listings', isAnchor: false },
    { label: 'List your car', href: '#host', isAnchor: true },
];

export default function Footer() {
    return (
        <footer className="relative bg-[#0B0F17] z-[80] border-t border-[rgba(244,246,248,0.08)]">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16">
                {/* Top Row: Logo + Tagline */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-12">
                    {/* Brand */}
                    <div className="max-w-xs">
                        <Link to="/" className="font-display text-2xl font-bold text-[#F4F6F8]">
                            GlideX
                        </Link>
                        <p className="text-sm text-[rgba(244,246,248,0.6)] mt-3 leading-relaxed">
                            Rent, host, and chauffeur cars across Kenya—fast, safe, and simple.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-micro text-[#D7A04D] mb-4">Quick Links</h4>
                        <ul className="flex flex-col gap-2.5">
                            {footerLinks.map((link) => (
                                <li key={link.href}>
                                    {link.isAnchor ? (
                                        <a
                                            href={link.href}
                                            className="text-sm text-[rgba(244,246,248,0.7)] hover:text-[#D7A04D] transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link
                                            to={link.href}
                                            className="text-sm text-[rgba(244,246,248,0.7)] hover:text-[#D7A04D] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-micro text-[#D7A04D] mb-4">Contact</h4>
                        <ul className="flex flex-col gap-3">
                            <li>
                                <a
                                    href="mailto:support@glidexp.com"
                                    className="flex items-center gap-2.5 text-sm text-[rgba(244,246,248,0.7)] hover:text-[#D7A04D] transition-colors"
                                >
                                    <Mail className="w-4 h-4 shrink-0" />
                                    support@glidexp.com
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+254768266255"
                                    className="flex items-center gap-2.5 text-sm text-[rgba(244,246,248,0.7)] hover:text-[#D7A04D] transition-colors"
                                >
                                    <Phone className="w-4 h-4 shrink-0" />
                                    +254 768 266 255
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5 text-sm text-[rgba(244,246,248,0.5)]">
                                <MapPin className="w-4 h-4 shrink-0" />
                                Nairobi, Kenya
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-micro text-[#D7A04D] mb-4">Follow Us</h4>
                        <a
                            href="https://instagram.com/glidex__"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 text-sm text-[rgba(244,246,248,0.7)] hover:text-[#D7A04D] transition-colors"
                        >
                            <Instagram className="w-5 h-5 shrink-0" />
                            @glidex__
                        </a>
                    </div>
                </div>

                {/* Divider + Copyright */}
                <div className="border-t border-[rgba(244,246,248,0.1)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-[rgba(244,246,248,0.4)]">
                        © {new Date().getFullYear()} GlideX. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-xs text-[rgba(244,246,248,0.4)] hover:text-[rgba(244,246,248,0.7)] transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-xs text-[rgba(244,246,248,0.4)] hover:text-[rgba(244,246,248,0.7)] transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
