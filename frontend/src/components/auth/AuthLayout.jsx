import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AuthIllustration from './AuthIllustration';
import { ROUTES } from '../../constants/routes';

export const AuthLayout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  let illustrationType = 'general';
  if (path === ROUTES.LOGIN) {
    illustrationType = 'login';
  } else if (path === ROUTES.REGISTER_PATIENT || path === '/register') {
    illustrationType = 'patient-register';
  } else if (path === ROUTES.REGISTER_DOCTOR) {
    illustrationType = 'doctor-register';
  }

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-healing-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Auth Illustration */}
        <div className="hidden lg:block lg:col-span-5 h-[620px]">
          <AuthIllustration type={illustrationType} />
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="col-span-1 lg:col-span-7 flex justify-center w-full">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
