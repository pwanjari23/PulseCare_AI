import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen bg-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300">
      {/* Immersive fluid glowing blobs in the background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-40 dark:opacity-100">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-medical-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-healing-500/10 rounded-full blur-[110px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="max-w-5xl w-full relative flex justify-center px-4 sm:px-0">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
