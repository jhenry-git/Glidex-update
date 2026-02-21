import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const SmartAppBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [os, setOs] = useState<'ios' | 'android' | 'other'>('other');

    useEffect(() => {
        const isDismissed = localStorage.getItem('glidex-app-banner-dismissed');

        // Detect OS
        const userAgent = navigator.userAgent || window.opera;
        let detectedOs: 'ios' | 'android' | 'other' = 'other';

        if (/android/i.test(userAgent)) {
            detectedOs = 'android';
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            detectedOs = 'ios';
        }

        setOs(detectedOs);

        // Only show if it's a mobile device and hasn't been dismissed
        if (!isDismissed && (detectedOs === 'ios' || detectedOs === 'android')) {
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('glidex-app-banner-dismissed', 'true');
    };

    if (!isVisible) return null;

    const storeLink = os === 'ios'
        ? 'https://apps.apple.com/ke/app/glidex/id6751563258'
        : 'https://play.google.com/store/apps/details?id=com.anonymous.GlideX&hl=en';

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-white border-b border-gray-200 shadow-sm flex items-center px-4 py-3 transform transition-transform duration-300 ease-in-out">
            <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 mr-3 flex-shrink-0"
                aria-label="Close"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 bg-brand-blue rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center mr-3 shadow-sm relative">
                <img src="/logo.png" alt="GlideX App Icon" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                <span className="hidden text-white font-bold text-lg leading-none">GX</span>
            </div>

            <div className="flex-1 min-w-0">
                <h4 className="text-[15px] font-semibold text-gray-900 leading-tight truncate">GlideX</h4>
                <p className="text-[13px] text-gray-500 leading-tight truncate">Rent, Host & Chauffeur Cars</p>
                <div className="flex text-[10px] text-yellow-400 mt-0.5">
                    {'★★★★★'.split('').map((star, i) => (
                        <span key={i}>{star}</span>
                    ))}
                    <span className="text-gray-400 ml-1">(4.9)</span>
                </div>
            </div>

            <div className="flex-shrink-0 ml-3">
                <a
                    href={storeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-1.5 min-w-[70px] bg-brand-blue text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition"
                    onClick={(e) => e.stopPropagation()}
                >
                    GET
                </a>
            </div>
        </div>
    );
};
