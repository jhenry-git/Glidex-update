import React, { useState, useEffect } from 'react';
import {
    Send,
    CheckCircle2,
    Compass,
    MessageSquare,
    User,
    Loader2,
    Sparkles,
    ShieldCheck
} from 'lucide-react';
import {
    submitSafariEnquiry,
    buildSafariWhatsAppUrl,
    SafariEnquiryPayload
} from '@/api/safariEnquiries';

interface SafariEnquiryFormProps {
    preselectedPackage?: string;
    preselectedVehicle?: string;
}

export const SafariEnquiryForm: React.FC<SafariEnquiryFormProps> = ({
    preselectedPackage,
    preselectedVehicle,
}) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [safariPackage, setSafariPackage] = useState(
        preselectedPackage || '3-Day Maasai Mara Big Five Expedition'
    );
    const [travelDate, setTravelDate] = useState('');
    const [groupSize, setGroupSize] = useState('2 Travelers');
    const [vehiclePreference, setVehiclePreference] = useState(
        preselectedVehicle || 'Custom 4x4 Safari Land Cruiser (Pop-up Roof + Guide)'
    );
    const [notes, setNotes] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submissionId, setSubmissionId] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Sync props when user clicks "Enquire" on a package or vehicle card
    useEffect(() => {
        if (preselectedPackage) {
            setSafariPackage(preselectedPackage);
        }
    }, [preselectedPackage]);

    useEffect(() => {
        if (preselectedVehicle) {
            setVehiclePreference(preselectedVehicle);
        }
    }, [preselectedVehicle]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);

        const payload: SafariEnquiryPayload = {
            fullName,
            email,
            phone,
            safariPackage,
            travelDate,
            groupSize,
            vehiclePreference,
            notes,
        };

        const result = await submitSafariEnquiry(payload);

        if (result.success) {
            setSubmissionId(result.id || 'GLX-' + Math.floor(100000 + Math.random() * 900000));
            setIsSubmitted(true);

            // Optional Google Ads conversion trigger if gtag is installed
            if (typeof window !== 'undefined' && (window as unknown as { gtag?: Function }).gtag) {
                try {
                    (window as unknown as { gtag: Function }).gtag('event', 'conversion', {
                        send_to: 'AW-CONVERSION_ID/SAFARI_ENQUIRY',
                        event_callback: () => {},
                    });
                } catch {
                    // Ignore tracking script errors
                }
            }
        } else {
            setErrorMessage(result.error || 'Unable to submit enquiry. Please try again or WhatsApp us.');
        }

        setIsSubmitting(false);
    };

    const handleWhatsAppDirect = () => {
        const url = buildSafariWhatsAppUrl({
            fullName,
            email,
            phone,
            safariPackage,
            travelDate,
            groupSize,
            vehiclePreference,
            notes,
        });
        window.open(url, '_blank');
    };

    return (
        <section id="enquiry" className="py-20 bg-white relative scroll-mt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D7A04D]/10 text-[#B8862D] text-xs font-semibold uppercase tracking-wider mb-3">
                        <Sparkles className="w-3.5 h-3.5" />
                        Quick Quote & Custom Planning
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0B0F17] tracking-tight mb-3">
                        Plan Your Safari & 4x4 Rental
                    </h2>
                    <p className="text-base text-gray-600 leading-relaxed">
                        Fill out your travel details below. Our Kenya safari team will prepare a customized itinerary and transparent quote within 1-2 hours.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-[#F4F6F8] rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-xl relative overflow-hidden">
                    {/* Decorative accent top bar */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0B0F17] via-[#D7A04D] to-[#0B0F17]" />

                    {isSubmitted ? (
                        /* Success View */
                        <div className="py-10 px-4 text-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#0B0F17] mb-2">
                                Safari Enquiry Received!
                            </h3>

                            <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto mb-4">
                                Thank you, <span className="font-semibold text-[#0B0F17]">{fullName}</span>. Your request for{' '}
                                <span className="font-semibold text-[#0B0F17]">{safariPackage}</span> has been logged with reference #{submissionId}.
                            </p>

                            <div className="p-4 rounded-2xl bg-white border border-gray-200 max-w-md mx-auto mb-8 text-left text-xs sm:text-sm text-gray-700 space-y-1.5">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Package:</span>
                                    <span className="font-medium text-right">{safariPackage}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Vehicle:</span>
                                    <span className="font-medium text-right">{vehiclePreference}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Travel Date:</span>
                                    <span className="font-medium text-right">{travelDate || 'Flexible'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Group Size:</span>
                                    <span className="font-medium text-right">{groupSize}</span>
                                </div>
                            </div>

                            {/* WhatsApp Fast-Track Button */}
                            <div className="max-w-md mx-auto space-y-3">
                                <button
                                    onClick={handleWhatsAppDirect}
                                    className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    <span>Fast-Track on WhatsApp Now</span>
                                </button>
                                <p className="text-xs text-gray-500">
                                    Opens a direct chat with our safari desk with your quote details pre-filled.
                                </p>

                                <button
                                    onClick={() => {
                                        setIsSubmitted(false);
                                        setNotes('');
                                    }}
                                    className="mt-4 text-xs text-gray-500 hover:text-[#0B0F17] underline font-medium"
                                >
                                    Submit another enquiry
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Lead Capture Form */
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {errorMessage && (
                                <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
                                    {errorMessage}
                                </div>
                            )}

                            {/* Contact Details Group */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-[#D7A04D]" />
                                    1. Your Contact Details
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="fullName" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Full Name *
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="fullName"
                                                name="name"
                                                type="text"
                                                required
                                                autoComplete="name"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="e.g. Sarah Jenkins"
                                                className="w-full px-3.5 py-3 rounded-xl border border-gray-300 bg-white text-[#0B0F17] text-sm focus:ring-2 focus:ring-[#D7A04D] focus:border-transparent outline-none transition"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Email Address *
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                autoComplete="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="sarah@example.com"
                                                className="w-full px-3.5 py-3 rounded-xl border border-gray-300 bg-white text-[#0B0F17] text-sm focus:ring-2 focus:ring-[#D7A04D] focus:border-transparent outline-none transition"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Phone / WhatsApp *
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="phone"
                                                name="tel"
                                                type="tel"
                                                required
                                                autoComplete="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="+254 7... / +1..."
                                                className="w-full px-3.5 py-3 rounded-xl border border-gray-300 bg-white text-[#0B0F17] text-sm focus:ring-2 focus:ring-[#D7A04D] focus:border-transparent outline-none transition"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trip Details Group */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                                    <Compass className="w-3.5 h-3.5 text-[#D7A04D]" />
                                    2. Safari & Vehicle Preferences
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="safariPackage" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Safari Destination / Package
                                        </label>
                                        <select
                                            id="safariPackage"
                                            value={safariPackage}
                                            onChange={(e) => setSafariPackage(e.target.value)}
                                            className="w-full px-3.5 py-3 rounded-xl border border-gray-300 bg-white text-[#0B0F17] text-sm focus:ring-2 focus:ring-[#D7A04D] focus:border-transparent outline-none transition cursor-pointer"
                                        >
                                            <option value="3-Day Maasai Mara Big Five Expedition">
                                                3-Day Maasai Mara Big Five Expedition
                                            </option>
                                            <option value="4-Day Amboseli & Tsavo: Giants Under Kilimanjaro">
                                                4-Day Amboseli & Tsavo Giants
                                            </option>
                                            <option value="5-Day Samburu & Ol Pejeta Northern Circuit">
                                                5-Day Samburu & Ol Pejeta
                                            </option>
                                            <option value="7-Day Ultimate Bush & Beach: Mara + Diani">
                                                7-Day Ultimate Bush & Beach (Mara + Diani)
                                            </option>
                                            <option value="Custom Tailored Safari Expedition">
                                                Custom / Tailor-Made Safari Circuit
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="vehiclePreference" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Vehicle & Guide Preference
                                        </label>
                                        <select
                                            id="vehiclePreference"
                                            value={vehiclePreference}
                                            onChange={(e) => setVehiclePreference(e.target.value)}
                                            className="w-full px-3.5 py-3 rounded-xl border border-gray-300 bg-white text-[#0B0F17] text-sm focus:ring-2 focus:ring-[#D7A04D] focus:border-transparent outline-none transition cursor-pointer"
                                        >
                                            <option value="Custom 4x4 Safari Land Cruiser (Pop-up Roof + Guide)">
                                                4x4 Safari Land Cruiser (Pop-up Roof + Driver Guide)
                                            </option>
                                            <option value="Toyota Land Cruiser Prado 4x4 (Self-Drive)">
                                                Toyota Land Cruiser Prado 4x4 (Self-Drive)
                                            </option>
                                            <option value="Toyota Land Cruiser Prado 4x4 (Chauffeured)">
                                                Toyota Land Cruiser Prado 4x4 (Chauffeured)
                                            </option>
                                            <option value="Safari Minivan (Custom Tour Van + Guide)">
                                                Safari Minivan (Tour Van + Driver Guide)
                                            </option>
                                            <option value="Safari Package Only (No Rental Car Needed)">
                                                Safari Package Only (Own Transportation)
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Dates & Travelers */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="travelDate" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                        Estimated Travel Date or Month
                                    </label>
                                    <input
                                        id="travelDate"
                                        type="text"
                                        value={travelDate}
                                        onChange={(e) => setTravelDate(e.target.value)}
                                        placeholder="e.g. Mid-August 2025 or Oct 12"
                                        className="w-full px-3.5 py-3 rounded-xl border border-gray-300 bg-white text-[#0B0F17] text-sm focus:ring-2 focus:ring-[#D7A04D] focus:border-transparent outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="groupSize" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                        Travelers / Group Size
                                    </label>
                                    <select
                                        id="groupSize"
                                        value={groupSize}
                                        onChange={(e) => setGroupSize(e.target.value)}
                                        className="w-full px-3.5 py-3 rounded-xl border border-gray-300 bg-white text-[#0B0F17] text-sm focus:ring-2 focus:ring-[#D7A04D] focus:border-transparent outline-none transition cursor-pointer"
                                    >
                                        <option value="Solo Traveler">Solo Traveler (1 person)</option>
                                        <option value="Couple (2 Adults)">Couple (2 Adults)</option>
                                        <option value="Small Group (3-4 Persons)">Small Group (3 - 4 persons)</option>
                                        <option value="Family (2 Adults + Kids)">Family (2 Adults + Children)</option>
                                        <option value="Large Group (5+ Persons)">Large Group (5+ persons)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Special Requests */}
                            <div>
                                <label htmlFor="notes" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Special Requests or Questions (Optional)
                                </label>
                                <textarea
                                    id="notes"
                                    rows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Tell us if you prefer luxury lodges vs mid-range tented camps, balloon safari add-ons, dietary needs, or specific pickup locations (JKIA airport, Nairobi hotel, etc.)."
                                    className="w-full px-3.5 py-3 rounded-xl border border-gray-300 bg-white text-[#0B0F17] text-sm focus:ring-2 focus:ring-[#D7A04D] focus:border-transparent outline-none transition resize-none"
                                />
                            </div>

                            {/* Submit & Dual-Action Buttons */}
                            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:flex-1 py-4 px-8 rounded-xl bg-gradient-to-r from-[#D7A04D] to-[#B8862D] text-[#0B0F17] font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Submitting Enquiry...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span>Request Free Custom Quote</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleWhatsAppDirect}
                                    className="w-full sm:w-auto py-4 px-6 rounded-xl bg-white border border-gray-300 hover:border-gray-400 text-gray-800 font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                                >
                                    <MessageSquare className="w-4 h-4 text-[#25D366]" />
                                    <span>Or Chat on WhatsApp</span>
                                </button>
                            </div>

                            <p className="text-center text-xs text-gray-500 pt-2 flex items-center justify-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#D7A04D]" />
                                No upfront payment required. Your information is 100% private and protected.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};
