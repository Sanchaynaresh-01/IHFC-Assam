import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import {
  School, Users, PlusCircle, Award, CheckCircle2, Clock,
  Sparkles, Layers, FileText, ChevronRight, X, Loader2, AlertCircle, ArrowRight
} from 'lucide-react';

const SchoolDashboard = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { addToast } = useToast();

  const [school, setSchool] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createTeamOpen, setCreateTeamOpen] = useState(false);

  // New team form state
  const [teamForm, setTeamForm] = useState({
    team_name: '',
    category: 'IX-X',
    mentor_name: '',
    leader_name: '',
    leader_email: '',
    leader_phone: '',
    leader_grade: 'Class X',
    member1_name: '',
    member1_email: '',
    member2_name: '',
    member2_email: ''
  });
  const [submittingTeam, setSubmittingTeam] = useState(false);

  const fetchSchoolData = async () => {
    setLoading(true);
    try {
      const [schoolRes, teamsRes] = await Promise.all([
        api.get('/schools/me'),
        api.get('/schools/my-teams')
      ]);
      setSchool(schoolRes.data.data);
      setTeams(teamsRes.data.data || []);
    } catch (err) {
      console.error('Failed to load school dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolData();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setSubmittingTeam(true);

    const members = [];
    if (teamForm.member1_name) {
      members.push({ name: teamForm.member1_name, email: teamForm.member1_email, grade: teamForm.leader_grade });
    }
    if (teamForm.member2_name) {
      members.push({ name: teamForm.member2_name, email: teamForm.member2_email, grade: teamForm.leader_grade });
    }

    try {
      const payload = {
        team_name: teamForm.team_name,
        category: teamForm.category,
        mentor_name: teamForm.mentor_name || school?.coordinator?.name,
        leader_name: teamForm.leader_name,
        leader_email: teamForm.leader_email,
        leader_phone: teamForm.leader_phone,
        leader_grade: teamForm.leader_grade,
        members
      };

      const res = await api.post('/teams', payload);
      addToast(res.data.message || 'Team formed successfully!', 'success');
      setCreateTeamOpen(false);
      setTeamForm({
        team_name: '',
        category: 'IX-X',
        mentor_name: '',
        leader_name: '',
        leader_email: '',
        leader_phone: '',
        leader_grade: 'Class X',
        member1_name: '',
        member1_email: '',
        member2_name: '',
        member2_email: ''
      });
      fetchSchoolData();
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message || 'Failed to create team.';
      addToast(msg, 'error');
    } finally {
      setSubmittingTeam(false);
    }
  };

  if (loading && !school) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
      </div>
    );
  }

  const isApproved = school?.status === 'approved';

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Top Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                isApproved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
              }`}>
                {school?.status?.toUpperCase()}
              </span>
              <span className="text-xs text-emerald-200">Assam School Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {school?.school_name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-100/80 mt-1">
              <span>District: <strong>{school?.district}</strong></span>
              <span>•</span>
              <span>Official School Code: <strong className="font-mono text-amber-300">{school?.school_code || 'Pending Approval'}</strong></span>
            </div>
          </div>

          <div>
            {isApproved ? (
              <button
                onClick={() => setCreateTeamOpen(true)}
                className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Student Team</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-xs text-amber-200">
                Awaiting Admin School Code Approval before forming teams
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Registered Teams</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {school?.stats?.total_teams ?? teams.length}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Enrolled Students</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {school?.stats?.total_students ?? 0}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Projects Submitted</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {school?.stats?.projects_submitted ?? 0}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Bootcamp Assessments</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {school?.stats?.quiz_attempts ?? 0}
            </div>
          </div>
        </div>

        {/* School Teams List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Participating Student Teams</h2>
              <p className="text-xs text-slate-500 mt-0.5">Teams registered under {school?.school_name}</p>
            </div>
            {isApproved && (
              <button
                onClick={() => setCreateTeamOpen(true)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
              >
                <span>+ Add Team</span>
              </button>
            )}
          </div>

          {teams.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-sm">No teams formed yet.</p>
              <p className="text-xs text-slate-400 mt-1">Click "Create Student Team" to enroll your students.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((t) => (
                <div key={t.id || t._id} className="p-5 rounded-2xl border border-slate-200/90 bg-[#faf8f5] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {t.team_code}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {t.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{t.team_name}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Mentor: <strong>{t.mentor_name || 'Designated School Coordinator'}</strong>
                    </p>

                    {/* Members List */}
                    <div className="mt-4 pt-3 border-t border-slate-200/60">
                      <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Roster</span>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {t.members_detail && t.members_detail.length > 0 ? (
                          t.members_detail.map((m, i) => (
                            <span key={i} className="text-xs px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-medium">
                              {m.full_name} {m.is_leader && '(Leader)'}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">Students registered</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Stage: <strong className="text-slate-700">{t.competition_stage || 'online_bootcamp'}</strong>
                    </span>
                    <span className="font-bold text-emerald-800">
                      {t.project ? 'Project Submitted' : 'Submission Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal: Create Team */}
        {createTeamOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Form New Student Team</h3>
                  <p className="text-xs text-slate-500">School association is automatically and immutably attached.</p>
                </div>
                <button onClick={() => setCreateTeamOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Team Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kaziranga Eco Tech"
                    value={teamForm.team_name}
                    onChange={(e) => setTeamForm({ ...teamForm, team_name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={teamForm.category}
                    onChange={(e) => setTeamForm({ ...teamForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                  >
                    <option value="VI-VIII">Category 1: Classes VI–VIII</option>
                    <option value="IX-X">Category 2: Classes IX–X</option>
                    <option value="XI-XII">Category 3: Classes XI–XII</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase text-slate-600 mb-2">Team Leader (Student)</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="Leader Student Full Name *"
                      value={teamForm.leader_name}
                      onChange={(e) => setTeamForm({ ...teamForm, leader_name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Leader Student Email *"
                      value={teamForm.leader_email}
                      onChange={(e) => setTeamForm({ ...teamForm, leader_email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase text-slate-600 mb-2">Teammates (Optional)</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Member 1 Name"
                      value={teamForm.member1_name}
                      onChange={(e) => setTeamForm({ ...teamForm, member1_name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Member 2 Name"
                      value={teamForm.member2_name}
                      onChange={(e) => setTeamForm({ ...teamForm, member2_name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingTeam}
                  className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-4"
                >
                  {submittingTeam ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Team...</span>
                    </>
                  ) : (
                    <span>Confirm &amp; Register Team</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SchoolDashboard;
