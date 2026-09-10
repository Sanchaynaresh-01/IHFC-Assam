import React from 'react';
import { motion } from 'framer-motion';
import { Layers, MapPin, Users, Trophy, Award, Clock, Flame, BookOpen } from 'lucide-react';

const stats = [
  { value: '3', label: 'Competition Categories', desc: 'Classes VI-VIII, IX-X, XI-XII', icon: Layers, color: 'text-emerald-700 bg-emerald-100' },
  { value: '33', label: 'Districts of Assam', desc: '100% state-wide school reach', icon: MapPin, color: 'text-amber-700 bg-amber-100' },
  { value: '1,000', label: 'Advanced-Phase Teams', desc: '25 cohorts in deep bootcamp', icon: Users, color: 'text-blue-700 bg-blue-100' },
  { value: '198', label: 'Zonal Teams', desc: '33 districts × 3 categories × 2', icon: Trophy, color: 'text-purple-700 bg-purple-100' },
  { value: '60', label: 'State Finalists', desc: 'Selected for Guwahati grand stage', icon: Award, color: 'text-amber-800 bg-amber-100' },
  { value: '20', label: 'Finalists Per Category', desc: 'Balanced age-group parity', icon: Layers, color: 'text-teal-700 bg-teal-100' },
  { value: '20-Hour', label: 'Initial Online Bootcamp', desc: 'Design thinking & STEM foundations', icon: BookOpen, color: 'text-indigo-700 bg-indigo-100' },
  { value: '48-Hour', label: 'Zonal Hackathons', desc: 'Live build, test & pitch rounds', icon: Flame, color: 'text-rose-700 bg-rose-100' }
];

const StatsSection = () => {
  return (
    <section className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-emerald-800 mb-2">
            Program Impact in Numbers
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Scale, Depth &amp; Regional Reach
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Structured stages engineered to nurture student innovators across every educational district of Assam.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="p-5 sm:p-6 rounded-3xl bg-[#faf8f5] border border-slate-200/90 hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-950/5 transition-all duration-200 text-left group"
              >
                <div className={`p-3 rounded-2xl w-fit mb-4 ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight group-hover:text-emerald-800 transition-colors">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1 leading-snug">
                  {s.label}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {s.desc}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
