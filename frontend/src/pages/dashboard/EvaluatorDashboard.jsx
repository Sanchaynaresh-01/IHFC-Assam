import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import {
  UserCheck, Award, FileText, CheckCircle2, Clock,
  Calendar, ExternalLink, X, Loader2, Save, Send, ShieldAlert, Sparkles, Building, School
} from 'lucide-react';

const RUBRIC_FIELDS = [
  { key: 'innovation', label: 'Innovation & Originality', max: 20, desc: 'Novelty of approach, uniqueness vs standard hobby kits.' },
  { key: 'problem_understanding', label: 'Problem Understanding & Context', max: 15, desc: 'Clarity of the specific Assam problem and beneficiary empathy.' },
  { key: 'technical_implementation', label: 'Technical Implementation', max: 20, desc: 'Hardware craft, software robustness, sensor integration.' },
  { key: 'feasibility', label: 'Feasibility & Workability', max: 15, desc: 'Viability under real Assam field conditions (flooding, power outages).' },
  { key: 'social_impact', label: 'Social & Regional Impact', max: 15, desc: 'Potential to protect lives, boost livelihoods or environment.' },
  { key: 'scalability', label: 'Scalability & Replication', max: 10, desc: 'Ease of expanding across other Assam blocks and districts.' },
  { key: 'presentation', label: 'Presentation & Documentation', max: 5, desc: 'Clarity of explanation, structure of demo & materials.' },
];

