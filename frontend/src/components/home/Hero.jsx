import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Trophy, Compass, ShieldCheck, MapPin } from 'lucide-react';
import ihfcLogo from '../../assets/logos/ihfc-logo.svg';
import samagraLogo from '../../assets/logos/samagra-shiksha-assam.svg';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-[#f5f0e6] via-[#faf8f5] to-[#faf8f5]">
      {/* Decorative ambient radial glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-emerald-500/10 via-amber-500/15 to-teal-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-emerald-700/5 blur-3xl rounded-full pointer-events-none" />

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

          {/* Key Eligibility Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold text-slate-600"
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
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
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
