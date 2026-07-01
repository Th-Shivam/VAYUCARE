import { useEffect, useMemo, useState } from 'react';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { DashboardPage } from './pages/DashboardPage';
import { useAuth as useClerkAuth, SignedIn, SignedOut } from '@clerk/clerk-react';

type FeatureCard = {
  icon: string;
  title: string;
  description: string;
  iconTone: string;
};

type HospitalCard = {
  city: string;
  title: string;
  rating: string;
  success: string;
  waitTime: string;
  price: string;
  description: string;
  image: string;
};

type PageMode = 'landing' | 'login' | 'register' | 'dashboard';

const featureCards: FeatureCard[] = [
  {
    icon: 'flight_takeoff',
    title: 'Elite Logistics',
    description:
      'VIP arrival protocols, private transport, and specialist visa coordination built into one operating layer.',
    iconTone: 'text-violet-600',
  },
  {
    icon: 'verified_user',
    title: 'Fortress Security',
    description:
      'Clinical records remain encrypted and access controlled with privacy-first workflows for global patients.',
    iconTone: 'text-rose-600',
  },
  {
    icon: 'spa',
    title: 'Precision Recovery',
    description:
      'Recovery villas, nutrition guidance, and monitoring support designed for a calmer post-treatment path.',
    iconTone: 'text-teal-600',
  },
  {
    icon: 'language',
    title: 'Global Coordination',
    description:
      'Interpreter support, travel planning, and timeline orchestration across borders without operational friction.',
    iconTone: 'text-sky-600',
  },
];

