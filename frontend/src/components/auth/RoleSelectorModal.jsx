import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, School, GraduationCap, UserCheck, X, ArrowRight, KeyRound } from 'lucide-react';

const RoleSelectorModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const roles = [
    {
      id: 'student',
      title: 'Student / Team',
      desc: 'Participate, take the assessment, and submit your innovation project.',
      path: '/login/student',
      registerPath: '/register/student',
      icon: GraduationCap,
      color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
      badge: 'Classes VI–XII',
      demo: 'student@afip.demo / Student@123'
    },
    {
      id: 'school',
      title: 'School / Mentor',
      desc: 'Register school, onboard mentors, and manage participating student teams.',
      path: '/login/school',
      registerPath: '/register/school',
      icon: School,
      color: 'bg-amber-500/10 text-amber-700 border-amber-200',
      badge: 'Official Portal',
      demo: 'school@afip.demo / School@123'
    },
    {
      id: 'evaluator',
      title: 'Evaluator / Jury',
      desc: 'Review and evaluate assigned student prototype submissions with the 7-criteria rubric.',
      path: '/login/evaluator',
      registerPath: '/register/evaluator',
      icon: UserCheck,
      color: 'bg-blue-500/10 text-blue-700 border-blue-200',
      badge: 'Expert Panel',
      demo: 'evaluator@afip.demo / Evaluator@123'
    },
    {
      id: 'admin',
      title: 'Administrator',
      desc: 'State program governance, school approvals, assignments, and leaderboard controls.',
      path: '/login/admin',
      registerPath: null,
      icon: ShieldCheck,
      color: 'bg-slate-500/10 text-slate-800 border-slate-200',
      badge: 'State Directorate',
      demo: 'admin@afip.demo / Admin@123'
    }
  ];

  const handleSelect = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-amber-300 text-xs font-semibold tracking-wider uppercase mb-1">
              Assam Future Innovation Program
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Select Your Portal
            </h2>
            <p className="text-emerald-100/80 text-sm mt-1">
              Choose your role to access login or new registration.
            </p>
          </div>

          {/* Role Cards Grid */}
          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.id}
                  className="flex flex-col justify-between p-5 rounded-2xl border border-slate-200/90 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-950/5 transition-all duration-200 group bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2.5 rounded-xl border ${r.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {r.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-800">
                      {r.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {r.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => handleSelect(r.path)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {r.registerPath && (
                      <button
                        onClick={() => handleSelect(r.registerPath)}
                        className="py-2 px-3 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-xs font-semibold text-center transition-all cursor-pointer"
                      >
                        Register
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Demo Accounts Helper Bar */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
            <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-slate-800">Testing accounts: </span>
              <span>All roles have quick one-click autofill on their respective login pages.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RoleSelectorModal;
