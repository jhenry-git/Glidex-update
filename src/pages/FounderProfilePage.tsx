import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOgMeta } from '@/hooks/useOgMeta';
import {
  Printer,
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Compass,
  Target,
  Layers,
  Phone,
  Mail,
  Globe,
  MapPin,
  CheckCircle2,
  Quote,
} from 'lucide-react';

export default function FounderProfilePage() {
  useOgMeta({
    title: 'Founder Profile - Joseph Henry | GlideX',
    description: 'Executive briefing and professional profile of Joseph Henry, Founder of GlideX.',
    url: 'https://glidexp.com/founder',
    image: 'https://glidexp.com/founder.png',
  });

  useEffect(() => {
    // Hide floating chat widget container completely on founder document page
    const container = document.getElementById('chat-widget-container');
    const prevDisplay = container ? container.style.display : '';
    if (container) {
      container.style.display = 'none';
    }

    return () => {
      if (container) {
        container.style.display = prevDisplay;
      }
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const capabilities = [
    {
      title: 'Technology and Product Development',
      desc: 'Full-cycle digital product architecture, mobile and web application engineering, and clean deployment.',
    },
    {
      title: 'Entrepreneurship',
      desc: 'Hands-on venture creation, lean capital allocation, bootstrap operations, and operational leadership.',
    },
    {
      title: 'Business Strategy',
      desc: 'Market assessment, transparent unit economics modeling, revenue mapping, and sustainable growth.',
    },
    {
      title: 'Digital Platforms',
      desc: 'Two-sided mobility marketplace architecture, user verification flows, and digital transaction workflows.',
    },
    {
      title: 'Market Development',
      desc: 'Practical knowledge of East African transport dynamics, host community engagement, and regional adoption.',
    },
    {
      title: 'Problem Solving',
      desc: 'Systematic resolution of operational friction, data-driven optimization, and platform reliability.',
    },
    {
      title: 'Innovation',
      desc: 'Transforming fragmented regional asset access into structured, trusted digital marketplaces.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#0B0F17] font-sans antialiased py-6 sm:py-10 px-4 sm:px-6 print:p-0 print:bg-white">
      {/* Print Specific Global Styles */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 14mm 12mm 14mm;
          }
          html, body {
            background-color: #ffffff !important;
            color: #0B0F17 !important;
            font-size: 10.5pt !important;
            line-height: 1.45 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-hidden,
          #chat-widget-container,
          #chat-widget,
          #chat-toggle,
          #handoff-button,
          .chat-widget,
          nav,
          footer,
          aside,
          .grain-overlay {
            display: none !important;
          }
          .print-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .print-break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .print-break-before {
            break-before: page !important;
            page-break-before: always !important;
          }
          a {
            text-decoration: none !important;
            color: inherit !important;
          }
        }
      `}</style>

      {/* Screen-Only Action & Navigation Bar */}
      <aside aria-label="Profile actions" className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 print-hidden bg-white px-5 py-3.5 rounded-2xl shadow-sm border border-slate-200">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-[#D7A04D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to GlideX
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-xs font-mono tracking-wider uppercase text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Startup Incubation &amp; Investor Briefing
          </span>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B0F17] hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Printer className="w-4 h-4 text-[#D7A04D]" />
            Print / Export PDF
          </button>
        </div>
      </aside>

      {/* Main Standalone Document Container */}
      <main className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-slate-200/90 p-8 sm:p-12 print-card">
        {/* Document Header with Institutional Branding */}
        <header className="border-b border-slate-200 pb-6 mb-8 flex flex-wrap items-center justify-between gap-4 print-break-inside-avoid">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="GlideX"
              className="h-9 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-[#0B0F17] block">
                GlideX
              </span>
              <span className="text-xs text-slate-500 tracking-wider uppercase font-mono block">
                Mobility Marketplace Platform
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#D7A04D] font-semibold block">
              Executive Dossier
            </span>
            <span className="text-xs text-slate-500 block">
              Founder Profile &amp; Background
            </span>
          </div>
        </header>

        {/* 1. Founder Overview */}
        <section className="mb-10 print-break-inside-avoid">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 bg-slate-50/70 p-6 sm:p-7 rounded-2xl border border-slate-100">
            {/* Founder Photograph */}
            <div className="relative shrink-0">
              <div className="w-36 h-44 sm:w-40 sm:h-48 rounded-xl overflow-hidden shadow-sm border-2 border-[#D7A04D] bg-slate-200">
                <img
                  src="/founder.png"
                  alt="Joseph Henry, Founder of GlideX"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#0B0F17] text-[#D7A04D] text-[10px] font-mono uppercase px-2 py-0.5 rounded shadow-sm border border-slate-700">
                Founder
              </div>
            </div>

            {/* Overview Details */}
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-block text-xs font-mono uppercase tracking-wider text-[#D7A04D] font-semibold mb-1">
                Founder Overview
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#0B0F17] tracking-tight">
                Joseph Henry
              </h1>
              <p className="text-sm font-semibold text-slate-600 mt-0.5 mb-3">
                Founder, GlideX
              </p>

              <p className="text-sm text-slate-700 leading-relaxed max-w-xl">
                Technology entrepreneur directing the product architecture, strategic vision, and operations of GlideX. Focused on converting underutilized mobility assets into structured economic opportunities across East Africa.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-600 block uppercase font-mono text-[10px]">Location</span>
                  <span className="font-medium text-[#0B0F17]">Nairobi, Kenya</span>
                </div>
                <div>
                  <span className="text-slate-600 block uppercase font-mono text-[10px]">Academic Discipline</span>
                  <span className="font-medium text-[#0B0F17]">Actuarial Science</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-600 block uppercase font-mono text-[10px]">Focus Area</span>
                  <span className="font-medium text-[#0B0F17]">Digital Mobility</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Professional Profile */}
        <section className="mb-10 print-break-inside-avoid">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-4 h-4 text-[#D7A04D]" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#D7A04D] font-bold">
              2. Professional Profile
            </h2>
          </div>
          <div className="text-sm text-slate-700 leading-relaxed space-y-3 bg-white">
            <p>
              Joseph Henry is a technology entrepreneur and product builder with academic training in actuarial science and mathematical modeling. He combines quantitative analysis with full-lifecycle software development, specializing in identifying operational bottlenecks within regional commerce and designing scalable digital solutions.
            </p>
            <p>
              His work centers on building software products from the ground up, directing platform architecture, and shaping digital services adapted to local user behaviors. GlideX was created to address a clear market inefficiency: the persistent disconnect between idle, underutilized private vehicles and the growing demand for dependable, flexible vehicle access.
            </p>
          </div>
        </section>

        {/* 3. Education */}
        <section className="mb-10 print-break-inside-avoid">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-4 h-4 text-[#D7A04D]" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#D7A04D] font-bold">
              3. Education
            </h2>
          </div>
          <div className="bg-slate-50/80 rounded-xl p-4 sm:p-5 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#0B0F17]">
                Bachelor's Degree in Actuarial Science
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Southeastern Kenya University
              </p>
            </div>
            <div className="sm:text-right">
              <span className="inline-block text-xs font-mono bg-white px-3 py-1 rounded-md border border-slate-200 text-slate-700">
                Graduated: 2017
              </span>
            </div>
          </div>
        </section>

        {/* 4. Entrepreneurial Experience */}
        <section className="mb-10 print-break-inside-avoid">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="w-4 h-4 text-[#D7A04D]" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#D7A04D] font-bold">
              4. Entrepreneurial Experience
            </h2>
          </div>
          <div className="text-sm text-slate-700 leading-relaxed mb-4">
            Relevant experience building and deploying technology platforms and operating digital businesses from the ground up:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="font-bold text-[#0B0F17] block mb-1">
                Product Development
              </span>
              <p className="text-slate-600 leading-relaxed">
                Directing end-to-end product lifecycles, user journeys, software release cycles, and functional prototypes based on direct user feedback.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="font-bold text-[#0B0F17] block mb-1">
                Technology Architecture
              </span>
              <p className="text-slate-600 leading-relaxed">
                Hands-on execution across mobile applications, web platforms, relational databases, cloud infrastructure, and real-time transaction protocols.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="font-bold text-[#0B0F17] block mb-1">
                Digital Platforms &amp; Marketplaces
              </span>
              <p className="text-slate-600 leading-relaxed">
                Structuring two-sided digital marketplace mechanics that connect vehicle owners with verified drivers, managing listings, bookings, and digital agreements.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="font-bold text-[#0B0F17] block mb-1">
                Entrepreneurship &amp; Operations
              </span>
              <p className="text-slate-600 leading-relaxed">
                Leading lean team operations, capital allocation, partner relations, and disciplined execution with limited initial resources.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="font-bold text-[#0B0F17] block mb-1">
                Problem Solving
              </span>
              <p className="text-slate-600 leading-relaxed">
                Translating fragmented offline car hire practices into dependable digital verification, standardized agreements, and clear accountability.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="font-bold text-[#0B0F17] block mb-1">
                Understanding African Markets
              </span>
              <p className="text-slate-600 leading-relaxed">
                Designing platform features tailored for local infrastructure realities, mobile payment integration, user trust thresholds, and regional transport habits.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Why GlideX */}
        <section className="mb-10 print-break-inside-avoid print-break-before">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-[#D7A04D]" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#D7A04D] font-bold">
              5. Why GlideX
            </h2>
          </div>
          <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 text-sm text-slate-700 leading-relaxed space-y-3">
            <p>
              In Kenya and across urban African centers, motor vehicles represent one of the most substantial personal capital investments, yet most privately owned cars sit idle for the majority of the week. Vehicle owners absorb continuous depreciation, parking fees, insurance, and maintenance costs without corresponding utility.
            </p>
            <p>
              Simultaneously, thousands of professionals, businesses, and travelers regularly require dependable, flexible vehicle access without the financial commitment of vehicle ownership or the unpredictability of informal car rental intermediaries.
            </p>
            <p className="font-medium text-[#0B0F17]">
              GlideX was established to solve this imbalance by providing a structured digital marketplace that enables private vehicle owners to safely monetize underutilized cars while offering renters transparent, accessible, and verified mobility.
            </p>
          </div>
        </section>

        {/* 6. Founder and GlideX Vision */}
        <section className="mb-10 print-break-inside-avoid">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-[#D7A04D]" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#D7A04D] font-bold">
              6. Founder and GlideX Vision
            </h2>
          </div>
          <div className="text-sm text-slate-700 leading-relaxed space-y-2.5">
            <p>
              The long-term vision of GlideX is to establish a scalable mobility ecosystem that maximizes vehicle utilization across East Africa.
            </p>
            <p>
              By combining verified user onboarding, standardized digital agreements, and responsive booking workflows, GlideX empowers individual car owners and vehicle fleet operators to run productive rental enterprises. For customers, the platform transforms vehicle rental into a frictionless, dependable utility, offering self-drive flexibility, chauffeur availability, and clear pricing standards.
            </p>
          </div>
        </section>

        {/* 7. Relevant Capabilities */}
        <section className="mb-10 print-break-inside-avoid">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-[#D7A04D]" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#D7A04D] font-bold">
              7. Relevant Capabilities
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {capabilities.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-100 bg-slate-50/50"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#D7A04D] mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-[#0B0F17] block">
                    {item.title}
                  </span>
                  <span className="text-slate-600 block mt-0.5 leading-relaxed">
                    {item.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Founder Statement */}
        <section className="mb-10 print-break-inside-avoid">
          <div className="flex items-center gap-2 mb-3">
            <Quote className="w-4 h-4 text-[#D7A04D]" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#D7A04D] font-bold">
              8. Founder Statement
            </h2>
          </div>
          <div className="border-l-4 border-[#D7A04D] bg-slate-50 p-5 rounded-r-xl text-sm text-slate-800 leading-relaxed italic">
            <p className="mb-2">
              "We started GlideX with a simple objective: to ensure that mobility assets do not sit idle while individuals and businesses search for reliable transport. In Kenya, purchasing and maintaining a vehicle requires significant capital, yet thousands of vehicles stay parked each day."
            </p>
            <p className="mb-3">
              "GlideX provides the structure, digital trust, and verification required to make peer-to-peer vehicle sharing dependable. When car owners can earn consistent returns from their investments and renters can secure clean, verified cars without friction, our entire community gains value. We are dedicated to building this platform methodically and responsibly."
            </p>
            <div className="not-italic text-xs font-mono text-[#0B0F17] font-semibold">
              Joseph Henry, Founder of GlideX
            </div>
          </div>
        </section>

        {/* 9. Contact */}
        <footer className="pt-6 border-t border-slate-200 text-xs text-slate-600 print-break-inside-avoid">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#D7A04D] font-bold">
              9. Official Contact &amp; Information
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#D7A04D] shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Website</span>
                <a
                  href="https://glidexp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#0B0F17] hover:underline"
                >
                  glidexp.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#D7A04D] shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Inquiries</span>
                <a
                  href="mailto:support@glidexp.com"
                  className="font-medium text-[#0B0F17] hover:underline"
                >
                  support@glidexp.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#D7A04D] shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Telephone</span>
                <a
                  href="tel:+254768266255"
                  className="font-medium text-[#0B0F17] hover:underline"
                >
                  +254 768 266 255
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D7A04D] shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Headquarters</span>
                <span className="font-medium text-[#0B0F17]">
                  Nairobi, Kenya
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
            <span>GlideX Mobility Limited. All rights reserved.</span>
            <span className="font-mono">glidexp.com | @glidex__</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
