import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Apple, Play, Car, Shield, Clock, UserCheck, Phone } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const instantRef = useRef<HTMLDivElement>(null);
  const verifiedRef = useRef<HTMLDivElement>(null);
  const supportRef = useRef<HTMLDivElement>(null);
  const chauffeurRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);

  // Hero load animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      const heroTl = gsap.timeline({ delay: 0.2 });

      heroTl.fromTo('.hero-circle',
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9, ease: 'power2.out' }
      );

      heroTl.fromTo('.hero-headline span',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.08 },
        '-=0.5'
      );

      heroTl.fromTo('.hero-subtext',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out', stagger: 0.06 },
        '-=0.3'
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Scroll animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section scroll
      const heroScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.6,
        }
      });

      heroScrollTl.fromTo('.hero-circle',
        { x: 0, scale: 1, opacity: 1 },
        { x: '-22vw', scale: 0.92, opacity: 0, ease: 'power2.in' },
        0.7
      );

      heroScrollTl.fromTo('.hero-headline',
        { x: 0, opacity: 1 },
        { x: '-10vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      heroScrollTl.fromTo('.hero-subtext',
        { y: 0, opacity: 1 },
        { y: '6vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      // Instant Booking section
      const instantScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: instantRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.6,
        }
      });

      instantScrollTl.fromTo('.instant-circle',
        { x: '-60vw', scale: 0.85, opacity: 0 },
        { x: 0, scale: 1, opacity: 1, ease: 'power2.out' },
        0
      );

      instantScrollTl.fromTo('.instant-card',
        { x: '60vw', opacity: 0, scale: 0.98 },
        { x: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0
      );

      instantScrollTl.fromTo('.instant-text',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out', stagger: 0.03 },
        0.1
      );

      instantScrollTl.fromTo('.instant-circle',
        { x: 0, scale: 1, opacity: 1 },
        { x: '-18vw', scale: 0.95, opacity: 0, ease: 'power2.in' },
        0.7
      );

      instantScrollTl.fromTo('.instant-card',
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      // Verified Hosts section
      const verifiedScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: verifiedRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.6,
        }
      });

      verifiedScrollTl.fromTo('.verified-circle',
        { x: '60vw', scale: 0.85, opacity: 0 },
        { x: 0, scale: 1, opacity: 1, ease: 'power2.out' },
        0
      );

      verifiedScrollTl.fromTo('.verified-card',
        { x: '-60vw', opacity: 0, scale: 0.98 },
        { x: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0
      );

      verifiedScrollTl.fromTo('.verified-text',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out', stagger: 0.03 },
        0.1
      );

      verifiedScrollTl.fromTo('.verified-circle',
        { x: 0, scale: 1, opacity: 1 },
        { x: '18vw', scale: 0.95, opacity: 0, ease: 'power2.in' },
        0.7
      );

      verifiedScrollTl.fromTo('.verified-card',
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      // Support section
      const supportScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: supportRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.6,
        }
      });

      supportScrollTl.fromTo('.support-circle',
        { x: '-60vw', scale: 0.85, opacity: 0 },
        { x: 0, scale: 1, opacity: 1, ease: 'power2.out' },
        0
      );

      supportScrollTl.fromTo('.support-card',
        { x: '60vw', opacity: 0, scale: 0.98 },
        { x: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0
      );

      supportScrollTl.fromTo('.support-text',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out', stagger: 0.03 },
        0.1
      );

      supportScrollTl.fromTo('.support-circle',
        { x: 0, scale: 1, opacity: 1 },
        { x: '-18vw', scale: 0.95, opacity: 0, ease: 'power2.in' },
        0.7
      );

      supportScrollTl.fromTo('.support-card',
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      // Chauffeur section
      const chauffeurScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: chauffeurRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.6,
        }
      });

      chauffeurScrollTl.fromTo('.chauffeur-circle',
        { x: '60vw', scale: 0.85, opacity: 0 },
        { x: 0, scale: 1, opacity: 1, ease: 'power2.out' },
        0
      );

      chauffeurScrollTl.fromTo('.chauffeur-card',
        { x: '-60vw', opacity: 0, scale: 0.98 },
        { x: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0
      );

      chauffeurScrollTl.fromTo('.chauffeur-text',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out', stagger: 0.03 },
        0.1
      );

      chauffeurScrollTl.fromTo('.chauffeur-circle',
        { x: 0, scale: 1, opacity: 1 },
        { x: '18vw', scale: 0.95, opacity: 0, ease: 'power2.in' },
        0.7
      );

      chauffeurScrollTl.fromTo('.chauffeur-card',
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      // Host section
      const hostScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: hostRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.6,
        }
      });

      hostScrollTl.fromTo('.host-circle',
        { x: '-60vw', scale: 0.85, opacity: 0 },
        { x: 0, scale: 1, opacity: 1, ease: 'power2.out' },
        0
      );

      hostScrollTl.fromTo('.host-card',
        { x: '60vw', opacity: 0, scale: 0.98 },
        { x: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0
      );

      hostScrollTl.fromTo('.host-text',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out', stagger: 0.03 },
        0.1
      );

      hostScrollTl.fromTo('.host-circle',
        { x: 0, scale: 1, opacity: 1 },
        { x: '-18vw', scale: 0.95, opacity: 0, ease: 'power2.in' },
        0.7
      );

      hostScrollTl.fromTo('.host-card',
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      // Closing section (flowing, not pinned)
      gsap.fromTo('.closing-circle',
        { scale: 0.9, opacity: 0, y: '8vh' },
        {
          scale: 1, opacity: 1, y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: closingRef.current,
            start: 'top 80%',
            end: 'top 45%',
            scrub: 0.5,
          }
        }
      );

      gsap.fromTo('.closing-text',
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: closingRef.current,
            start: 'top 70%',
            end: 'top 50%',
            scrub: 0.5,
          }
        }
      );

      gsap.fromTo('.closing-buttons',
        { y: 16, opacity: 0 },
        {
          y: 0, opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: closingRef.current,
            start: 'top 60%',
            end: 'top 45%',
            scrub: 0.5,
          }
        }
      );

      // Global snap for pinned sections
      const pinned = ScrollTrigger.getAll().filter(st => st.vars.pin).sort((a, b) => a.start - b.start);
      const maxScroll = ScrollTrigger.maxScroll(window);

      if (maxScroll && pinned.length > 0) {
        const pinnedRanges = pinned.map(st => ({
          start: st.start / maxScroll,
          end: (st.end ?? st.start) / maxScroll,
          center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
        }));

        ScrollTrigger.create({
          snap: {
            snapTo: (value: number) => {
              const inPinned = pinnedRanges.some(r => value >= r.start - 0.02 && value <= r.end + 0.02);
              if (!inPinned) return value;

              const target = pinnedRanges.reduce((closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
                pinnedRanges[0]?.center ?? 0
              );
              return target;
            },
            duration: { min: 0.15, max: 0.35 },
            delay: 0,
            ease: 'power2.out',
          }
        });
      }
    }, mainRef);

    return () => ctx.revert();
  }, []);

  // Navigation is now handled by anchor links in the Navbar component

  return (
    <div ref={mainRef} className="relative">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Navigation */}
      <Navbar />

      {/* Section 1: Hero */}
      <section id="hero" ref={heroRef} className="section-pinned bg-[#F4F6F8] z-10">
        <div className="absolute inset-0 bg-gradient-radial from-white/50 to-transparent" />

        {/* Hero Circle Image */}
        <div className="hero-circle absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[72vmin] h-[72vmin] z-[2]">
          <img
            src="/hero_circle_car.jpg"
            alt="Luxury car"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Headline */}
        <div className="hero-headline absolute left-[6vw] top-[10vh] w-[44vw] z-[3]">
          <h1 className="text-headline text-[clamp(44px,6vw,96px)] text-[#0B0F17]">
            <span className="block">Drive Your</span>
            <span className="block">Dreams</span>
            <span className="block text-[#6B7280]">With GlideX</span>
          </h1>
        </div>

        {/* Subheadline */}
        <div className="hero-subtext absolute left-[6vw] top-[58vh] w-[34vw] z-[3]">
          <p className="text-lg text-[#6B7280] leading-relaxed">
            Rent, host, and chauffeur cars across Kenya—fast, safe, and simple.
          </p>
        </div>

        {/* CTAs */}
        <div className="hero-subtext absolute left-[6vw] top-[72vh] z-[3] flex flex-col gap-3">
          <button className="btn-primary w-fit">
            <Car className="w-4 h-4 mr-2" />
            Book a car
          </button>
          <button className="btn-secondary w-fit text-sm">
            Become a host
          </button>
        </div>

        {/* Caption */}
        <div className="hero-subtext absolute left-[6vw] bottom-[6vh] z-[3]">
          <p className="text-micro text-[#6B7280]">Nairobi • Mombasa • Kisumu</p>
        </div>

        {/* Micro label */}
        <div className="hero-subtext absolute right-[6vw] top-[10vh] z-[3] hidden lg:block">
          <span className="text-micro text-[#D7A04D]">Instant Booking</span>
        </div>
      </section>

      {/* Section 2: Instant Booking */}
      <section id="instant" ref={instantRef} className="section-pinned bg-[#F4F6F8] z-20">
        {/* Left Circle */}
        <div className="instant-circle absolute left-[30%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[64vmin] h-[64vmin] z-[2]">
          <img
            src="/instant_circle_car.jpg"
            alt="Car for instant booking"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Right Card */}
        <div className="instant-card absolute right-[6vw] top-1/2 -translate-y-1/2 w-[44vw] min-w-[320px] h-[62vh] min-h-[420px] bg-white rounded-[28px] card-shadow z-[3] p-[7%] flex flex-col justify-center">
          <div className="instant-text">
            <h2 className="text-headline text-[clamp(32px,4vw,64px)] text-[#0B0F17] mb-6">
              Instant<br />Booking
            </h2>
          </div>
          <div className="instant-text">
            <p className="text-[#6B7280] text-lg leading-relaxed mb-8">
              Find the perfect car, confirm in two taps, and hit the road. No paperwork, no waiting.
            </p>
          </div>
          <div className="instant-text">
            <button className="btn-secondary text-sm">
              <Clock className="w-4 h-4 mr-2" />
              See how it works
            </button>
          </div>
        </div>

        {/* Caption */}
        <div className="instant-text absolute right-[6vw] bottom-[6vh] z-[3]">
          <p className="text-micro text-[#6B7280]">Available in Nairobi, Mombasa, Kisumu</p>
        </div>
      </section>

      {/* Section 3: Verified Hosts */}
      <section id="verified" ref={verifiedRef} className="section-pinned bg-[#F4F6F8] z-30">
        {/* Left Card */}
        <div className="verified-card absolute left-[6vw] top-1/2 -translate-y-1/2 w-[44vw] min-w-[320px] h-[62vh] min-h-[420px] bg-white rounded-[28px] card-shadow z-[3] p-[7%] flex flex-col justify-center">
          <div className="verified-text">
            <h2 className="text-headline text-[clamp(32px,4vw,64px)] text-[#0B0F17] mb-6">
              Verified<br />Hosts
            </h2>
          </div>
          <div className="verified-text">
            <p className="text-[#6B7280] text-lg leading-relaxed mb-8">
              Every host is screened, every car is tracked. Rent with confidence from real people.
            </p>
          </div>
          <div className="verified-text">
            <button className="btn-secondary text-sm">
              <UserCheck className="w-4 h-4 mr-2" />
              Meet the hosts
            </button>
          </div>
        </div>

        {/* Right Circle */}
        <div className="verified-circle absolute left-[70%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[64vmin] h-[64vmin] z-[2]">
          <img
            src="/verified_circle_car.jpg"
            alt="Verified host car"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Caption */}
        <div className="verified-text absolute left-[6vw] bottom-[6vh] z-[3]">
          <p className="text-micro text-[#6B7280]">ID-verified • GPS-tracked • Reviewed</p>
        </div>
      </section>

      {/* Section 4: 24/7 Support */}
      <section id="support" ref={supportRef} className="section-pinned bg-[#F4F6F8] z-40">
        {/* Left Circle */}
        <div className="support-circle absolute left-[30%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[64vmin] h-[64vmin] z-[2]">
          <img
            src="/support_circle_car.jpg"
            alt="Support car"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Right Card */}
        <div className="support-card absolute right-[6vw] top-1/2 -translate-y-1/2 w-[44vw] min-w-[320px] h-[62vh] min-h-[420px] bg-white rounded-[28px] card-shadow z-[3] p-[7%] flex flex-col justify-center">
          <div className="support-text">
            <h2 className="text-headline text-[clamp(32px,4vw,64px)] text-[#0B0F17] mb-6">
              24/7<br />Support
            </h2>
          </div>
          <div className="support-text">
            <p className="text-[#6B7280] text-lg leading-relaxed mb-8">
              Roadside, in-app chat, or a quick call—our team is here anytime you need us.
            </p>
          </div>
          <div className="support-text">
            <button className="btn-secondary text-sm">
              <Phone className="w-4 h-4 mr-2" />
              Get help
            </button>
          </div>
        </div>

        {/* Caption */}
        <div className="support-text absolute right-[6vw] bottom-[6vh] z-[3]">
          <p className="text-micro text-[#6B7280]">Typical response: under 5 minutes</p>
        </div>
      </section>

      {/* Section 5: Chauffeur Service */}
      <section id="chauffeur" ref={chauffeurRef} className="section-pinned bg-[#F4F6F8] z-50">
        {/* Left Card */}
        <div className="chauffeur-card absolute left-[6vw] top-1/2 -translate-y-1/2 w-[44vw] min-w-[320px] h-[62vh] min-h-[420px] bg-white rounded-[28px] card-shadow z-[3] p-[7%] flex flex-col justify-center">
          <div className="chauffeur-text">
            <h2 className="text-headline text-[clamp(32px,4vw,64px)] text-[#0B0F17] mb-6">
              Chauffeur<br />Service
            </h2>
          </div>
          <div className="chauffeur-text">
            <p className="text-[#6B7280] text-lg leading-relaxed mb-8">
              Prefer to be driven? Book a professional chauffeur for meetings, events, or airport transfers.
            </p>
          </div>
          <div className="chauffeur-text">
            <button className="btn-secondary text-sm">
              <Shield className="w-4 h-4 mr-2" />
              Book a chauffeur
            </button>
          </div>
        </div>

        {/* Right Circle */}
        <div className="chauffeur-circle absolute left-[70%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[64vmin] h-[64vmin] z-[2]">
          <img
            src="/chauffeur_circle_car.jpg"
            alt="Chauffeur car"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Caption */}
        <div className="chauffeur-text absolute left-[6vw] bottom-[6vh] z-[3]">
          <p className="text-micro text-[#6B7280]">Airport • Corporate • Events</p>
        </div>
      </section>

      {/* Section 6: List Your Car */}
      <section id="host" ref={hostRef} className="section-pinned bg-[#F4F6F8] z-[60]">
        {/* Left Circle */}
        <div className="host-circle absolute left-[30%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[64vmin] h-[64vmin] z-[2]">
          <img
            src="/host_circle_car.jpg"
            alt="Host car"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Right Card */}
        <div className="host-card absolute right-[6vw] top-1/2 -translate-y-1/2 w-[44vw] min-w-[320px] h-[62vh] min-h-[420px] bg-white rounded-[28px] card-shadow z-[3] p-[7%] flex flex-col justify-center">
          <div className="host-text">
            <h2 className="text-headline text-[clamp(32px,4vw,64px)] text-[#0B0F17] mb-6">
              List Your<br />Car
            </h2>
          </div>
          <div className="host-text">
            <p className="text-[#6B7280] text-lg leading-relaxed mb-8">
              Turn your car into income. Set your price, choose your schedule, and we'll handle the rest.
            </p>
          </div>
          <div className="host-text">
            <button className="btn-secondary text-sm">
              Start earning
            </button>
          </div>
        </div>

        {/* Caption */}
        <div className="host-text absolute right-[6vw] bottom-[6vh] z-[3]">
          <p className="text-micro text-[#6B7280]">Insurance-backed • Automated payouts</p>
        </div>
      </section>

      {/* Section 7: Download The App */}
      <section id="closing" ref={closingRef} className="relative bg-[#0B0F17] z-[70] overflow-hidden">
        <div className="relative min-h-screen flex flex-col items-center justify-center px-6 sm:px-8 py-24">
          {/* Circle Image (behind text) */}
          <div className="closing-circle absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(72vmin,550px)] h-[min(72vmin,550px)] z-[1] opacity-90">
            <img
              src="/closing_circle_car.jpg"
              alt="App download car"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* Content (over circle) */}
          <div className="relative z-[2] flex flex-col items-center text-center gap-6">
            <div className="closing-text">
              <h2 className="text-headline text-[clamp(36px,5vw,80px)] text-[#F4F6F8]">
                Download<br />The App
              </h2>
            </div>
            <div className="closing-text max-w-md">
              <p className="text-lg text-[rgba(244,246,248,0.75)] leading-relaxed">
                Book, track, and manage your rides—anytime, anywhere.
              </p>
            </div>
            <div className="closing-buttons flex flex-wrap justify-center gap-4 mt-4">
              <button className="btn-dark flex items-center gap-2">
                <Apple className="w-5 h-5" />
                <span className="text-sm font-medium">App Store</span>
              </button>
              <button className="btn-dark flex items-center gap-2">
                <Play className="w-5 h-5" />
                <span className="text-sm font-medium">Google Play</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
