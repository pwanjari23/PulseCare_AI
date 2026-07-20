import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import Button from '../ui/buttons/Button';
import { ROUTES } from '../../constants/routes';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 text-primary-text">
      <div className="max-w-md w-full bg-surface border border-border-subtle p-8 rounded-2xl shadow-xl flex flex-col items-center text-center">
        <div className="p-3 rounded-2xl bg-medical-600/10 text-medical-600 border border-medical-500/20 mb-4">
          <HelpCircle className="h-10 w-10 animate-bounce" />
        </div>
        <h1 className="font-display font-extrabold text-4xl mb-2">404</h1>
        <h2 className="font-display font-bold text-lg mb-2">Page Not Found</h2>
        <p className="text-secondary-text text-sm mb-6 leading-relaxed">
          The page you are looking for does not exist or has been relocated to another clinical department.
        </p>
        <Button onClick={() => navigate(ROUTES.DASHBOARD)} variant="primary" fullWidth>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
