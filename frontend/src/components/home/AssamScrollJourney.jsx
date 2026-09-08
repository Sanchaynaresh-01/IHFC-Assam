import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Calendar, CheckCircle, Award, Users, BookOpen, BrainCircuit,
  Code2, Trophy, MapPin, Sparkles, ArrowDown
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const STAGES = [
  {
    step: '01',
    title: 'School Registration',
    date: '20–30 September 2026',
    desc: 'Schools across all 33 districts of Assam register for the program and receive access to official program guidelines and the state portal.',
    category: 'Registration',
    icon: SchoolIcon,
    color: 'emerald',
    percent: 6
  },
  {
    step: '02',
    title: 'Principal & Mentor Digital Onboarding',
    date: '1–5 October 2026',
    desc: '5-day comprehensive digital onboarding providing school leadership and teacher coordinators with orientation, pedagogical tools, and resources.',
    category: 'Orientation',
    icon: Users,
    color: 'teal',
    percent: 14
  },
  {
    step: '03',
    title: 'Team Formation',
    date: '6–12 October 2026',
    desc: 'Schools facilitate student team formation and register them on the state portal across three official categories: VI–VIII, IX–X, and XI–XII.',
    category: 'Teams',
    icon: Users,
    color: 'green',
    percent: 22
  },
  {
    step: '04',
    title: '20-Hour Online Bootcamp',
    date: '13–27 October 2026',
    desc: '15-day foundational learning program encompassing 20 structured learning hours in design thinking, problem framing, and technology fundamentals.',
    category: 'Learning',
    icon: BookOpen,
    color: 'amber',
    percent: 31
  },
  {
    step: '05',
    title: 'MCQ / Knowledge Assessment',
    date: '28–30 October 2026',
    desc: 'State-wide standardized online assessment testing concepts mastered during the bootcamp to shortlist high-performing student teams.',
    category: 'Assessment',
    icon: BrainCircuit,
    color: 'orange',
    percent: 40
  },
  {
    step: '06',
    title: 'Top 1,000 Teams Shortlisted',
    date: '31 October 2026',
    desc: '1,000 high-potential teams across Assam qualify for the specialized advanced acceleration phase based on assessment merit.',
    category: 'Milestone',
    icon: Trophy,
    color: 'amber',
    percent: 49
  },
  {
    step: '07',
    title: '30-Day Advanced Level Bootcamp',
    date: '1–25 November 2026',
    desc: 'Intensive immersion across 25 cohorts of 1,000 teams with dedicated IIT & industry mentors focusing on coding, physical prototyping, and testing.',
    category: 'Advanced Learning',
    icon: Code2,
    color: 'emerald',
    percent: 58
  },
  {
    step: '08',
    title: 'Coding / Technical Challenge',
    date: '20–25 November 2026',
    desc: 'Teams apply hands-on skills in a rigorous technical benchmark evaluating solution functionality, software implementation, and problem solving.',
    category: 'Challenge',
    icon: Code2,
    color: 'blue',
    percent: 67
  },
  {
    step: '09',
    title: 'Shortlisting of 198 Teams',
    date: '26 Nov – 5 Dec 2026',
    desc: 'Merit-based zonal selection yielding exactly 198 teams: 33 districts × 3 age categories × 2 top performing teams.',
    category: 'Shortlist',
    icon: CheckCircle,
    color: 'teal',
    percent: 76
  },
  {
    step: '10',
    title: 'Zonal / Divisional 48h Hackathons',
    date: '6–20 December 2026',
    desc: '198 teams compete across divisional venues in a 48-hour live building sprint with expert on-ground mentoring and jury evaluation.',
    category: 'Hackathon',
    icon: MapPin,
    color: 'indigo',
    percent: 85
  },
  {
    step: '11',
    title: 'Finalist Selection & Preparation',
    date: '21 Dec 2026 – 5 Jan 2027',
    desc: 'Consolidation of zonal results to select the top 60 State Finalists (20 per category), backed by pitch polish and prototype refinement.',
    category: 'Preparation',
    icon: Sparkles,
    color: 'purple',
    percent: 93
  },
  {
    step: '12',
    title: 'State-Level Grand Final',
    date: 'January 2027',
    desc: '60 finalist teams present live working demonstrations before state dignitaries, academic leaders, and industry panels. State champions awarded.',
    category: 'Grand Finale',
    icon: Award,
    color: 'amber',
    percent: 100
  }
];

function SchoolIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

