import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Medal, ArrowRight, Sparkles, MapPin, School } from 'lucide-react';
import api from '../../services/api';

const LeaderboardPreview = () => {
  const [topTeams, setTopTeams] = useState([]);
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await api.get('/leaderboard');
        if (res.data && res.data.data) {
          setIsPublic(res.data.data.is_public !== false);
          setTopTeams((res.data.data.entries || []).slice(0, 5));
        }
      } catch (e) {
        console.error('Failed to load leaderboard preview', e);
      }
    };
    fetchTop();
  }, []);

  return (
    <section className="py-20 bg-[#faf8f5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs uppercase font-extrabold tracking-widest text-amber-700 mb-2">
              Live Competition Ranks
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              State Leaderboard Highlights
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Top evaluated student innovator teams leading the state ranks.
            </p>
          </div>

          <Link
            to="/leaderboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-md shrink-0 w-fit"
          >
            <span>Full State Standings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {!isPublic ? (
          <div className="p-8 rounded-3xl bg-amber-50 border border-amber-200 text-center text-amber-900">
            <Trophy className="w-8 h-8 mx-auto text-amber-600 mb-2" />
            <p className="font-semibold text-sm">Official Leaderboard Under Review</p>
            <p className="text-xs text-amber-700 mt-1">The leaderboard will be published after official evaluation by the state jury.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topTeams.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500 bg-white rounded-2xl border border-slate-200">
                Evaluation results loading or currently underway...
              </div>
            ) : (
              topTeams.map((team, idx) => (
                <div
                  key={team.id || team.team_code}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-700 border border-amber-300'
                          : idx === 1
                          ? 'bg-slate-100 text-slate-700 border border-slate-300'
                          : idx === 2
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800'
                      }`}
                    >
                      {idx === 0 ? <Trophy className="w-4 h-4 text-amber-600" /> : `#${idx + 1}`}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm sm:text-base">
                          {team.team_name}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {team.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <School className="w-3 h-3 text-slate-400" />
                          {team.school_name}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {team.district}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <span className="text-xs text-slate-400 sm:mb-0.5 font-medium">Jury Score</span>
                    <span className="text-lg sm:text-xl font-black text-emerald-800">
                      {team.score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default LeaderboardPreview;
