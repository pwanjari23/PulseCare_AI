import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Button from '../ui/buttons/Button';
import { ROUTES } from '../../constants/routes';

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 text-primary-text">
      <div className="max-w-md w-full bg-surface border border-border-subtle p-8 rounded-2xl shadow-xl flex flex-col items-center text-center">
        <div className="p-3 rounded-2xl bg-danger-500/10 text-danger-500 border border-danger-500/20 mb-4">
          <ShieldAlert className="h-10 w-10 animate-pulse" />
        </div>
        <h1 className="font-display font-extrabold text-2xl mb-2">Access Denied</h1>
        <p className="text-secondary-text text-sm mb-6 leading-relaxed">
          You do not have the necessary security credentials or authorizations to view this clinical module.
        </p>
        <Button onClick={() => navigate(ROUTES.DASHBOARD)} variant="primary" fullWidth>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
