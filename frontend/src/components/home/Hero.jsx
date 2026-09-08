import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Trophy, Compass, ShieldCheck, MapPin, Leaf, Shield } from 'lucide-react';
import ihfcLogo from '../../assets/logos/ihfc-logo.svg';
import samagraLogo from '../../assets/logos/samagra-shiksha-assam.svg';

const Hero = () => {
  return (
    <section className="relative pt-28 pb-24 md:pt-36 md:pb-32 overflow-hidden bg-gradient-to-b from-[#f5f0e6] via-[#faf8f5] to-[#faf8f5]">
      {/* Decorative ambient radial glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-emerald-500/10 via-amber-500/15 to-teal-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-emerald-700/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-40 left-10 w-96 h-96 bg-amber-700/5 blur-3xl rounded-full pointer-events-none" />

      {/* ------------------------------------------------------------------ */}
      {/* LEFT FLANK (DESKTOP): ASSAMESE TEA-GARDEN LADY IN MEKHELA SADOR */}
      {/* ------------------------------------------------------------------ */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        className="hidden xl:flex flex-col items-center absolute left-3 2xl:left-12 bottom-10 2xl:bottom-14 z-20 pointer-events-auto select-none w-52 2xl:w-60"
      >
        <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-105">
          {/* Subtle glow behind figure */}
          <div className="absolute -inset-4 bg-emerald-500/15 blur-2xl rounded-full" />

          <svg viewBox="0 0 300 450" className="w-full h-auto drop-shadow-2xl overflow-visible">
            <defs>
              <linearGradient id="hero-tea-basket" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id="hero-saree-drape" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fdf4dc" />
                <stop offset="50%" stopColor="#f5e6c4" />
                <stop offset="100%" stopColor="#e2c892" />
              </linearGradient>
              <linearGradient id="hero-muga-red-border" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
            </defs>

            {/* Bamboo basket (Tokari) on her back */}
            <g id="hero-tea-basket-group" className="animate-pulse" style={{ animationDuration: '5s' }}>
              <ellipse cx="110" cy="180" rx="42" ry="58" fill="url(#hero-tea-basket)" stroke="#572208" strokeWidth="3" transform="rotate(-15, 110, 180)" />
              <path d="M 80,140 Q 110,180 140,220 M 70,180 Q 110,190 150,180 M 80,210 Q 110,210 140,160" stroke="#fcd34d" strokeWidth="1.5" opacity="0.6" />
              {/* Plucked tea leaves inside basket */}
              <path d="M 75,130 Q 95,115 115,125 Q 135,110 150,135 Q 130,150 90,145 Z" fill="#2d6a4f" />
              <circle cx="100" cy="125" r="5" fill="#52b788" />
              <circle cx="125" cy="120" r="6" fill="#74c69d" />
              <circle cx="112" cy="132" r="4.5" fill="#40916c" />
              {/* Strap across shoulder */}
              <path d="M 95,145 C 105,105 130,70 155,75" fill="none" stroke="#78350f" strokeWidth="4.5" strokeLinecap="round" />
            </g>

            {/* Lady Character in traditional Mekhela Sador */}
            <g id="hero-woman-body">
              {/* Hair bun with red floral adornment */}
              <circle cx="175" cy="72" r="18" fill="#1e1b18" />
              <circle cx="186" cy="65" r="4" fill="#ef4444" />
              {/* Face */}
              <ellipse cx="160" cy="78" rx="16" ry="18" fill="#d4a373" />
              {/* Traditional red forehead bindi */}
              <circle cx="150" cy="74" r="2.5" fill="#dc2626" />
              <path d="M 148,65 Q 165,58 178,68 Q 165,72 152,70 Z" fill="#f87171" opacity="0.9" />
              {/* Neck & gold choker */}
              <rect x="156" y="94" width="10" height="12" fill="#c68a52" rx="2" />
              <path d="M 154,102 Q 161,107 168,102" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
              {/* Red blouse (Riha) */}
              <path d="M 140,105 Q 160,100 178,110 L 190,165 Q 160,175 135,160 Z" fill="#b91c1c" />
              {/* Sador (Muga silk drape over shoulder) */}
              <path d="M 142,108 Q 165,135 150,210 L 195,290 Q 210,190 180,115 Z" fill="url(#hero-saree-drape)" stroke="#d97706" strokeWidth="1" />
              {/* Characteristic red Kingkhap borders */}
              <path d="M 142,108 Q 165,135 150,210" stroke="url(#hero-muga-red-border)" strokeWidth="4" fill="none" />
              <path d="M 150,210 L 195,290" stroke="url(#hero-muga-red-border)" strokeWidth="4" fill="none" />
              {/* Mekhela (Pleated skirt) */}
              <path d="M 140,200 L 130,360 Q 170,370 205,355 L 190,210 Z" fill="url(#hero-saree-drape)" />
              <path d="M 130,352 Q 170,362 205,347" stroke="url(#hero-muga-red-border)" strokeWidth="6" fill="none" />
              {/* Arm reaching forward to pluck two leaves and a bud */}
              <path d="M 175,120 Q 205,150 200,185 Q 185,188 178,175" fill="none" stroke="#d4a373" strokeWidth="10" strokeLinecap="round" />
              <circle cx="196" cy="180" r="4" fill="#d4a373" />
              {/* Fresh tea leaves in hand */}
              <path d="M 198,175 Q 210,165 215,172 Q 208,182 198,175 Z" fill="#40916c" />
              <path d="M 200,174 Q 206,160 212,165 Q 207,175 200,174 Z" fill="#52b788" />
            </g>
            {/* Ground shadow */}
            <ellipse cx="160" cy="370" rx="60" ry="12" fill="#1b4332" opacity="0.35" />
          </svg>

          {/* Heritage Tag */}
          <div className="mt-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-300 shadow-md text-center flex items-center gap-1.5 justify-center">
            <Leaf className="w-3 h-3 text-emerald-700" />
            <span className="text-[11px] font-extrabold text-emerald-950">Tea Garden Heritage</span>
          </div>
        </div>
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* RIGHT FLANK (DESKTOP): AUTHENTIC KAZIRANGA ONE-HORNED RHINOCEROS */}
      {/* ------------------------------------------------------------------ */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        className="hidden xl:flex flex-col items-center absolute right-3 2xl:right-10 bottom-10 2xl:bottom-14 z-20 pointer-events-auto select-none w-68 2xl:w-76"
      >
        <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-105">
          {/* Subtle glow */}
          <div className="absolute -inset-4 bg-emerald-600/15 blur-2xl rounded-full" />

          {/* Tea Garden foliage background for Rhino */}
          <svg viewBox="0 0 380 270" className="w-full h-auto drop-shadow-2xl overflow-visible">
            <defs>
              <linearGradient id="hero-rhino-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="40%" stopColor="#475569" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>
              <linearGradient id="hero-rhino-plate-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#526173" />
                <stop offset="60%" stopColor="#3d4957" />
                <stop offset="100%" stopColor="#252f3d" />
              </linearGradient>
              <linearGradient id="hero-horn-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#451a03" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id="hero-hill-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2d6a4f" />
                <stop offset="100%" stopColor="#1b4332" />
              </linearGradient>
            </defs>

            {/* Rolling backdrop tea bushes & hills */}
            <g id="hero-rhino-env" opacity="0.85">
              <path d="M 40,240 Q 140,160 280,190 Q 340,205 380,180 L 380,250 L 40,250 Z" fill="url(#hero-hill-grad)" opacity="0.5" />
              <circle cx="160" cy="190" r="22" fill="#40916c" opacity="0.6" />
              <circle cx="200" cy="185" r="26" fill="#2d6a4f" opacity="0.7" />
              <circle cx="240" cy="195" r="24" fill="#52b788" opacity="0.6" />
            </g>

            {/* Mud & grass ground shadow */}
            <ellipse cx="200" cy="242" rx="145" ry="18" fill="#1b4332" opacity="0.35" />

            {/* THE ONE-HORNED INDIAN RHINOCEROS */}
            <g id="hero-rhino-character">
              {/* Back legs (Far side) */}
              <path d="M 115,165 L 112,238 L 132,238 L 134,180 Z" fill="#2d3748" />
              <path d="M 255,170 L 252,238 L 270,238 L 273,180 Z" fill="#2d3748" />

              {/* Tail with tuft */}
              <path d="M 88,145 Q 75,165 78,195" stroke="#334155" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M 77,190 Q 74,204 76,210" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />

              {/* Heavy Quadruped Torso & Pelvic Armor Shield */}
              <path
                d="M 88,140 C 85,100 130,90 190,95 C 250,85 290,100 305,130 C 315,150 305,190 290,200 C 230,210 150,210 95,185 C 85,170 87,150 88,140 Z"
                fill="url(#hero-rhino-body-grad)"
              />

              {/* Characteristic Indian Rhino Armor Skin Folds */}
              {/* Scapular / Shoulder Groove */}
              <path d="M 235,95 C 225,125 225,170 240,200" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.85" />
              <path d="M 238,97 C 228,127 228,170 243,198" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" />

              {/* Flank / Rib Armor Fold */}
              <path d="M 175,97 C 165,130 168,170 180,200" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.75" />

              {/* Pelvic / Rump Fold */}
              <path d="M 125,105 C 115,135 118,165 130,190" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.7" />

              {/* Armor Tubercles (Characteristic bumpy texture) */}
              <circle cx="105" cy="125" r="2.5" fill="#1e293b" opacity="0.6" />
              <circle cx="115" cy="135" r="3" fill="#1e293b" opacity="0.6" />
              <circle cx="108" cy="147" r="2.5" fill="#1e293b" opacity="0.6" />
              <circle cx="255" cy="120" r="2.5" fill="#1e293b" opacity="0.6" />
              <circle cx="265" cy="130" r="3" fill="#1e293b" opacity="0.6" />

              {/* Near Front Leg with 3 hooves */}
              <path d="M 275,165 L 270,242 L 292,242 L 298,175 Z" fill="url(#hero-rhino-plate-grad)" stroke="#1e293b" strokeWidth="2" />
              <circle cx="274" cy="242" r="3.5" fill="#0f172a" />
              <circle cx="281" cy="242" r="4" fill="#0f172a" />
              <circle cx="288" cy="242" r="3.5" fill="#0f172a" />

              {/* Near Hind Leg with 3 hooves */}
              <path d="M 130,160 L 125,242 L 148,242 L 152,175 Z" fill="url(#hero-rhino-plate-grad)" stroke="#1e293b" strokeWidth="2" />
              <circle cx="130" cy="242" r="3.5" fill="#0f172a" />
              <circle cx="137" cy="242" r="4" fill="#0f172a" />
              <circle cx="144" cy="242" r="3.5" fill="#0f172a" />

              {/* Head & Neck */}
              <g id="hero-rhino-head">
                <path d="M 270,115 C 295,120 315,140 325,165 C 305,185 280,180 260,170 Z" fill="url(#hero-rhino-body-grad)" />
                <path d="M 280,140 Q 295,160 285,177" stroke="#1e293b" strokeWidth="4" fill="none" opacity="0.8" />

                {/* Head Silhouette */}
                <path
                  d="M 300,125 C 330,130 355,155 365,180 C 355,195 330,200 305,185 C 295,165 290,140 300,125 Z"
                  fill="url(#hero-rhino-plate-grad)"
                  stroke="#1e293b"
                  strokeWidth="2"
                />

                {/* Small intelligent eye */}
                <circle cx="320" cy="148" r="4.5" fill="#0f172a" />
                <circle cx="321" cy="147" r="1.5" fill="#f8fafc" />
                <path d="M 314,142 Q 320,139 326,143" stroke="#0f172a" strokeWidth="1.5" fill="none" />

                {/* Ear with tuft */}
                <path d="M 298,118 Q 302,96 309,102 Q 312,112 304,124 Z" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />

                {/* Single Iconic Indian Rhinoceros Horn */}
                <path
                  d="M 350,158 C 362,142 368,110 362,88 C 352,108 344,136 342,160 Z"
                  fill="url(#hero-horn-grad)"
                  stroke="#1e293b"
                  strokeWidth="2"
                />

                {/* Prehensile upper lip & wide muzzle */}
                <path d="M 358,185 Q 365,190 358,196 Q 346,197 342,190 Z" fill="#334155" stroke="#1e293b" strokeWidth="1" />
                <ellipse cx="355" cy="186" rx="2" ry="3" fill="#0f172a" />
              </g>
            </g>

            {/* Fresh Kaziranga elephant grass blades */}
            <g id="hero-rhino-grass" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round">
              <path d="M 120,245 Q 123,225 118,215" />
              <path d="M 124,245 Q 130,228 135,218" stroke="#52b788" />
              <path d="M 265,245 Q 268,222 262,212" />
              <path d="M 272,245 Q 278,226 283,214" stroke="#74c69d" />
              <path d="M 345,245 Q 352,215 360,200" stroke="#52b788" strokeWidth="3" />
              <path d="M 355,245 Q 362,220 370,205" stroke="#40916c" strokeWidth="3" />
            </g>
          </svg>

          {/* Heritage Tag */}
          <div className="mt-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-300 shadow-md text-center flex items-center gap-1.5 justify-center">
            <Shield className="w-3 h-3 text-emerald-700" />
            <span className="text-[11px] font-extrabold text-emerald-950">One-Horned Rhino • Kaziranga</span>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Official Partnership Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/90 border border-slate-200/90 shadow-sm mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700">
              Joint Initiative of <strong className="text-emerald-900 font-bold">IHFC IIT Delhi</strong> &amp; <strong className="text-amber-800 font-bold">Samagra Shiksha, Assam</strong>
            </span>
          </motion.div>

          {/* Main Title & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-amber-700 mb-3">
              Student Innovation Challenge
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08]">
              ASSAM FUTURE <br />
              <span className="bg-gradient-to-r from-emerald-800 via-teal-700 to-amber-600 bg-clip-text text-transparent">
                INNOVATION PROGRAM
              </span>
            </h1>
          </motion.div>

          {/* Tagline & Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            A state-wide innovation journey empowering students from <strong className="text-slate-900 font-semibold">Classes VI–XII</strong> across all 33 districts of Assam to identify real problems, develop practical solutions, build prototypes, learn from experts, and showcase ideas for a stronger Assam.
          </motion.p>

          {/* Cultural & Wildlife Recognition Pill Strip (Visible on all viewports, especially mobile & tablet) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.23 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300/80 shadow-xs">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Assam Tea Heritage</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300/80 shadow-xs">
              <Shield className="w-3.5 h-3.5 text-slate-700" />
              <span>Kaziranga One-Horned Rhino</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300/80 shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>33 Assam Districts</span>
            </span>
          </motion.div>

          {/* Key Eligibility Category Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold text-slate-600"
          >
            <span className="px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300/80">
              Category 1: Classes VI–VIII
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300/80">
              Category 2: Classes IX–X
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-100/90 text-blue-900 border border-blue-300/80">
              Category 3: Classes XI–XII
            </span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link
              to="/register/school"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-950/20 hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2.5 group"
            >
              <span>Register Your School</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#journey"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-300 shadow-sm hover:border-slate-400 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>Explore the Journey</span>
            </a>

            <Link
              to="/leaderboard"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-sm sm:text-base border border-amber-200 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-700" />
              <span>State Leaderboard</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

