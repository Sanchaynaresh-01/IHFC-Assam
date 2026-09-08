import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Compass, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6 text-center pt-32 pb-20">
        <div className="max-w-md">
          <div className="text-6xl font-black text-emerald-800">404</div>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Page Not Found</h1>
          <p className="text-sm text-slate-500 mt-2">
            The pathway you were looking for doesn't exist or has moved along the Assam journey.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 text-white font-bold text-xs shadow hover:bg-emerald-900 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Return to Program Home</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
