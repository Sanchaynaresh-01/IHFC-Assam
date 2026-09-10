import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Sparkles, Sprout, Filter, ExternalLink, School, MapPin, Tag, Layers, Search, Loader2 } from 'lucide-react';
import api from '../services/api';

const THEMES = [
  'All Themes', 'Flood Resilience', 'Tea Technology', 'Smart Agriculture',
  'Biodiversity', 'Sustainable Technology', 'Healthcare', 'Rural Development',
  'Waste Management', 'Cultural Preservation', 'Accessibility'
];

const Innovations = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [themeFilter, setThemeFilter] = useState('All Themes');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchInnovations = async () => {
      setLoading(true);
      try {
        let url = '/innovations?';
        if (themeFilter !== 'All Themes') url += `theme=${themeFilter}&`;
        const res = await api.get(url);
        if (res.data && res.data.data) {
          setProjects(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load innovations', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInnovations();
  }, [themeFilter]);

  const filtered = projects.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.team_name && p.team_name.toLowerCase().includes(q)) ||
      (p.school_name && p.school_name.toLowerCase().includes(q)) ||
      (p.district && p.district.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Header */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-4 border border-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Public Student Showcase</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Assam Student Innovation Gallery
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
            Discover functioning prototypes and ideas designed by young school students to address regional challenges across Assam.
          </p>
        </section>

        {/* Filter Toolbar */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {THEMES.slice(0, 6).map((t) => (
                <button
                  key={t}
                  onClick={() => setThemeFilter(t)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    themeFilter === t
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-800 focus:outline-emerald-600"
              />
            </div>
          </div>
        </section>

        {/* Project Showcase Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
              <p className="text-xs font-semibold text-slate-500 mt-2">Loading showcased student inventions...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <p className="text-sm font-semibold text-slate-600">No projects found for the selected filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((proj) => (
                <div
                  key={proj.id || proj._id}
                  className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-emerald-500/50 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                        {proj.theme}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {proj.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {proj.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                      {proj.problem_statement}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{proj.team_name}</span>
                      <span className="text-emerald-800 font-semibold">{proj.prototype_status || 'Working Prototype'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px]">
                      <School className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{proj.school_name}</span>
                      <span>•</span>
                      <span>{proj.district}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Innovations;
