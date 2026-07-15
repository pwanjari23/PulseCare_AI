import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from '../pages/Home';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Reusable stub page for feature navigation placeholders before API integration
const StubPage = ({ title }) => (
  <div className="flex-grow flex flex-col items-center justify-center bg-bg-darker min-h-[70vh] px-4">
    <div className="glass-card max-w-md w-full p-8 rounded-2xl border border-white/5 text-center bg-bg-card/40">
      <h2 className="text-2xl font-extrabold text-white mb-4 font-display">{title}</h2>
      <p className="text-sm text-slate-400 mb-6 leading-relaxed">
        This route is structured and registered. The core business logic will be integrated in subsequent implementation phases.
      </p>
      <Link 
        to="/" 
        className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold border border-slate-700 transition-all active:scale-97 select-none cursor-pointer"
      >
        Return to Home
      </Link>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen bg-bg-darker text-slate-100 font-sans">
      <Header />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<StubPage title="Portal Access Sign-In" />} />
          <Route path="/register" element={<StubPage title="Create Patient Account" />} />
          <Route path="/dashboard" element={<StubPage title="Clinical Portal Dashboard" />} />
          <Route path="*" element={<StubPage title="404 - Page Not Found" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default AppRoutes;
