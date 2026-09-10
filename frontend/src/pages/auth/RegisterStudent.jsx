import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, Users, User, Mail, Phone, Lock, CheckCircle2,
  AlertCircle, Loader2, Sparkles, School, ArrowRight, Plus, Trash2
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    school_code: '',
    team_name: '',
    category: 'VI-VIII',
    leader_name: '',
    leader_email: '',
    leader_phone: '',
    leader_grade: 'Class VIII',
    password: '',
    confirm_password: '',
    members: [{ name: '', grade: 'Class VIII', email: '' }]
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemberChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.members];
      updated[index][field] = value;
      return { ...prev, members: updated };
    });
  };

  const addMemberField = () => {
    if (formData.members.length < 3) {
      setFormData((prev) => ({
        ...prev,
        members: [...prev.members, { name: '', grade: formData.leader_grade, email: '' }]
      }));
    }
  };

  const removeMemberField = (index) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirm_password) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register-student', formData);
      setSuccessData(res.data.data);
      addToast('Team registration submitted successfully!', 'success');
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message || 'Registration failed. Please check details.';
      setErrorMsg(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {successData ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Team Registered Successfully!
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto">
                Congratulations, your team <strong>{successData.team_name}</strong> is officially registered under <strong>{successData.school_name}</strong>.
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 max-w-md mx-auto space-y-1">
                <div>Team Code: <strong className="font-mono text-sm text-emerald-900">{successData.team_code}</strong></div>
                <div>Category: <strong>{successData.category}</strong></div>
                <div className="text-slate-600 text-[11px] pt-1">
                  You can now log in using your student leader email and password to begin the learning bootcamp and prepare for the MCQ assessment.
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <Link
                  to="/login/student"
                  className="px-6 py-3 rounded-xl bg-emerald-800 text-white font-bold text-sm shadow-md hover:bg-emerald-900 transition-all"
                >
                  Sign In to Student Portal
                </Link>
                <Link
                  to="/"
                  className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Return to Homepage
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="p-8 sm:p-10 bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-3 border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Young Innovators • Classes VI–XII</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                  Register Your Student Innovation Team
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
                  Form a team under your approved school. Receive mentoring from IIT Delhi / IHFC, complete online modules, and build solutions for Assam.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6">
                {errorMsg && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Section 1: School Code & Category */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                    <School className="w-4 h-4" />
                    <span>1. School &amp; Competition Category</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Approved School Code *
                      </label>
                      <input
                        type="text"
                        name="school_code"
                        required
                        placeholder="e.g. AFIP-AS-KAM-00001"
                        value={formData.school_code}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl font-mono text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600 uppercase"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Obtain this from your School Innovation Coordinator / Teacher.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Competition Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      >
                        <option value="VI-VIII">Category 1: Classes VI–VIII</option>
                        <option value="IX-X">Category 2: Classes IX–X</option>
                        <option value="XI-XII">Category 3: Classes XI–XII</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Team Name *
                      </label>
                      <input
                        type="text"
                        name="team_name"
                        required
                        placeholder="e.g. Kaziranga Eco Warriors"
                        value={formData.team_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Team Leader */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>2. Team Leader (Primary Contact &amp; Login)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Student Leader Name *</label>
                      <input
                        type="text"
                        name="leader_name"
                        required
                        placeholder="Full student name"
                        value={formData.leader_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Current Class / Grade *</label>
                      <input
                        type="text"
                        name="leader_grade"
                        required
                        placeholder="e.g. Class IX-A"
                        value={formData.leader_grade}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Student Email (Login ID) *</label>
                      <input
                        type="email"
                        name="leader_email"
                        required
                        placeholder="student@gmail.com"
                        value={formData.leader_email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Parent / Student Mobile *</label>
                      <input
                        type="tel"
                        name="leader_phone"
                        required
                        placeholder="+91 94350 XXXXX"
                        value={formData.leader_phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Portal Password *</label>
                      <input
                        type="password"
                        name="password"
                        required
                        placeholder="Min. 8 characters"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password *</label>
                      <input
                        type="password"
                        name="confirm_password"
                        required
                        placeholder="Re-enter password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Additional Team Members */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>3. Additional Team Members (Optional)</span>
                    </h3>
                    {formData.members.length < 3 && (
                      <button
                        type="button"
                        onClick={addMemberField}
                        className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Member</span>
                      </button>
                    )}
                  </div>

                  {formData.members.map((mem, index) => (
                    <div key={index} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Member #{index + 2}</span>
                        {formData.members.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMemberField(index)}
                            className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Member Name"
                          value={mem.name}
                          onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                          className="px-3 py-2 rounded-xl text-xs bg-white border border-slate-200"
                        />
                        <input
                          type="text"
                          placeholder="Class / Grade"
                          value={mem.grade}
                          onChange={(e) => handleMemberChange(index, 'grade', e.target.value)}
                          className="px-3 py-2 rounded-xl text-xs bg-white border border-slate-200"
                        />
                        <input
                          type="email"
                          placeholder="Member Email (Optional)"
                          value={mem.email}
                          onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                          className="px-3 py-2 rounded-xl text-xs bg-white border border-slate-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Registering Team...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Team Registration</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="text-center text-xs text-slate-500">
                  Already registered?{' '}
                  <Link to="/login/student" className="text-emerald-800 font-bold hover:underline">
                    Sign in to Student Portal
                  </Link>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterStudent;
