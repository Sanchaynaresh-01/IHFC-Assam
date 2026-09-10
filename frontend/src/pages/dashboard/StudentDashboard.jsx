import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import {
  GraduationCap, School, Users, Trophy, Brain, Rocket, Clock,
  CheckCircle2, AlertCircle, Plus, Send, X, Loader2, Play, Award, ExternalLink, Sparkles
} from 'lucide-react';

const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const { addToast } = useToast();

  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quiz Modal State
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // Add Member Modal State
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  // Project Form State
  const [projTitle, setProjTitle] = useState('');
  const [projTheme, setProjTheme] = useState('Flood Resilience');
  const [projProblem, setProjProblem] = useState('');
  const [projSolution, setProjSolution] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projBeneficiaries, setProjBeneficiaries] = useState('');
  const [projRepo, setProjRepo] = useState('');
  const [projDemo, setProjDemo] = useState('');
  const [submittingProject, setSubmittingProject] = useState(false);

  const fetchTeamData = async () => {
    try {
      const res = await api.get('/teams/my-team');
      if (res.data && res.data.data) {
        const d = res.data.data;
        setTeamData(d);
        if (d.project) {
          setProjTitle(d.project.title || '');
          setProjTheme(d.project.theme || 'Flood Resilience');
          setProjProblem(d.project.problem_statement || '');
          setProjSolution(d.project.proposed_solution || '');
          setProjTech(d.project.technology_used || '');
          setProjBeneficiaries(d.project.target_beneficiaries || '');
          setProjRepo(d.project.repo_link || '');
          setProjDemo(d.project.demo_link || '');
        }
      }
    } catch (err) {
      console.error('Failed to load student team data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const handleOpenQuiz = async () => {
    try {
      const res = await api.get('/quizzes/active');
      setQuizData(res.data.data);
      setQuizModalOpen(true);
      // If team already has attempt recorded
      if (res.data.data?.attempt) {
        setQuizResult(res.data.data.attempt);
      }
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Quiz is currently inactive or not found.';
      addToast(msg, 'error');
    }
  };

  const handleStartQuiz = async () => {
    if (!quizData) return;
    try {
      await api.post(`/quizzes/${quizData.id}/start`);
      addToast('Assessment started! Read carefully before submitting.', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!quizData) return;
    setQuizSubmitting(true);
    try {
      const res = await api.post(`/quizzes/${quizData.id}/submit`, {
        answers: quizAnswers
      });
      setQuizResult(res.data.data);
      addToast('Assessment finalized and submitted successfully!', 'success');
      fetchTeamData();
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to submit quiz.';
      addToast(msg, 'error');
    } finally {
      setQuizSubmitting(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberName || !teamData?.team?.id) return;
    setAddingMember(true);
    try {
      await api.post(`/teams/${teamData.team.id}/members`, {
        name: newMemberName,
        email: newMemberEmail,
        grade: teamData.student?.grade
      });
      addToast('Team member added successfully!', 'success');
      setAddMemberOpen(false);
      setNewMemberName('');
      setNewMemberEmail('');
      fetchTeamData();
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to add member.';
      addToast(msg, 'error');
    } finally {
      setAddingMember(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setSubmittingProject(true);
    try {
      const payload = {
        title: projTitle,
        theme: projTheme,
        problem_statement: projProblem,
        proposed_solution: projSolution,
        technology_used: projTech,
        target_beneficiaries: projBeneficiaries,
        repo_link: projRepo,
        demo_link: projDemo
      };
      const res = await api.post('/projects', payload);
      addToast('Project proposal successfully recorded!', 'success');
      fetchTeamData();
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to save project.';
      addToast(msg, 'error');
    } finally {
      setSubmittingProject(false);
    }
  };

  if (loading && !teamData) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
      </div>
    );
  }

  const team = teamData?.team;
  const school = teamData?.school;
  const members = teamData?.members || [];
  const hasQuizAttempt = !!teamData?.quiz_attempt || (team?.quiz_score !== undefined && team?.quiz_score !== null);
  const isLeader = teamData?.student?.is_leader;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Top Team Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Category: {team?.category}
              </span>
              <span className="text-xs text-emerald-200">
                Team Code: <strong className="font-mono text-amber-300">{team?.team_code}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {team?.team_name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-100/80 mt-1">
              <span>School: <strong>{school?.school_name}</strong></span>
              <span>•</span>
              <span>School Code: <strong className="font-mono">{school?.school_code}</strong></span>
              <span>•</span>
              <span>District: <strong>{school?.district}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-emerald-200">Logged in as</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{teamData?.student?.full_name}</span>
                {isLeader && <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-bold">Leader</span>}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Left (Quiz Card + Team Roster), Right (Project Submission) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. KNOWLEDGE ASSESSMENT QUIZ CARD (Prominent requirement) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Knowledge Assessment</h3>
                    <p className="text-xs text-slate-500">20-Hour Online Bootcamp Benchmark</p>
                  </div>
                </div>

                {hasQuizAttempt ? (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>COMPLETED</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                    LIVE
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                Evaluates human-centered design thinking, electronics logic, sensor systems, and Assam regional problem framing.
              </p>

              {hasQuizAttempt ? (
                <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-emerald-800 font-semibold">Your Assessment Score</div>
                    <div className="text-2xl font-black text-emerald-950">
                      {team?.quiz_score ?? teamData?.quiz_attempt?.score ?? 28} <span className="text-xs font-normal text-emerald-700">/ 30</span>
                    </div>
                  </div>
                  <button
                    onClick={handleOpenQuiz}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                  >
                    View Status
                  </button>
                </div>
              ) : (
                <div className="mt-5">
                  <button
                    onClick={handleOpenQuiz}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>JOIN ASSESSMENT QUIZ</span>
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-2">
                    Timed server session: 25 minutes. One attempt per team.
                  </p>
                </div>
              )}
            </div>

            {/* 2. TEAM MEMBER CARD */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Team Members</h3>
                  <p className="text-xs text-slate-500">Authorized roster under {team?.team_name}</p>
                </div>
                {isLeader && (
                  <button
                    onClick={() => setAddMemberOpen(true)}
                    className="p-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Member</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {members.map((m) => (
                  <div
                    key={m.id || m._id}
                    className="p-3.5 rounded-2xl bg-[#faf8f5] border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{m.full_name}</span>
                        {m.is_leader && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                            Leader
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500 mt-0.5">{m.email || 'Registered student'}</div>
                    </div>
                    <span className="text-slate-600 font-medium">{m.grade || team?.category}</span>
                  </div>
                ))}
              </div>

              {/* Mentor info */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="text-slate-500">Designated Mentor:</span>
                <strong className="text-slate-800">{team?.mentor_name || school?.coordinator?.name || 'School Mentor'}</strong>
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): PROJECT SUBMISSION */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
                    <Rocket className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Innovation Proposal</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Project Submission Portal</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Team &amp; School identities are permanently and securely derived from your account.
                  </p>
                </div>

                {teamData?.project && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Status: {teamData.project.status?.toUpperCase()}
                  </span>
                )}
              </div>

              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Solar Telemetry Beacon for Brahmaputra Embankments"
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority Theme *</label>
                  <select
                    value={projTheme}
                    onChange={(e) => setProjTheme(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                  >
                    <option value="Flood Resilience">Flood Resilience</option>
                    <option value="Tea Technology">Tea Industry Technology</option>
                    <option value="Smart Agriculture">Smart Agriculture</option>
                    <option value="Biodiversity">Biodiversity Protection</option>
                    <option value="Sustainable Technology">Sustainable Technology</option>
                    <option value="Rural Healthcare">Rural Healthcare</option>
                    <option value="Waste Management">Waste Management</option>
                    <option value="River Transportation">River Transportation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Problem Statement *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the real-world Assam bottleneck your team observed..."
                    value={projProblem}
                    onChange={(e) => setProjProblem(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Proposed Solution &amp; Novelty *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Explain how your hardware/software prototype solves this problem..."
                    value={projSolution}
                    onChange={(e) => setProjSolution(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Technology Used</label>
                    <input
                      type="text"
                      placeholder="ESP32, Ultrasonic sensor, LoRa, Python..."
                      value={projTech}
                      onChange={(e) => setProjTech(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Beneficiaries</label>
                    <input
                      type="text"
                      placeholder="Tea garden workers, riverside farming families..."
                      value={projBeneficiaries}
                      onChange={(e) => setProjBeneficiaries(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Repository Link (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={projRepo}
                      onChange={(e) => setProjRepo(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Demo / Video Link (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/..."
                      value={projDemo}
                      onChange={(e) => setProjDemo(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingProject}
                  className="w-full py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-4"
                >
                  {submittingProject ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Submission...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Project Proposal</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Modal: Knowledge Assessment Quiz */}
        {quizModalOpen && quizData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Online Knowledge Assessment</span>
                  <h3 className="text-xl font-bold text-slate-900">{quizData.title}</h3>
                </div>
                <button onClick={() => setQuizModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {quizResult ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900">Assessment Finalized</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Your answers have been securely submitted and benchmarked against the official state answer key.
                  </p>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 w-fit mx-auto px-8">
                    <div className="text-xs text-emerald-800 font-semibold">Verified Merit Score</div>
                    <div className="text-3xl font-black text-emerald-950">
                      {quizResult.score} <span className="text-sm font-normal text-emerald-700">/ {quizResult.total_marks || 20}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setQuizModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              ) : quizData.questions && quizData.questions.length > 0 ? (
                <div className="py-4 space-y-6">
                  <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                    <span>Question {currentQIndex + 1} of {quizData.questions.length}</span>
                    <span className="font-semibold text-emerald-800">{quizData.questions[currentQIndex]?.marks || 2} Marks</span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {quizData.questions[currentQIndex]?.question_text}
                    </h4>

                    <div className="mt-4 space-y-2.5">
                      {quizData.questions[currentQIndex]?.options.map((opt, oIdx) => {
                        const qId = quizData.questions[currentQIndex].id;
                        const isSelected = quizAnswers[qId] === oIdx;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handleSelectOption(qId, oIdx)}
                            className={`w-full text-left p-3.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-3 cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                              isSelected ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white border-slate-300 text-slate-500'
                            }`}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Navigation / Submit controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={currentQIndex === 0}
                      onClick={() => setCurrentQIndex((prev) => prev - 1)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 disabled:opacity-40 cursor-pointer"
                    >
                      Previous
                    </button>

                    {currentQIndex < quizData.questions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentQIndex((prev) => prev + 1)}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-800 text-white shadow-xs cursor-pointer"
                      >
                        Next Question
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={quizSubmitting}
                        onClick={handleSubmitQuiz}
                        className="px-6 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                      >
                        {quizSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        <span>Submit Final Assessment</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500">
                  <p className="text-sm">Assessment questions loading...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Add Team Member */}
        {addMemberOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">Add Team Member</h3>
                <button onClick={() => setAddMemberOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddMember} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Himjyoti Sarma"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Student Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="student@afip.demo"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={addingMember}
                  className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow transition-all cursor-pointer disabled:opacity-60 mt-2"
                >
                  {addingMember ? 'Adding...' : 'Confirm Member'}
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

export default StudentDashboard;
