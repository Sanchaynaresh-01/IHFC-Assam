import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import {
  ShieldCheck, School, Users, UserCheck, Trophy, Settings, FileText,
  Activity, Search, Filter, CheckCircle2, XCircle, AlertCircle, Loader2,
  Clock, Plus, ToggleLeft, ToggleRight, Sparkles, MapPin, Building
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Schools list state
  const [schools, setSchools] = useState([]);
  const [schoolStatusFilter, setSchoolStatusFilter] = useState('all');
  const [schoolSearch, setSchoolSearch] = useState('');

  // Evaluators list state
  const [evaluators, setEvaluators] = useState([]);

  // Projects list state
  const [projects, setProjects] = useState([]);

  // Assignment Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedEvaluator, setSelectedEvaluator] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.data);
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  const fetchSchools = async () => {
    try {
      let url = `/admin/schools?status=${schoolStatusFilter}&search=${schoolSearch}`;
      const res = await api.get(url);
      setSchools(res.data.data || []);
    } catch (err) {
      console.error('Failed to load schools', err);
    }
  };

  const fetchEvaluators = async () => {
    try {
      const res = await api.get('/admin/evaluators');
      setEvaluators(res.data.data || []);
    } catch (err) {
      console.error('Failed to load evaluators', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get('/admin/projects');
      setProjects(res.data.data || []);
    } catch (err) {
      console.error('Failed to load projects', err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await api.get('/admin/audit-logs');
      setAuditLogs(res.data.data || []);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    }
  };

  const reloadAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchSchools(),
      fetchEvaluators(),
      fetchProjects(),
      fetchAuditLogs()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    reloadAll();
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [schoolStatusFilter, schoolSearch]);

  const handleUpdateSchoolStatus = async (schoolId, newStatus) => {
    try {
      const res = await api.patch(`/admin/schools/${schoolId}/status`, { status: newStatus });
      addToast(res.data.message || `School status set to ${newStatus}`, 'success');
      fetchSchools();
      fetchStats();
    } catch (err) {
      addToast(err.response?.data?.error?.message || 'Update failed', 'error');
    }
  };

  const handleUpdateEvaluatorStatus = async (evalId, newStatus) => {
    try {
      const res = await api.patch(`/admin/evaluators/${evalId}/status`, { status: newStatus });
      addToast(res.data.message || `Evaluator set to ${newStatus}`, 'success');
      fetchEvaluators();
      fetchStats();
    } catch (err) {
      addToast(err.response?.data?.error?.message || 'Update failed', 'error');
    }
  };

  const handleAssignProject = async (e) => {
    e.preventDefault();
    if (!selectedProject || !selectedEvaluator) return;
    setAssigning(true);
    try {
      await api.post('/admin/assignments', {
        project_id: selectedProject,
        evaluator_id: selectedEvaluator
      });
      addToast('Project assigned to evaluator successfully!', 'success');
      setAssignModalOpen(false);
      reloadAll();
    } catch (err) {
      addToast(err.response?.data?.error?.message || 'Assignment failed', 'error');
    } finally {
      setAssigning(false);
    }
  };

  const handleUpdateStage = async (newStage) => {
    try {
      await api.post('/admin/stage', { stage: newStage });
      addToast(`Active competition stage updated to '${newStage}'`, 'success');
      fetchStats();
    } catch (err) {
      addToast('Failed to update stage', 'error');
    }
  };

  const handleToggleLeaderboard = async () => {
    const current = stats?.leaderboard_public ?? true;
    try {
      await api.patch('/admin/leaderboard-visibility', { is_public: !current });
      addToast(`Leaderboard is now ${!current ? 'PUBLIC' : 'HIDDEN'}`, 'info');
      fetchStats();
    } catch (err) {
      addToast('Failed to toggle leaderboard visibility', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Admin Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
                State Directorate
              </span>
              <span className="text-xs text-slate-300">Central Control Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Assam Future Innovation Program Administration
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Live district monitoring, approvals, jury allocation, and competition phase governance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAssignModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Assign Project to Jury</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-slate-200 mb-8 scrollbar-none">
          {[
            { id: 'overview', label: 'Program Overview', icon: Activity },
            { id: 'schools', label: `Schools (${stats?.pending_schools ? `${stats.pending_schools} Pending` : stats?.total_schools || 0})`, icon: School },
            { id: 'evaluators', label: `Evaluators (${evaluators.length})`, icon: UserCheck },
            { id: 'projects', label: `Submissions (${projects.length})`, icon: FileText },
            { id: 'settings', label: 'Stages & Governance', icon: Settings },
            { id: 'audit', label: 'Audit Trail', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Total Schools</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {stats?.total_schools || 0}
                </div>
                <div className="text-[11px] text-amber-700 font-bold mt-1">
                  {stats?.pending_schools || 0} pending approval
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Registered Teams</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {stats?.total_teams || 0}
                </div>
                <div className="text-[11px] text-emerald-700 font-bold mt-1">
                  {stats?.total_students || 0} students enrolled
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Project Proposals</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {stats?.projects_submitted || 0}
                </div>
                <div className="text-[11px] text-blue-700 font-bold mt-1">
                  {stats?.completed_evaluations || 0} evaluated
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Approved Evaluators</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {stats?.approved_evaluators || 0}
                </div>
                <div className="text-[11px] text-purple-700 font-bold mt-1">
                  {stats?.pending_evaluators || 0} pending review
                </div>
              </div>
            </div>

            {/* Category and District Visualizers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Breakdown */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4">Teams by Competition Category</h3>
                <div className="space-y-4">
                  {[
                    { cat: 'VI-VIII', label: 'Category 1 (Classes VI–VIII)', count: stats?.charts?.teams_by_category?.['VI-VIII'] || 0, color: 'bg-emerald-600' },
                    { cat: 'IX-X', label: 'Category 2 (Classes IX–X)', count: stats?.charts?.teams_by_category?.['IX-X'] || 0, color: 'bg-amber-500' },
                    { cat: 'XI-XII', label: 'Category 3 (Classes XI–XII)', count: stats?.charts?.teams_by_category?.['XI-XII'] || 0, color: 'bg-blue-600' },
                  ].map((c) => (
                    <div key={c.cat}>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>{c.label}</span>
                        <span>{c.count} teams</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${c.color} rounded-full`}
                          style={{ width: `${Math.min(100, (c.count / Math.max(1, stats?.total_teams || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* District Distribution Overview */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4">Schools Represented Across Assam</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-2">
                  {stats?.charts?.schools_by_district && Object.entries(stats.charts.schools_by_district).map(([dist, num]) => (
                    <div key={dist} className="p-2.5 rounded-xl bg-[#faf8f5] border border-slate-200 text-xs flex items-center justify-between">
                      <span className="font-semibold text-slate-700 truncate">{dist}</span>
                      <span className="font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">
                        {num}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCHOOL MANAGEMENT */}
        {activeTab === 'schools' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">School Applications &amp; Registry</h2>
                <p className="text-xs text-slate-500">Review institutional registrations and grant unique School Codes.</p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={schoolStatusFilter}
                  onChange={(e) => setSchoolStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <input
                  type="text"
                  placeholder="Search schools..."
                  value={schoolSearch}
                  onChange={(e) => setSchoolSearch(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 w-48"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {schools.map((sch) => (
                <div key={sch.id || sch._id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{sch.school_name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        sch.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sch.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>Code: <strong className="font-mono text-emerald-800">{sch.school_code || 'Unassigned'}</strong></span>
                      <span>•</span>
                      <span>District: <strong>{sch.district}</strong></span>
                      <span>•</span>
                      <span>Type: {sch.school_type}</span>
                      <span>•</span>
                      <span>Email: {sch.official_email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {sch.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateSchoolStatus(sch.id || sch._id, 'approved')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs cursor-pointer"
                      >
                        Approve &amp; Generate Code
                      </button>
                    )}
                    {sch.status === 'approved' && (
                      <button
                        onClick={() => handleUpdateSchoolStatus(sch.id || sch._id, 'suspended')}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-semibold cursor-pointer"
                      >
                        Suspend
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: EVALUATORS */}
        {activeTab === 'evaluators' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Expert Evaluation Panel</h2>
            <div className="divide-y divide-slate-100">
              {evaluators.map((ev) => (
                <div key={ev.id || ev._id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{ev.full_name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        ev.status === 'approved' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ev.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {ev.organization} • {ev.designation} • Expertise: <strong>{ev.domain_expertise}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {ev.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateEvaluatorStatus(ev.id || ev._id, 'approved')}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-800 text-white text-xs font-bold cursor-pointer"
                      >
                        Approve Evaluator
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">All Submitted Student Innovations</h2>
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id || p._id} className="p-4 rounded-2xl bg-[#faf8f5] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{p.title}</div>
                    <div className="text-slate-500 mt-0.5">
                      Team: <strong>{p.team?.team_name}</strong> • School: <strong>{p.school?.school_name}</strong> ({p.school?.district})
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                      {p.theme}
                    </span>
                    <span className="text-slate-500">{p.evaluation_count} Evaluations</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS & COMPETITION STAGE */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Competition Phase Governance</h2>
              <p className="text-xs text-slate-500">Manage the active state stage displayed across all student and school dashboards.</p>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'school_registration', label: '1. School Registration' },
                  { id: 'mentor_onboarding', label: '2. Mentor Onboarding' },
                  { id: 'team_formation', label: '3. Team Formation' },
                  { id: 'online_bootcamp', label: '4. 20h Online Bootcamp' },
                  { id: 'mcq_assessment', label: '5. MCQ Assessment' },
                  { id: 'top_1000', label: '6. Top 1,000 Shortlist' },
                  { id: 'advanced_bootcamp', label: '7. Advanced Bootcamp' },
                  { id: 'coding_challenge', label: '8. Coding Challenge' },
                  { id: 'shortlist_198', label: '9. 198 Teams Shortlist' },
                  { id: 'zonal_hackathon', label: '10. Zonal 48h Hackathon' },
                  { id: 'finalist_preparation', label: '11. Finalist Prep' },
                  { id: 'state_final', label: '12. State Final' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => handleUpdateStage(st.id)}
                    className={`p-3 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer ${
                      stats?.current_stage === st.id
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                        : 'bg-[#faf8f5] text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Leaderboard Visibility */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Public Leaderboard Visibility</h3>
                <p className="text-xs text-slate-500">When disabled, public ranks are masked with an official review notice.</p>
              </div>

              <button
                onClick={handleToggleLeaderboard}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  stats?.leaderboard_public
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {stats?.leaderboard_public ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                <span>{stats?.leaderboard_public ? 'LEADERBOARD IS PUBLIC' : 'LEADERBOARD IS HIDDEN'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">System Audit Trail</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf8f5] text-slate-500 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Resource</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id || log._id}>
                      <td className="py-2.5 px-4 font-mono text-slate-500">{log.timestamp}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-800">{log.action}</td>
                      <td className="py-2.5 px-4 text-slate-600 uppercase font-semibold">{log.actor_role}</td>
                      <td className="py-2.5 px-4 font-mono text-slate-500">{log.resource_type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Assign Project to Evaluator */}
        {assignModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Assign Project to Jury</h3>
                <button onClick={() => setAssignModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAssignProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Project</label>
                  <select
                    required
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200"
                  >
                    <option value="">-- Choose Project Proposal --</option>
                    {projects.map((p) => (
                      <option key={p.id || p._id} value={p.id || p._id}>
                        {p.title} ({p.theme})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Evaluator (Approved)</label>
                  <select
                    required
                    value={selectedEvaluator}
                    onChange={(e) => setSelectedEvaluator(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200"
                  >
                    <option value="">-- Choose Expert Evaluator --</option>
                    {evaluators.filter(e => e.status === 'approved').map((ev) => (
                      <option key={ev.id || ev._id} value={ev.id || ev._id}>
                        {ev.full_name} ({ev.domain_expertise})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={assigning}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow transition-all cursor-pointer disabled:opacity-60 mt-2"
                >
                  {assigning ? 'Assigning...' : 'Confirm Assignment'}
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

export default AdminDashboard;