const AssamScrollJourney = () => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const boyRef = useRef(null);
  const womanRef = useRef(null);
  const vegSlowRef = useRef(null);
  const vegMedRef = useRef(null);
  const vegFastRef = useRef(null);

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const pathEl = pathRef.current;
      const boyEl = boyRef.current;
      const womanEl = womanRef.current;
      const containerEl = containerRef.current;

      if (!pathEl || !boyEl || !containerEl) return;

      const pathLength = pathEl.getTotalLength();

      // Master ScrollTrigger for the journey container
      ScrollTrigger.create({
        trigger: containerEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);

          // 1. Move the boy student down the curved pathway using SVG geometry
          const point = pathEl.getPointAtLength(progress * pathLength);
          gsap.set(boyEl, {
            x: point.x,
            y: point.y,
            transformOrigin: '50% 100%',
            autoAlpha: 1
          });

          // 2. Parallax movements for the tea woman
          if (womanEl) {
            gsap.set(womanEl, {
              y: progress * 450, // subtle downward drift with parallax
              rotate: Math.sin(progress * 15) * 1.5 // gentle atmospheric sway
            });
          }

          // 3. Multi-depth parallax on right vegetation
          if (vegSlowRef.current) {
            gsap.set(vegSlowRef.current, { y: progress * 150 });
          }
          if (vegMedRef.current) {
            gsap.set(vegMedRef.current, { y: progress * 350 });
          }
          if (vegFastRef.current) {
            gsap.set(vegFastRef.current, { y: progress * 600 });
          }

          // 4. Determine current active checkpoint
          const stepPercent = progress * 100;
          let currentIdx = 0;
          for (let i = 0; i < STAGES.length; i++) {
            if (stepPercent >= (STAGES[i].percent - 5)) {
              currentIdx = i;
            }
          }
          setActiveStepIndex(currentIdx);
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="journey"
      className="relative w-full bg-gradient-to-b from-[#faf8f5] via-[#f2ede4] to-[#faf8f5] overflow-hidden"
      style={{ height: '700vh' }}
    >
      {/* Sticky Journey Frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pointer-events-none">
        {/* Top Header Banner */}
        <div className="pt-24 px-4 text-center z-30 pointer-events-auto max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Scroll-Driven State Innovation Odyssey</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Follow the Student Journey Through Assam
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
            Scroll down to watch our young innovator journey through tea gardens, knowledge camps, and zonal hackathons to the state final.
          </p>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto mt-3 h-2 bg-slate-200/80 rounded-full overflow-hidden p-0.5 border border-slate-300/60">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 rounded-full transition-all duration-150"
              style={{ width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
            />
          </div>
        </div>

        {/* BOTTOM HUD Indicator */}
        <div className="pb-6 px-6 z-30 flex items-center justify-between pointer-events-auto text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Checkpoint {activeStepIndex + 1} of 12: {STAGES[activeStepIndex].title}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-emerald-800 bg-emerald-50/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-200">
            <span>Scroll down to continue journey</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3-ZONE SCENE COMPOSITION: LEFT (WOMAN), CENTER (PATH & BOY), RIGHT (VEG) */}
      {/* ==================================================================== */}

      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* ------------------------------------------------------------------ */}
        {/* ZONE 1 (LEFT): TASTEFUL ASSAMESE TEA GARDEN WORKER */}
        {/* ------------------------------------------------------------------ */}
        <div
          ref={womanRef}
          className="fixed left-2 sm:left-6 lg:left-12 bottom-12 z-20 w-48 sm:w-64 lg:w-80 pointer-events-none select-none transition-transform"
        >
          <div className="relative">
            {/* Ambient tea aura */}
            <div className="absolute -inset-4 bg-emerald-500/10 blur-2xl rounded-full" />

            <svg viewBox="0 0 300 450" className="w-full h-auto drop-shadow-2xl">
              <defs>
                <linearGradient id="tea-basket" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#b45309" />
                  <stop offset="100%" stop-color="#78350f" />
                </linearGradient>
                <linearGradient id="saree-drape" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#fdf4dc" />
                  <stop offset="50%" stop-color="#f5e6c4" />
                  <stop offset="100%" stop-color="#e2c892" />
                </linearGradient>
                <linearGradient id="muga-red-border" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#dc2626" />
                  <stop offset="100%" stop-color="#991b1b" />
                </linearGradient>
              </defs>

              {/* Basket on her back (Tokari / Dala) */}
              <g id="tea-basket-group" className="animate-pulse" style={{ animationDuration: '4s' }}>
                {/* Basket Rim */}
                <ellipse cx="110" cy="180" rx="42" ry="58" fill="url(#tea-basket)" stroke="#572208" strokeWidth="3" transform="rotate(-15, 110, 180)" />
                {/* Woven cane mesh lines */}
                <path d="M 80,140 Q 110,180 140,220 M 70,180 Q 110,190 150,180 M 80,210 Q 110,210 140,160" stroke="#fcd34d" strokeWidth="1.5" opacity="0.6" />
                {/* Freshly plucked green tea leaves filling the basket */}
                <path d="M 75,130 Q 95,115 115,125 Q 135,110 150,135 Q 130,150 90,145 Z" fill="#2d6a4f" />
                <circle cx="100" cy="125" r="5" fill="#52b788" />
                <circle cx="125" cy="120" r="6" fill="#74c69d" />
                <circle cx="112" cy="132" r="4.5" fill="#40916c" />
                {/* Traditional Head Strap (Tumoni / Chalani rope) */}
                <path d="M 95,145 C 105,105 130,70 155,75" fill="none" stroke="#78350f" strokeWidth="4.5" strokeLinecap="round" />
              </g>

              {/* Assamese Woman Character Silhouette & Traditional Attire */}
              <g id="woman-body">
                {/* Hair Bun / Khorpa with flower */}
                <circle cx="175" cy="72" r="18" fill="#1e1b18" />
                <circle cx="186" cy="65" r="4" fill="#ef4444" /> {/* Red tagar flower accent */}

                {/* Head / Profile */}
                <ellipse cx="160" cy="78" r="16" ry="18" fill="#d4a373" />
                {/* Traditional head cloth / Rumal */}
                <path d="M 148,65 Q 165,58 178,68 Q 165,72 152,70 Z" fill="#f87171" opacity="0.9" />

                {/* Neck & Gold Galpata necklace */}
                <rect x="156" y="94" width="10" height="12" fill="#c68a52" rx="2" />
                <path d="M 154,102 Q 161,107 168,102" stroke="#f59e0b" strokeWidth="2.5" fill="none" />

                {/* Blouse & Mekhela Sador Drape */}
                <path d="M 140,105 Q 160,100 178,110 L 190,165 Q 160,175 135,160 Z" fill="#b91c1c" />
                {/* Muga Silk Sador with traditional Kingkhap motif border */}
                <path d="M 142,108 Q 165,135 150,210 L 195,290 Q 210,190 180,115 Z" fill="url(#saree-drape)" stroke="#d97706" strokeWidth="1" />
                {/* Red Border on Sador */}
                <path d="M 142,108 Q 165,135 150,210" stroke="url(#muga-red-border)" strokeWidth="4" fill="none" />
                <path d="M 150,210 L 195,290" stroke="url(#muga-red-border)" strokeWidth="4" fill="none" />

                {/* Lower Mekhela skirt */}
                <path d="M 140,200 L 130,360 Q 170,370 205,355 L 190,210 Z" fill="url(#saree-drape)" />
                <path d="M 130,352 Q 170,362 205,347" stroke="url(#muga-red-border)" strokeWidth="6" fill="none" />

                {/* Arm gracefully holding tea twig */}
                <path d="M 175,120 Q 205,150 200,185 Q 185,188 178,175" fill="none" stroke="#d4a373" strokeWidth="10" strokeLinecap="round" />
                <circle cx="196" cy="180" r="4" fill="#d4a373" />
                {/* Two leaves and a bud (Duti paat eti kuri) */}
                <path d="M 198,175 Q 210,165 215,172 Q 208,182 198,175 Z" fill="#40916c" />
                <path d="M 200,174 Q 206,160 212,165 Q 207,175 200,174 Z" fill="#52b788" />
              </g>

              {/* Gentle grass base */}
              <ellipse cx="160" cy="370" rx="60" ry="12" fill="#1b4332" opacity="0.4" />
            </svg>

            {/* Cultural descriptive label */}
            <div className="mt-2 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-200/80 shadow-xs text-center">
              <span className="text-[11px] font-bold text-emerald-950">Tea Garden Heritage of Assam</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* ZONE 2 (CENTER): WINDING PATHWAY SVG & BOY STUDENT TRAVELER */}
        {/* ------------------------------------------------------------------ */}
        <div className="absolute inset-x-0 top-0 w-full h-full flex justify-center">
          {/* Central Vertical Pathway SVG spanning entire container */}
          <svg
            className="w-full h-full max-w-2xl overflow-visible pointer-events-none"
            viewBox="0 0 400 6000"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="path-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#40916c" stop-opacity="0.9" />
                <stop offset="25%" stop-color="#52b788" stop-opacity="0.9" />
                <stop offset="50%" stop-color="#e09f3e" stop-opacity="0.9" />
                <stop offset="75%" stop-color="#2d6a4f" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#1b4332" stop-opacity="1" />
              </linearGradient>

              {/* Trail ground border glow */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#2d6a4f" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* Road / trail foundation border */}
            <path
              d="M 200,0 
                 C 280,300 120,600 200,900
                 C 290,1200 90,1500 220,1800
                 C 320,2100 110,2400 190,2700
                 C 300,3000 80,3300 210,3600
                 C 310,3900 100,4200 200,4500
                 C 290,4800 120,5100 220,5400
                 C 300,5700 170,5900 200,6000"
              fill="none"
              stroke="#e2d4be"
              strokeWidth="48"
              strokeLinecap="round"
              filter="url(#glow)"
            />

            {/* Natural stepping trail line (Motion Path) */}
            <path
              ref={pathRef}
              id="travel-path"
              d="M 200,0 
                 C 280,300 120,600 200,900
                 C 290,1200 90,1500 220,1800
                 C 320,2100 110,2400 190,2700
                 C 300,3000 80,3300 210,3600
                 C 310,3900 100,4200 200,4500
                 C 290,4800 120,5100 220,5400
                 C 300,5700 170,5900 200,6000"
              fill="none"
              stroke="url(#path-gradient)"
              strokeWidth="10"
              strokeDasharray="14 10"
              strokeLinecap="round"
            />

            {/* Milestone Checkpoint Nodes on Path */}
            {STAGES.map((s, idx) => {
              const yPos = (s.percent / 100) * 5800 + 100;
              // Approximate sinusoidal x position matching path curve
              const xPos = 200 + Math.sin(idx * 1.5) * 65;
              const isActive = activeStepIndex >= idx;

              return (
                <g key={s.step} className="transition-all duration-300">
                  {/* Outer Pulsing Ring */}
                  <circle
                    cx={xPos}
                    cy={yPos}
                    r={isActive ? 24 : 16}
                    fill={isActive ? '#d97706' : '#cbd5e1'}
                    opacity={isActive ? 0.35 : 0.2}
                  />
                  {/* Inner Node Circle */}
                  <circle
                    cx={xPos}
                    cy={yPos}
                    r={isActive ? 14 : 9}
                    fill={isActive ? '#1b4332' : '#94a3b8'}
                    stroke="#ffffff"
                    strokeWidth="3"
                  />
                  <text
                    x={xPos}
                    y={yPos + 4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {idx + 1}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* THE SCHOOLBOY TRAVELER (Attached to path through GSAP coordinate mapping) */}
          <div
            ref={boyRef}
            className="fixed top-0 left-0 z-30 pointer-events-none -translate-x-1/2 -translate-y-full will-change-transform"
            style={{ width: '80px', height: '120px' }}
          >
            {/* Student Boy Character Vector Illustration */}
            <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-xl overflow-visible">
              <defs>
                <linearGradient id="boy-shirt" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#1d4ed8" />
                  <stop offset="100%" stop-color="#1e40af" />
                </linearGradient>
                <linearGradient id="boy-skin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#f2be8d" />
                  <stop offset="100%" stop-color="#d49a62" />
                </linearGradient>
              </defs>

              {/* Shadow on trail */}
              <ellipse cx="50" cy="142" rx="24" ry="7" fill="#0f172a" opacity="0.35" />

              {/* Backpack on student */}
              <rect x="30" y="55" width="22" height="34" rx="6" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
              <path d="M 32,62 Q 22,78 30,92" stroke="#b45309" strokeWidth="3" fill="none" />

              {/* Legs in dynamic walking pose */}
              <g className="animate-pulse" style={{ animationDuration: '0.8s' }}>
                {/* Left Leg */}
                <path d="M 42,95 L 36,128 L 30,138" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M 28,138 L 40,140" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
                {/* Right Leg */}
                <path d="M 58,95 L 64,124 L 70,138" stroke="#334155" strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M 68,138 L 80,140" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
              </g>

              {/* Torso & School Uniform Shirt */}
              <path d="M 38,50 L 62,50 L 64,96 L 36,96 Z" fill="url(#boy-shirt)" rx="4" />
              <polygon points="50,54 44,50 56,50" fill="#ffffff" />
              {/* School Tie */}
              <polygon points="49,54 51,54 53,74 50,78 47,74" fill="#dc2626" />

              {/* Arms (holding notebook / prototype tablet) */}
              <path d="M 38,55 Q 26,72 36,84" stroke="url(#boy-skin)" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M 62,55 Q 74,70 60,82" stroke="url(#boy-skin)" strokeWidth="6" strokeLinecap="round" fill="none" />
              {/* Notebook in hand */}
              <rect x="54" y="76" width="14" height="18" rx="2" fill="#ffffff" stroke="#2563eb" strokeWidth="1.5" transform="rotate(15, 60, 85)" />

              {/* Head & Face */}
              <circle cx="50" cy="34" r="15" fill="url(#boy-skin)" />
              {/* Smart School Hairstyle */}
              <path d="M 35,30 C 35,16 65,16 65,30 C 60,20 40,20 35,30 Z" fill="#1e1b18" />
              <path d="M 35,32 Q 42,24 54,26" stroke="#1e1b18" strokeWidth="3" fill="none" />
              {/* Cheerful Expression */}
              <circle cx="45" cy="33" r="2" fill="#0f172a" />
              <circle cx="55" cy="33" r="2" fill="#0f172a" />
              <path d="M 47,40 Q 50,44 53,40" stroke="#b45309" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>

            {/* Student Traveler Badge */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-900 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap border border-emerald-600">
              Young Innovator
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* ZONE 3 (RIGHT): IMMERSIVE ASSAM VEGETATION EXTENDING OUTSIDE VIEWPORT */}
        {/* ------------------------------------------------------------------ */}
        <div className="fixed right-0 top-0 bottom-0 pointer-events-none z-10 w-1/3 min-w-[280px] max-w-lg select-none overflow-visible">
          {/* LAYER 1: Distant Misty Himalayan / Patkai Mountains (Slowest Parallax) */}
          <div ref={vegSlowRef} className="absolute right-0 top-12 opacity-40 will-change-transform">
            <svg width="450" height="300" viewBox="0 0 450 300" className="translate-x-16">
              <path d="M 0,300 L 80,140 L 160,220 L 260,90 L 380,240 L 450,180 L 450,300 Z" fill="#7ba3b8" />
              <path d="M 120,300 L 220,180 L 320,270 L 450,160 L 450,300 Z" fill="#9dbfce" opacity="0.6" />
            </svg>
          </div>

          {/* LAYER 2: Rolling Assam Tea Garden Terraces (Medium-Slow) */}
          <div ref={vegMedRef} className="absolute right-0 top-1/3 will-change-transform">
            <svg width="500" height="400" viewBox="0 0 500 400" className="translate-x-20">
              <path d="M 0,400 Q 150,220 350,280 Q 420,300 500,260 L 500,400 Z" fill="#2d6a4f" opacity="0.85" />
              <path d="M 60,400 Q 220,270 420,310 L 500,320 L 500,400 Z" fill="#40916c" opacity="0.9" />
              {/* Tea bush contours */}
              <circle cx="200" cy="280" r="28" fill="#52b788" opacity="0.7" />
              <circle cx="240" cy="275" r="32" fill="#40916c" opacity="0.8" />
              <circle cx="280" cy="290" r="30" fill="#2d6a4f" />
              <circle cx="330" cy="285" r="35" fill="#52b788" opacity="0.8" />
              <circle cx="390" cy="300" r="40" fill="#40916c" />
            </svg>
          </div>

          {/* LAYER 3: Tall Bamboo Grove, Betel Nut Palms & Trees (Medium) */}
          <div className="absolute right-0 top-1/2 -translate-y-24">
            <svg width="420" height="600" viewBox="0 0 420 600" className="translate-x-16">
              {/* Bamboo Stalks */}
              <g stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round">
                <line x1="280" y1="600" x2="290" y2="50" />
                <line x1="320" y1="600" x2="315" y2="20" />
                <line x1="360" y1="600" x2="380" y2="80" />
                <line x1="240" y1="600" x2="230" y2="120" />
              </g>
              {/* Bamboo leaf clusters */}
              <path d="M 285,120 Q 240,100 230,130 Q 270,135 285,120 Z" fill="#52b788" />
              <path d="M 288,180 Q 230,160 220,195 Q 270,200 288,180 Z" fill="#74c69d" />
              <path d="M 320,150 Q 370,120 385,160 Q 340,170 320,150 Z" fill="#40916c" />
            </svg>
          </div>

          {/* LAYER 4: Giant Foreground Tropical & Banana Leaves extending DELIBERATELY OUTSIDE screen (Fastest) */}
          <div ref={vegFastRef} className="absolute -right-16 bottom-0 will-change-transform pointer-events-none">
            <svg width="450" height="550" viewBox="0 0 450 550" className="overflow-visible">
              <defs>
                <linearGradient id="leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#74c69d" />
                  <stop offset="40%" stop-color="#40916c" />
                  <stop offset="100%" stop-color="#1b4332" />
                </linearGradient>
              </defs>
              {/* Huge Elephant-Ear / Giant Taro Leaf overflowing viewport edge */}
              <path
                d="M 200,550 C 150,420 80,320 20,240 C -10,200 60,150 140,180 C 240,220 380,320 450,550 Z"
                fill="url(#leaf-grad)"
                filter="drop-shadow(-8px -4px 18px rgba(15,41,66,0.15))"
              />
              {/* Leaf spine and veins */}
              <path d="M 200,550 Q 120,340 70,200" stroke="#a7f3d0" strokeWidth="4" fill="none" opacity="0.6" />
              <path d="M 120,340 Q 60,320 30,340" stroke="#a7f3d0" strokeWidth="2" fill="none" opacity="0.4" />
              <path d="M 140,380 Q 90,370 50,400" stroke="#a7f3d0" strokeWidth="2" fill="none" opacity="0.4" />
              <path d="M 160,440 Q 110,430 80,470" stroke="#a7f3d0" strokeWidth="2" fill="none" opacity="0.4" />

              {/* Second lush leaf pointing into screen */}
              <path
                d="M 300,550 C 260,380 200,280 120,220 C 100,200 170,170 240,210 C 330,260 420,380 480,550 Z"
                fill="#2d6a4f"
                opacity="0.9"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 12 TIMELINE CHECKPOINT INFORMATION CARDS (Positioned along scroll) */}
      {/* ==================================================================== */}
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pointer-events-none pt-[120px]">
        {STAGES.map((stage, idx) => {
          const isLeft = idx % 2 === 0;
          const isActive = activeStepIndex >= idx;
          const isCurrent = activeStepIndex === idx;
          const Icon = stage.icon;

          return (
            <div
              key={stage.step}
              className="w-full flex items-center justify-between"
              style={{ minHeight: '52vh' }}
            >
              {/* Left Side Slot */}
              <div className={`w-full sm:w-5/12 ${isLeft ? 'block' : 'hidden sm:block sm:invisible'}`}>
                {isLeft && (
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{
                      opacity: isActive ? 1 : 0.25,
                      x: isActive ? 0 : -20,
                      scale: isCurrent ? 1.02 : 0.98
                    }}
                    transition={{ duration: 0.4 }}
                    className={`pointer-events-auto p-6 sm:p-7 rounded-3xl border transition-all ${
                      isCurrent
                        ? 'glass-card border-emerald-500/80 shadow-2xl shadow-emerald-950/10 ring-2 ring-emerald-500/20 bg-white'
                        : 'bg-white/85 border-slate-200/80 shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-2xl font-black text-emerald-800 tracking-tight">
                        {stage.step}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-300/60">
                        {stage.category}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                      {stage.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-amber-700">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{stage.date}</span>
                    </div>

                    <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {stage.desc}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Center Spacer for Pathway */}
              <div className="hidden sm:block w-2/12" />

              {/* Right Side Slot */}
              <div className={`w-full sm:w-5/12 ${!isLeft ? 'block' : 'hidden sm:block sm:invisible'}`}>
                {!isLeft && (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{
                      opacity: isActive ? 1 : 0.25,
                      x: isActive ? 0 : 20,
                      scale: isCurrent ? 1.02 : 0.98
                    }}
                    transition={{ duration: 0.4 }}
                    className={`pointer-events-auto p-6 sm:p-7 rounded-3xl border transition-all ${
                      isCurrent
                        ? 'glass-card border-amber-500/80 shadow-2xl shadow-amber-950/10 ring-2 ring-amber-500/20 bg-white'
                        : 'bg-white/85 border-slate-200/80 shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-2xl font-black text-amber-800 tracking-tight">
                        {stage.step}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100/80 text-amber-900 border border-amber-300/60">
                        {stage.category}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                      {stage.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-emerald-700">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{stage.date}</span>
                    </div>

                    <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {stage.desc}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AssamScrollJourney;
