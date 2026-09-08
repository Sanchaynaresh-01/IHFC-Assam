import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, School, Users, Laptop, Brain, Rocket, Award, ShieldAlert } from 'lucide-react';

const funnelSteps = [
  { label: 'Schools Registered', count: 'All 33 Districts', width: 'w-full', bg: 'bg-emerald-900', text: 'text-white' },
  { label: 'Student Teams Formed', count: 'State-wide Roster', width: 'w-[92%]', bg: 'bg-emerald-800', text: 'text-emerald-50' },
  { label: '20-Hour Online Bootcamp', count: 'Foundational STEM', width: 'w-[84%]', bg: 'bg-teal-800', text: 'text-teal-50' },
  { label: 'MCQ Knowledge Assessment', count: 'State Benchmark', width: 'w-[76%]', bg: 'bg-teal-700', text: 'text-white' },
  { label: 'Top 1,000 Teams Shortlisted', count: '25 Advanced Cohorts', width: 'w-[68%]', bg: 'bg-amber-600', text: 'text-white' },
  { label: 'Advanced 30-Day Bootcamp', count: 'Hardware & Code', width: 'w-[60%]', bg: 'bg-amber-700', text: 'text-amber-50' },
  { label: 'Coding / Technical Challenge', count: 'Implementation Test', width: 'w-[52%]', bg: 'bg-amber-800', text: 'text-white' },
  { label: '198 Zonal Qualifier Teams', count: '33 Dist × 3 Cat × 2', width: 'w-[44%]', bg: 'bg-blue-800', text: 'text-blue-50' },
  { label: '48-Hour Zonal Hackathon', count: 'Live Divisional Rounds', width: 'w-[36%]', bg: 'bg-indigo-800', text: 'text-white' },
  { label: '60 State Finalists', count: '20 Teams Per Category', width: 'w-[28%]', bg: 'bg-purple-800', text: 'text-purple-50' },
  { label: 'State-Level Grand Final', count: 'Champions & Awards', width: 'w-[20%]', bg: 'bg-gradient-to-r from-amber-500 to-amber-600', text: 'text-slate-950 font-extrabold' }
];

const FunnelVisualization = () => {
  return (
    <section className="py-20 bg-[#f7f4ed] border-y border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-bold mb-3 border border-emerald-300/70">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Merit-Driven Progressive Selection</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          The AFIP Competition Funnel
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto mt-2">
          From broad grassroot participation to intense divisional hackathons and the state grand finale.
        </p>

        {/* Funnel Stack */}
        <div className="mt-12 flex flex-col items-center gap-2.5">
          {funnelSteps.map((step, idx) => (
            <React.Fragment key={step.label}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className={`${step.width} min-w-[260px] ${step.bg} ${step.text} py-3 px-4 rounded-xl shadow-md flex items-center justify-between transition-transform hover:scale-[1.01]`}
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-black">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-bold tracking-tight">
                    {step.label}
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs font-semibold opacity-90 px-2 py-0.5 rounded bg-black/15">
                  {step.count}
                </span>
              </motion.div>
              {idx < funnelSteps.length - 1 && (
                <ChevronDown className="w-4 h-4 text-slate-400 my--1 opacity-60" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FunnelVisualization;
