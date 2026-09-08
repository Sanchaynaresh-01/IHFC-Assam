import React from 'react';
import { motion } from 'framer-motion';
import {
  Sprout, Coffee, Waves, CloudRain, HeartPulse, GraduationCap,
  Recycle, Bus, Mountain, Bird, Home, BookOpen, Eye, Zap, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const themes = [
  { name: 'Flood Resilience', desc: 'Early telemetry, flood-safe housing, and water rescue innovations.', icon: Waves, color: 'text-blue-600 bg-blue-50' },
  { name: 'Tea Industry Tech', desc: 'Plucking ergonomics, solar dehydration, and pest scouting.', icon: Coffee, color: 'text-emerald-700 bg-emerald-50' },
  { name: 'Smart Agriculture', desc: 'Hydroponics, irrigation automation, and post-harvest storage.', icon: Sprout, color: 'text-green-600 bg-green-50' },
  { name: 'Climate Adaptation', desc: 'Rainwater harvesting, renewable micro-grids, and soil telemetry.', icon: CloudRain, color: 'text-teal-600 bg-teal-50' },
  { name: 'Rural Healthcare', desc: 'Char area telemedicine, vaccine cold chain, and mobile clinics.', icon: HeartPulse, color: 'text-rose-600 bg-rose-50' },
  { name: 'Digital Education', desc: 'Vernacular learning, low-bandwidth classroom tools, and lab kits.', icon: GraduationCap, color: 'text-indigo-600 bg-indigo-50' },
  { name: 'Waste Management', desc: 'Plastic pyrolysis, water hyacinth utilization, and composting.', icon: Recycle, color: 'text-amber-600 bg-amber-50' },
  { name: 'River Transportation', desc: 'Solar-electric ferries, river navigation sensors, and wharf safety.', icon: Bus, color: 'text-sky-600 bg-sky-50' },
  { name: 'Eco Tourism & Heritage', desc: 'Digital heritage archiving, eco-trails, and homestay tech.', icon: Mountain, color: 'text-emerald-800 bg-emerald-50' },
  { name: 'Biodiversity Protection', desc: 'Kaziranga anti-poaching acoustic monitors and forest sensors.', icon: Bird, color: 'text-lime-700 bg-lime-50' },
  { name: 'Rural Development', desc: 'Bamboo composites, decentralized sanitation, and solar lighting.', icon: Home, color: 'text-orange-700 bg-orange-50' },
  { name: 'Cultural Preservation', desc: 'Textile digitization, indigenous folklore audio, and script learning.', icon: BookOpen, color: 'text-purple-700 bg-purple-50' },
  { name: 'Accessibility Tech', desc: 'Assistive devices for differently-abled students in rural schools.', icon: Eye, color: 'text-blue-800 bg-blue-50' },
  { name: 'Sustainable Technology', desc: 'Zero-waste Eri/Muga silk processing and bio-enzyme fuels.', icon: Zap, color: 'text-yellow-700 bg-yellow-50' }
];

const InnovationThemes = () => {
  return (
    <section className="py-20 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs uppercase font-extrabold tracking-widest text-emerald-800 mb-2">
              Assam Problem Statements
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              14 Priority Innovation Themes
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              Students identify real-world bottlenecks across Assam’s landscape and apply technology to solve them.
            </p>
          </div>

          <Link
            to="/innovations"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <span>Browse Showcased Innovations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {themes.map((t, idx) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (idx % 4) * 0.05 }}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all duration-200 group"
              >
                <div className={`p-3 rounded-xl w-fit mb-3 ${t.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {t.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {t.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InnovationThemes;
