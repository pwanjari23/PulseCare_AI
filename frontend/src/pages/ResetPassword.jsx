import React from 'react';
import { Link } from 'react-router-dom';
import { Key, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const ResetPassword = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-primary-text font-display">New Password</h2>
        <p className="text-xs text-muted-text mt-1">Enter your new secure password credentials</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input
          label="New Password"
          type="password"
          placeholder="••••••••"
          icon={Key}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          icon={Key}
        />

        <Button variant="primary" className="w-full mt-2">
          Update Password
        </Button>
      </form>

      <div className="text-center mt-4">
        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-medical-600 hover:text-medical-700 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
