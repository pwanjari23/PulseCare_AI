import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="glass-card max-w-md w-full p-8 rounded-2xl border border-border-subtle text-center bg-surface/55">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-medical-500/10 text-medical-600 border border-medical-500/20 mb-6">
          <HelpCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-primary-text mb-2 font-display">404 - Page Not Found</h2>
        <p className="text-sm text-secondary-text mb-8 leading-relaxed">
          The requested healthcare portal path does not exist or has been relocated to another domain.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