const EvaluatorDashboard = () => {
  const { user, profile } = useAuth();
  const { addToast } = useToast();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Evaluation Modal State
  const [activeModal, setActiveModal] = useState(null); // assignment object
  const [rubricScores, setRubricScores] = useState({
    innovation: 0,
    problem_understanding: 0,
    technical_implementation: 0,
    feasibility: 0,
    social_impact: 0,
    scalability: 0,
    presentation: 0
  });
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [comments, setComments] = useState('');
  const [recommendation, setRecommendation] = useState('Recommended');
  const [savingEval, setSavingEval] = useState(false);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/evaluators/assignments');
      setAssignments(res.data.data || []);
    } catch (err) {
      console.error('Failed to load evaluator assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleOpenEvaluate = (assign) => {
    setActiveModal(assign);
    if (assign.evaluation) {
      const e = assign.evaluation;
      setRubricScores({
        innovation: e.scores?.innovation || 0,
        problem_understanding: e.scores?.problem_understanding || 0,
        technical_implementation: e.scores?.technical_implementation || 0,
        feasibility: e.scores?.feasibility || 0,
        social_impact: e.scores?.social_impact || 0,
        scalability: e.scores?.scalability || 0,
        presentation: e.scores?.presentation || 0
      });
      setStrengths(e.strengths || '');
      setImprovements(e.areas_for_improvement || '');
      setComments(e.comments || '');
      setRecommendation(e.recommendation || 'Recommended');
    } else {
      setRubricScores({
        innovation: 15,
        problem_understanding: 12,
        technical_implementation: 15,
        feasibility: 12,
        social_impact: 12,
        scalability: 8,
        presentation: 4
      });
      setStrengths('');
      setImprovements('');
      setComments('');
      setRecommendation('Recommended');
    }
  };

  const handleScoreChange = (field, val, max) => {
    const num = Math.min(max, Math.max(0, parseFloat(val) || 0));
    setRubricScores((prev) => ({
      ...prev,
      [field]: num
    }));
  };

  const totalScore = Object.values(rubricScores).reduce((a, b) => a + b, 0);

  const handleSaveEvaluation = async (isDraft = false) => {
    if (!activeModal) return;
    setSavingEval(true);
    try {
      const payload = {
        project_id: activeModal.project_id,
        assignment_id: activeModal.id,
        is_draft: isDraft,
        scores: rubricScores,
        strengths,
        areas_for_improvement: improvements,
        comments,
        recommendation
      };
      await api.post('/evaluators/evaluate', payload);
      addToast(isDraft ? 'Evaluation draft saved.' : 'Evaluation submitted and locked!', 'success');
      setActiveModal(null);
      fetchAssignments();
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to submit evaluation.';
      addToast(msg, 'error');
    } finally {
      setSavingEval(false);
    }
  };

  const pendingCount = assignments.filter((a) => !a.evaluation || a.evaluation.status === 'draft').length;
  const completedCount = assignments.filter((a) => a.evaluation && a.evaluation.status === 'submitted').length;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Evaluator Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Official Jury Panel
              </span>
              <span className="text-xs text-blue-200">State Assessment Grid</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {profile?.evaluator?.full_name || user?.name}
            </h1>
            <p className="text-xs text-blue-100 mt-1">
              {profile?.evaluator?.organization} • {profile?.evaluator?.designation} • Domain: <strong>{profile?.evaluator?.domain_expertise}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-xs text-blue-200">Pending Review</div>
              <div className="text-2xl font-black text-amber-300">{pendingCount}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-xs text-blue-200">Completed</div>
              <div className="text-2xl font-black text-emerald-300">{completedCount}</div>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Assigned Student Submissions</h2>
              <p className="text-xs text-slate-500">
                Projects specifically assigned to your review queue by the State Administrator.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Total Assigned: <strong>{assignments.length}</strong>
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <Loader2 className="w-8 h-8 text-blue-700 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-500 mt-2">Loading assigned entries...</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-sm">No submissions assigned yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                The State Committee will allocate cohort entries based on your domain expertise.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((item) => {
                const proj = item.project;
                const isSubmitted = item.evaluation?.status === 'submitted';
                return (
                  <div
                    key={item.id}
                    className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 bg-[#faf8f5] shadow-xs hover:border-blue-400 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {item.team?.team_code || 'AFIP-T'}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {proj?.category}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                          {proj?.theme}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{proj?.title}</h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <School className="w-3.5 h-3.5 text-slate-400" />
                          {item.school?.school_name}
                        </span>
                        <span>•</span>
                        <span>{item.school?.district}, Assam</span>
                        <span>•</span>
                        <span>Prototype: <strong>{proj?.prototype_status}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {isSubmitted ? (
                        <div className="text-right">
                          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Evaluated</span>
                          </span>
                          <span className="text-lg font-black text-slate-900">
                            {item.evaluation.scores?.total} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                          Pending Evaluation
                        </span>
                      )}

                      <button
                        onClick={() => handleOpenEvaluate(item)}
                        className="px-4 py-2 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs shadow transition-all cursor-pointer"
                      >
                        {isSubmitted ? 'Review / View Rubric' : 'Evaluate Submission'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal: Evaluation Rubric Form */}
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Official Rubric</span>
                    <span className="text-xs font-mono text-slate-500">[{activeModal.team?.team_code}]</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{activeModal.project?.title}</h3>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Project Brief */}
              <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1 leading-relaxed">
                <div><strong>Problem:</strong> {activeModal.project?.problem_statement}</div>
                <div><strong>Solution:</strong> {activeModal.project?.proposed_solution}</div>
                <div><strong>Technology:</strong> {activeModal.project?.technology_used || 'Standard prototyping'}</div>
              </div>

              {/* 7-Criteria Rubric Sliders / Inputs */}
              <div className="space-y-4 my-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold uppercase text-slate-500">
                  <span>Evaluation Criterion</span>
                  <span>Marks Awarded</span>
                </div>

                {RUBRIC_FIELDS.map((rf) => (
                  <div key={rf.key} className="p-3.5 rounded-xl bg-[#faf8f5] border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="sm:pr-4">
                      <div className="text-xs font-bold text-slate-900">{rf.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{rf.desc}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="number"
                        min="0"
                        max={rf.max}
                        step="0.5"
                        value={rubricScores[rf.key]}
                        onChange={(e) => handleScoreChange(rf.key, e.target.value, rf.max)}
                        className="w-16 px-2 py-1 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg focus:outline-blue-600"
                      />
                      <span className="text-xs text-slate-400 font-medium">/ {rf.max}</span>
                    </div>
                  </div>
                ))}

                {/* Total Score Bar */}
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-950">Calculated Total Rubric Score</span>
                  <span className="text-2xl font-black text-blue-900">
                    {totalScore} <span className="text-xs font-normal text-blue-700">/ 100</span>
                  </span>
                </div>
              </div>

              {/* Qualitative Feedback */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Key Strengths</label>
                  <textarea
                    rows={2}
                    placeholder="Highlight commendable technical aspects or deep local empathy..."
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Areas for Improvement</label>
                  <textarea
                    rows={2}
                    placeholder="Recommendations for prototype refinement before zonal rounds..."
                    value={improvements}
                    onChange={(e) => setImprovements(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jury Recommendation</label>
                  <select
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-blue-600"
                  >
                    <option value="Strongly Recommended for Zonal Hackathon">Strongly Recommended for Zonal Hackathon</option>
                    <option value="Recommended">Recommended</option>
                    <option value="Recommended with Minor Revisions">Recommended with Minor Revisions</option>
                    <option value="Not Recommended">Not Recommended</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={savingEval}
                  onClick={() => handleSaveEvaluation(true)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>

                <button
                  type="button"
                  disabled={savingEval}
                  onClick={() => handleSaveEvaluation(false)}
                  className="px-6 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-xs font-black shadow transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {savingEval ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Finalize &amp; Lock Evaluation</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EvaluatorDashboard;
