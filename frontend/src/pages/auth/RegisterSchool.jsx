import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { School, User, Mail, Phone, Lock, CheckCircle2, AlertCircle, Loader2, Sparkles, Building, MapPin, ArrowRight } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ASSAM_DISTRICTS = [
  'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar',
  'Charaideo', 'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh',
  'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat',
  'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj', 'Kokrajhar',
  'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar',
  'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'
];

const RegisterSchool = () => {
  const [formData, setFormData] = useState({
    school_name: '',
    school_type: 'Government Model School',
    board: 'SEBA',
    address_line_1: '',
    address_line_2: '',
    district: 'Kamrup',
    state: 'Assam',
    pin_code: '',
    official_email: '',
    official_phone: '',
    website: '',
    principal_name: '',
    principal_email: '',
    principal_phone: '',
    coordinator_name: '',
    coordinator_email: '',
    coordinator_phone: '',
    coordinator_designation: 'Innovation Mentor / PGT Science',
    password: '',
    confirm_password: '',
    accept_terms: false
  });

  const [loading, setLoading] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirm_password) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (!formData.accept_terms) {
      setErrorMsg('You must accept the official competition terms and guidelines.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/schools/register', formData);
      setSubmittedSuccess(true);
      addToast('School registration application submitted successfully!', 'success');
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message || 'Submission failed. Please check inputs.';
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
        <div className="max-w-4xl mx-auto">
          {submittedSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Application Submitted for Review
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
                Thank you for registering <strong>{formData.school_name}</strong> for the Assam Future Innovation Program. Your registration has been submitted to the State Directorate for verification.
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 max-w-lg mx-auto text-left leading-relaxed">
                <strong>Next Steps:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Our administrative panel will verify your institutional credentials.</li>
                  <li>Upon approval, a unique state School Code (e.g. <code>AFIP-AS-KAM-00001</code>) will be generated.</li>
                  <li>You will then be able to log in and register student innovation teams.</li>
                </ul>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <Link
                  to="/login/school"
                  className="px-6 py-3 rounded-xl bg-emerald-800 text-white font-bold text-sm shadow-md hover:bg-emerald-900 transition-all"
                >
                  Proceed to School Login
                </Link>
                <Link
                  to="/"
                  className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Back to Homepage
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="p-8 sm:p-10 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-3 border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>State Innovation Portal</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                  Register Your School
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
                  Join the state-wide student innovation challenge. Approved institutions receive mentoring resources, competition toolkits, and access to the student team registry.
                </p>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8">
                {errorMsg && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Group 1: Institutional Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    <span>1. School Information</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Official School Name *</label>
                      <input
                        type="text"
                        name="school_name"
                        required
                        placeholder="e.g. Brahmaputra Model Higher Secondary School"
                        value={formData.school_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">School Type *</label>
                      <select
                        name="school_type"
                        value={formData.school_type}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      >
                        <option value="Government Model School">Government Model School</option>
                        <option value="Provincialized Higher Secondary">Provincialized Higher Secondary</option>
                        <option value="Adarsha Vidyalaya">Adarsha Vidyalaya</option>
                        <option value="Kasturba Gandhi Balika Vidyalaya">Kasturba Gandhi Balika Vidyalaya</option>
                        <option value="Tea Garden Model School">Tea Garden Model School</option>
                        <option value="Affiliated Private School">Affiliated Private School</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Affiliation Board *</label>
                      <select
                        name="board"
                        value={formData.board}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      >
                        <option value="SEBA">SEBA (Secondary Education Board of Assam)</option>
                        <option value="AHSEC">AHSEC (Higher Secondary Education Council)</option>
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">District *</label>
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      >
                        {ASSAM_DISTRICTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">PIN Code *</label>
                      <input
                        type="text"
                        name="pin_code"
                        required
                        placeholder="781001"
                        value={formData.pin_code}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Address Line 1 *</label>
                      <input
                        type="text"
                        name="address_line_1"
                        required
                        placeholder="Street, Educational Zone or Landmark"
                        value={formData.address_line_1}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Official School Email *</label>
                      <input
                        type="email"
                        name="official_email"
                        required
                        placeholder="school@assam.gov.in"
                        value={formData.official_email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Official School Phone *</label>
                      <input
                        type="tel"
                        name="official_phone"
                        required
                        placeholder="+91 361 223456"
                        value={formData.official_phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Group 2: Principal Information */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>2. Principal Information</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Principal Name *</label>
                      <input
                        type="text"
                        name="principal_name"
                        required
                        placeholder="Dr. / Sri / Smt."
                        value={formData.principal_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Principal Email *</label>
                      <input
                        type="email"
                        name="principal_email"
                        required
                        placeholder="principal@school.edu"
                        value={formData.principal_email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Principal Mobile *</label>
                      <input
                        type="tel"
                        name="principal_phone"
                        required
                        placeholder="+91 94350 XXXXX"
                        value={formData.principal_phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Group 3: Coordinator / Mentor */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>3. Program Coordinator / Innovation Mentor</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Coordinator Name *</label>
                      <input
                        type="text"
                        name="coordinator_name"
                        required
                        placeholder="Teacher Name"
                        value={formData.coordinator_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Coordinator Email *</label>
                      <input
                        type="email"
                        name="coordinator_email"
                        required
                        placeholder="mentor@school.edu"
                        value={formData.coordinator_email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Coordinator Mobile *</label>
                      <input
                        type="tel"
                        name="coordinator_phone"
                        required
                        placeholder="+91 98640 XXXXX"
                        value={formData.coordinator_phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Group 4: Authentication Security */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>4. Portal Password Setup</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Create Password *</label>
                      <input
                        type="password"
                        name="password"
                        required
                        placeholder="Minimum 8 characters"
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

                {/* Terms Acceptance */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      name="accept_terms"
                      checked={formData.accept_terms}
                      onChange={handleChange}
                      className="mt-0.5 rounded border-slate-300 text-emerald-800 focus:ring-emerald-600"
                    />
                    <span>
                      We hereby certify that the information provided is authentic and agree to follow all guidelines and safety protocols of the Assam Future Innovation Program.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit School Registration</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterSchool;