const hospitals: HospitalCard[] = [
  {
    city: 'New Delhi',
    title: 'AIIMS Premier',
    rating: '4.9',
    success: '98% rate',
    waitTime: '2 weeks',
    price: '$4,200',
    description:
      'Pioneering complex cardiac and neurosurgical care for international patients.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB4Fyp-C66Aux52WXYa3paNVyPV_2qlK_q4OTN8aoGU86oYLtE2ETPIN492gN0AJ4v-cBhczmWg0z3VgxGxyskI7QprE2Hp0oEfByFztJC76vbJ7sMqmy2cBAgoJxk8usGLKna9tnz3XLrZtsCJ_rTQZkiNNo8Fp3CwUKS3kdjsHp8RrbJgi0dK5UGQdvHRrYLrLABhVrcFWUiEGjfrB1vWJgWcV2ioiIAlJ-zdZHN3r99orTtVLUEybUMX5xfWQ-Xmcg6h9jFh4ck',
  },
  {
    city: 'Mumbai',
    title: 'Apollo Heights',
    rating: '4.8',
    success: '99.2% rate',
    waitTime: '1.5 weeks',
    price: '$3,800',
    description:
      'Multi-organ transplant specialty with robotics-assisted surgical precision.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDxedCKM3KYrOVV2OdaXp1SS75V-KvnTVettV7OX6bYi2P5r2P4yVfHpqPSgped-siAwMbOKKy1SKoHd3zhEvjc4dbsyKqVNS0-cFVCR3ZN7cFviPbop6rGlt6AAnaNBoHdRFVGsWUDtjEX8sfphho70ohmmQSXNhEMc_ovPwrimzJSKDHb_0_oIbh2aywTULH-0sDCeDUW1t07YcSVJUBxJHUu1omhlNQ6h8J5drLcwaWCuGya8DPj_nfZwZpWyIovgAajTQAt4oI',
  },
  {
    city: 'Bangalore',
    title: 'Manipal Elite',
    rating: '4.9',
    success: '98.5% rate',
    waitTime: '3 weeks',
    price: '$5,100',
    description:
      'State-of-the-art oncology and orthopedic care with a patient concierge model.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDoSHFmomBpOc7FHanPhFvEilORf92DKHolDI2hl2ekzKcUBObxPTvG8e38WE4w5Yzv0tzXl8zQL2mz58OJu0WB-ABgB6GzLCzqnebPjNe-BVJOvvdY4qMzFMBL3CpUt-rKlH1oTWpwMmVWAHqhwKRBPgt6Xz4Vk76Lyg65cgWW2Ur_E6CzF21xdcxM4xPHXeaIbF_skVN_QR-NxedJ_-X6ZDV3MfwxxoBwkgj4FIbA52ddgv8z7gsOV1vVg-q9emxrpWeWrleDFxA',
  },
];

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mode, setMode] = useState<PageMode>('landing');
  const { isSignedIn, isLoaded } = useClerkAuth();

  // Route protection and redirection
  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && (mode === 'login' || mode === 'register')) {
        setMode('dashboard');
      } else if (!isSignedIn && mode === 'dashboard') {
        setMode('login');
      }
    }
  }, [isSignedIn, isLoaded, mode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -80px 0px',
      },
    );

    const revealNodes = document.querySelectorAll<HTMLElement>('[data-reveal]');
    revealNodes.forEach((node) => observer.observe(node));

    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const navClassName = useMemo(
    () => `site-nav${isScrolled ? ' site-nav--scrolled' : ''}`,
    [isScrolled],
  );

  if (mode === 'login') {
    return (
      <SignedOut>
        <LoginPage onBack={() => setMode('landing')} onSwitch={setMode} onSuccess={() => setMode('dashboard')} />
      </SignedOut>
    );
  }

  if (mode === 'register') {
    return (
      <SignedOut>
        <RegisterPage onBack={() => setMode('landing')} onSwitch={setMode} onSuccess={() => setMode('dashboard')} />
      </SignedOut>
    );
  }

  if (mode === 'dashboard') {
    return (
      <SignedIn>
        <DashboardPage />
      </SignedIn>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--app-bg)] text-slate-950 selection:bg-sky-500/15">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.14),transparent_32%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.1),transparent_34%)]" />

      <header className={navClassName}>
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <a href="#hero" className="text-2xl font-semibold tracking-tight text-slate-950">
            VAYU
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            {['Platform', 'Hospitals', 'Doctors', 'Treatments', 'AI Concierge', 'Pricing'].map(
              (item) => (
                <a
                  key={item}
                  href="#features"
                  className="text-sm font-medium text-slate-600 transition hover:text-sky-600"
                >
                  {item}
                </a>
              ),
            )}
          </nav>

          <div className="flex items-center gap-3">
            <SignedOut>
              <button type="button" onClick={() => setMode('login')} className="hidden rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 sm:inline-flex">
                Log in
              </button>
              <button type="button" onClick={() => setMode('register')} className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(14,165,233,0.25)] transition hover:-translate-y-0.5 hover:bg-sky-700">
                Get Started
              </button>
            </SignedOut>
            <SignedIn>
              <button type="button" onClick={() => setMode('dashboard')} className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(14,165,233,0.25)] transition hover:-translate-y-0.5 hover:bg-sky-700">
                Go to Dashboard
              </button>
            </SignedIn>
          </div>
        </div>
      </header>

      <main>
        <section id="hero" className="mx-auto max-w-[1180px] px-4 pb-14 pt-24 sm:px-6 lg:px-8 lg:pt-28">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div data-reveal className="reveal-layer space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/10 bg-sky-500/6 px-3.5 py-1.5 text-xs font-medium text-sky-700 shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                Intelligence-Powered Medical Tourism
              </div>

              <div className="space-y-5">
                <h1 className="max-w-[12ch] text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">
                  From Global to <span className="text-gradient">India.</span> Healing with Vision.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600">
                  Experience world-class healthcare transformation. VAYU curates India&apos;s best medical
                  destinations and manages the full recovery journey with AI precision.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button type="button" onClick={() => setMode(isSignedIn ? 'dashboard' : 'register')} className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(14,165,233,0.25)] transition hover:-translate-y-0.5 hover:bg-sky-700">
                  Consult our Clinical AI
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950">
                  Browse Network
                </button>
              </div>
            </div>

            <div data-reveal className="reveal-layer relative min-h-[540px]">
              <div className="absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/10 blur-[96px] animate-float" />
              <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/40 shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(59,130,246,0.28),transparent_28%),radial-gradient(circle_at_70%_65%,rgba(20,184,166,0.18),transparent_32%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_60%)]" />
                <div className="absolute inset-6 overflow-hidden rounded-full border border-white/50">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.18),transparent_40%),linear-gradient(135deg,rgba(14,165,233,0.3),rgba(99,102,241,0.18),rgba(16,185,129,0.16))]" />
                  <img
                    alt="Cinematic globe"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaAx8hCH9PH2eYAS_zSfl0vi4Jr_1Q1givDBQgDEK41tGRF8vHkGG78QMmzxziJGk4O4hoZ77fzCeSiUTopO28bRFcLhEn9GE38lesILUjifOXmuLiEGleSTm7ZmDncyBfZepRzNOMY9Chj6CM2UrAdyYq2xIBnlRGIkCLGcy1PP5mViFLb4UKrS5CqJBa1UjfBePDQxhIuGW0myBkGFSBFGeWFcDtpsiATOUMzktBpm_79JI2rO341WM9pAixcWz7apH9a4FbNbhbcw"
                    className="absolute inset-0 h-full w-full object-cover opacity-65 mix-blend-multiply"
                  />
                  <div className="absolute left-[66%] top-[49%] h-4 w-4 rounded-full bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.95)]" />
                </div>
              </div>

              <HeroBadge className="left-0 top-12 animate-float" title="AI Treatment Match" description="98% success probability" icon="auto_awesome" delay="0s" />
              <HeroBadge className="right-0 top-24 animate-float" title="Treatment Cost" description="$6,800 in India vs $42,000 abroad" icon="monitoring" delay="1.5s" />
              <HeroBadge className="left-4 bottom-32 animate-float" title="Doctor Confirmed" description="Top-tier specialist reserved" icon="verified_user" delay="0.9s" />
              <HeroBadge className="right-8 bottom-8 animate-float" title="Travel Ready" description="Flight, hotel, interpreter, pickup" icon="flight" delay="2.2s" />

              <div className="absolute left-2 top-1/2 hidden rounded-full border border-white/60 bg-white/80 px-4 py-3 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:block">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <span className="material-symbols-outlined text-sm text-sky-600">description</span>
                  Medical visa ready
                </div>
              </div>

              <div className="absolute right-0 top-[66%] hidden rounded-full border border-white/60 bg-white/80 px-4 py-3 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:block">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <span className="material-symbols-outlined text-sm text-emerald-600">history</span>
                  Recovery timeline: 14 days
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 lg:px-8">
          <div data-reveal className="reveal-layer mx-auto mb-10 max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">
              Precision Engineering. Human Care.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Every layer of the VAYU platform is designed with clinical rigor and a calm premium experience.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-4 md:grid-rows-3">
            <div data-reveal className="glass-panel md:col-span-2 md:row-span-2 p-6 sm:p-8">
              <div className="flex h-full flex-col justify-between gap-6">
                <div className="space-y-4">
                  <IconBadge icon="psychology" accent="text-sky-600" />
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-2xl">
                      Adaptive Treatment Logic
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                      Our engine combines medical history, outcome data, specialist availability, and cost analysis
                      to generate a transparent clinical pathway.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {['AI confidence 98%', 'Low risk', 'Recovery 21 days'].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-slate-200 bg-white/70 px-3.5 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200/80 bg-white/70 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.04)] backdrop-blur-xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.8)]" />
                      <div className="h-2 w-2/3 rounded-full bg-sky-500/20" />
                    </div>
                    <div className="h-2 w-5/6 rounded-full bg-slate-200" />
                    <div className="h-2 w-1/2 rounded-full bg-slate-200" />
                    <div className="grid grid-cols-3 gap-3 pt-3">
                      <div className="h-12 rounded-2xl bg-sky-500/8 border border-sky-500/10" />
                      <div className="h-12 rounded-2xl bg-sky-500/8 border border-sky-500/10" />
                      <div className="h-12 rounded-2xl bg-sky-500/8 border border-sky-500/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div data-reveal className="glass-panel md:col-span-2 p-6 sm:p-8">
              <div className="flex h-full flex-col justify-between gap-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-2xl">
                      Elite Hospital Network
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                      Curated access to JCI and NABH centers across major Indian medical hubs.
                    </p>
                  </div>
                  <IconBadge icon="corporate_fare" accent="text-emerald-600" />
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {['JCI/NABH', '500+ Specialists', 'Fastest Appointment', 'Verified Care'].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-emerald-500/10 bg-emerald-500/5 px-3.5 py-1.5 text-[11px] font-semibold text-emerald-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {['Apollo Healthcare', 'Max Smart City', 'Fortis Memorial', 'Medanta'].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {featureCards.map((feature) => (
              <div key={feature.title} data-reveal className="glass-panel p-6 sm:p-7">
                <div className="flex h-full flex-col gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-white/70 shadow-sm ${feature.iconTone}`}>
                    <span className="material-symbols-outlined text-[28px]">{feature.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">{feature.title}</h3>
                    <p className="mt-2 text-[13px] leading-6 text-slate-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white/50 py-16">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div data-reveal className="reveal-layer mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">
                  Luxury medical destinations.
                </h2>
                <p className="mt-3 text-base text-slate-600">
                  The pinnacle of clinical excellence combined with five-star hospitality.
                </p>
              </div>
              <a href="#" className="inline-flex items-center gap-2 text-base font-semibold text-sky-600 transition hover:gap-3">
                View our India network
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {hospitals.map((hospital, index) => (
                <article
                  key={hospital.title}
                  data-reveal
                  className="overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
                  style={{ transitionDelay: `${index * 120}ms` }}
                >
                  <div className="relative h-60 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition duration-700 hover:scale-110"
                      style={{ backgroundImage: `url('${hospital.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                    <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/30 px-4 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md">
                      {hospital.city}
                    </span>
                    <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-sky-600/90 px-4 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md">
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      AI Recommended
                    </span>
                  </div>

                  <div className="space-y-4 p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
                          {hospital.title}
                        </h3>
                        <p className="mt-2 text-[13px] leading-6 text-slate-600">{hospital.description}</p>
                      </div>
                      <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                        <span className="material-symbols-outlined text-[18px]">star</span>
                        {hospital.rating}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-y border-slate-200 py-4 text-sm">
                      <Stat label="Recovery success" value={hospital.success} valueClassName="text-emerald-600" />
                      <Stat label="Waiting time" value={hospital.waitTime} valueClassName="text-slate-950" alignRight />
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="rounded-full border border-sky-500/10 bg-sky-500/5 px-4 py-2 text-xs font-semibold text-sky-700">
                        JCI Accredited
                      </span>
                      <div className="text-right text-base font-semibold tracking-[-0.02em] text-slate-950">
                        {hospital.price} <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Starting</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            <div data-reveal className="reveal-layer space-y-6">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">
                Your intelligent medical orchestrator.
              </h2>

              <div className="space-y-6">
                {[
                  {
                    icon: 'hub',
                    title: 'End-to-End Synthesis',
                    description:
                      'A unified workflow connecting medical analysis, hospital pairing, travel logistics, and recovery planning in one thread.',
                    color: 'text-sky-600',
                  },
                  {
                    icon: 'auto_videocam',
                    title: 'Real-time Tele-consult',
                    description:
                      'Instant secure access to specialists for verification of AI-generated clinical pathways.',
                    color: 'text-violet-600',
                  },
                  {
                    icon: 'account_balance_wallet',
                    title: 'Transparent Financing',
                    description:
                      'Granular cost breakdowns across clinical, travel, and recovery expenses with no hidden fees.',
                    color: 'text-emerald-600',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className={`flex h-12 w-12 flex-none items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm ${item.color}`}>
                      <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold tracking-[-0.02em] text-slate-950">{item.title}</h3>
                      <p className="mt-2 max-w-xl text-sm leading-7 text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div data-reveal className="reveal-layer rounded-[28px] bg-gradient-to-b from-white/90 to-white/70 p-1 shadow-[0_24px_70px_rgba(15,23,42,0.09)]">
              <div className="flex h-[620px] flex-col overflow-hidden rounded-[26px] border border-white/60 bg-white/80 backdrop-blur-xl">
                <div className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/70 px-5 py-4 backdrop-blur-xl sm:px-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-600 text-white shadow-[0_14px_30px_rgba(14,165,233,0.22)]">
                        <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                      </div>
                      <div>
                        <p className="text-base font-semibold tracking-[-0.02em] text-slate-950">VAYU Clinical Workspace</p>
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          Multi-step engine active
                        </div>
                      </div>
                    </div>
                    <button className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                  <div className="space-y-5">
                    <WorkflowStep
                      step="01"
                      label="Query"
                      title="Patient Query"
                      content='"I need an orthopedic assessment for a complex knee replacement. I value high success rates and private recovery."'
                    />
                    <WorkflowStep
                      step="02"
                      label="Thinking"
                      title="AI Thinking & Comparison"
                      content="Analyzing 12k+ orthopedic outcomes across Apollo, Max, and Fortis networks."
                      highlight
                    />
                    <WorkflowStep
                      step="03"
                      label="Match"
                      title="Match, Cost & Timeline"
                      content="Apollo Mumbai selected as best value with a specialist assignment and package pricing."
                    />
                    <div className="rounded-[24px] border border-slate-200/80 bg-white/70 p-4 shadow-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600">Future steps</p>
                      <div className="mt-3 grid grid-cols-3 gap-3">
                        {['Visa ready', 'Travel set', 'Recovery'].map((item) => (
                          <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3.5 text-center">
                            <span className="material-symbols-outlined text-slate-500">{item === 'Visa ready' ? 'description' : item === 'Travel set' ? 'flight' : 'spa'}</span>
                            <p className="mt-2 text-xs font-semibold text-slate-700">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200/80 bg-white/70 px-5 py-4 backdrop-blur-xl sm:px-6">
                  <div className="flex items-center justify-between gap-4 rounded-full border border-slate-200 bg-slate-50 px-4 py-3">
                    <span className="text-sm font-medium text-slate-500">Initialize Clinical Workflow...</span>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-white transition hover:bg-sky-700">
                      <span className="material-symbols-outlined text-[16px]">send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 bg-white/50 py-12 backdrop-blur-xl">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <a href="#hero" className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                VAYU
              </a>
              <p className="max-w-sm text-sm leading-6 text-slate-600">
                Bridging the gap between global patients and India&apos;s finest healthcare infrastructure.
              </p>
              <div className="flex gap-3">
                {['public', 'mail'].map((icon) => (
                  <a
                    key={icon}
                    href="#"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-sky-500/20 hover:text-sky-600"
                  >
                    <span className="material-symbols-outlined text-[22px]">{icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {[
              ['Product', ['Adaptive Search', 'Clinical AI Engine', 'Logistics Concierge', 'Financial Sync']],
              ['Network', ['JCI Centers', 'Specialist Directory', 'Safety Protocols', 'Ethics Committee']],
              ['Company', ['Our Mission', 'Clinical Careers', 'Sustainability', 'Investor Relations']],
            ].map(([title, items]) => (
              <div key={title as string} className="space-y-5">
                <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{title as string}</h3>
                <ul className="space-y-4 text-sm text-slate-600">
                  {(items as string[]).map((item) => (
                    <li key={item}>
                      <a href="#" className="transition hover:text-sky-600">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-slate-200/70 pt-5 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>© 2024 VAYU Technologies Inc. All rights reserved.</p>
            <div className="flex flex-wrap gap-6">
              {['Privacy Framework', 'Terms of Engagement', 'Clinical Compliance'].map((item) => (
                <a key={item} href="#" className="transition hover:text-slate-900">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeroBadge({
  className,
  title,
  description,
  icon,
  delay,
}: {
  className: string;
  title: string;
  description: string;
  icon: string;
  delay: string;
}) {
  return (
    <div
      className={`absolute z-20 hidden rounded-[22px] border border-white/70 bg-white/85 px-3.5 py-2.5 shadow-[0_16px_42px_rgba(15,23,42,0.07)] backdrop-blur-xl lg:block ${className}`}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/10 text-sky-600">
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-950 sm:text-sm">{title}</p>
          <p className="text-[11px] text-slate-500 sm:text-xs">{description}</p>
        </div>
      </div>
    </div>
  );
}

function IconBadge({ icon, accent }: { icon: string; accent: string }) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white shadow-sm">
      <span className={`material-symbols-outlined text-[28px] ${accent}`}>{icon}</span>
    </div>
  );
}

function Stat({
  label,
  value,
  valueClassName,
  alignRight,
}: {
  label: string;
  value: string;
  valueClassName: string;
  alignRight?: boolean;
}) {
  return (
    <div className={alignRight ? 'text-right' : ''}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${valueClassName}`}>{value}</p>
    </div>
  );
}

function WorkflowStep({
  step,
  label,
  title,
  content,
  highlight,
}: {
  step: string;
  label: string;
  title: string;
  content: string;
  highlight?: boolean;
}) {
  return (
    <div className="relative pl-10">
      <div
        className={`absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full border-4 border-white ${highlight ? 'bg-sky-500 shadow-[0_0_0_4px_rgba(14,165,233,0.12)]' : 'bg-sky-300'}`}
      />
      <div className="rounded-[28px] border border-slate-200 bg-white/80 p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600">{label}</p>
            <h3 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-slate-950">{title}</h3>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{step}</span>
        </div>
        <p className="text-sm leading-7 text-slate-600">{content}</p>
      </div>
    </div>
  );
}

export default App;