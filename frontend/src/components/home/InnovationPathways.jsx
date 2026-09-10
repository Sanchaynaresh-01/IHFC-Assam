import React from 'react';
import { Sparkles, FileText, ShieldCheck, Box, Rocket, Users, Globe, ArrowUpRight } from 'lucide-react';
import pathwaysImg from '../../assets/illustrations/innovation-acceleration-pathways.png';

const PATHWAY_HIGHLIGHTS = [
  {
    icon: FileText,
    title: 'Research & Publication',
    desc: 'Guidance for documentation and research opportunities in scientific literature.',
    color: 'from-pink-500/10 to-rose-500/10 border-rose-200 text-rose-700',
    iconBg: 'bg-rose-50 text-rose-600',
  },
  {
    icon: ShieldCheck,
    title: 'Intellectual Property & Patent',
    desc: 'Orientation and structured support for patent filing and IP protection pathways.',
    color: 'from-amber-500/10 to-orange-500/10 border-orange-200 text-orange-700',
    iconBg: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Box,
    title: 'Product Development',
    desc: 'Comprehensive engineering support to transition from working prototype to scalable product.',
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-700',
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Rocket,
    title: 'Incubation & Entrepreneurship',
    desc: 'Direct connection to IIT Delhi incubation hubs, startup ecosystems, and innovation partners.',
    color: 'from-green-500/10 to-emerald-500/10 border-green-200 text-green-700',
    iconBg: 'bg-green-50 text-green-600',
  },
  {
    icon: Users,
    title: 'Internship & Experiential Learning',
    desc: 'Exclusive opportunities for technical internships and real-world exposure with industry leaders.',
    color: 'from-purple-500/10 to-indigo-500/10 border-purple-200 text-purple-700',
    iconBg: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Globe,
    title: 'National & International Showcase',
    desc: 'Targeted preparation for prestigious global platforms including UN AI for Good.',
    color: 'from-blue-500/10 to-sky-500/10 border-blue-200 text-blue-700',
    iconBg: 'bg-blue-50 text-blue-600',
  },
];

const InnovationPathways = () => {
  return (
    <section className="py-20 bg-[#faf8f5] border-b border-slate-200/80 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-blue-500/5 blur-3xl rounded-full pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-900 text-xs font-bold border border-blue-200 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Beyond the Competition</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Innovation Acceleration Pathways
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg leading-relaxed">
            For selected high-potential student projects, AFIP provides structured pathways to take grassroots ideas into tangible research, patents, and real-world ventures.
          </p>
        </div>

        {/* Primary Infographic Showcase */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white p-3 sm:p-5 md:p-6 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 transition-all duration-300 hover:shadow-2xl">
            <img
              src={pathwaysImg}
              alt="Innovation Acceleration Pathways for Selected High-Potential Student Projects"
              className="w-full h-auto rounded-2xl object-contain"
              loading="lazy"
            />
          </div>
        </div>

        {/* 6 Supporting Pathway Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {PATHWAY_HIGHLIGHTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center mb-3.5 transition-transform group-hover:scale-110`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-emerald-700 transition-colors">
                  <span>Pathway 0{idx + 1}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InnovationPathways;
