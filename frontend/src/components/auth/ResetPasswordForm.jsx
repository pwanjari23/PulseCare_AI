import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { KeyRound, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

import { resetPasswordSchema } from '../../validators/auth.validator';
import { FormInput } from '../ui/forms/Form';
import authApi from '../../services/api/auth.api';
import { ROUTES } from '../../constants/routes';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const initialToken = searchParams.get('token') || '';

  const methods = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: initialToken,
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (initialToken) {
      methods.setValue('token', initialToken);
    }
  }, [initialToken, methods]);

  const newPasswordValue = useWatch({ control: methods.control, name: 'newPassword' });

  const onSubmit = async (values) => {
    setApiError(null);
    setIsLoading(true);

    try {
      await authApi.resetPassword({
        token: values.token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      setIsSuccess(true);
      toast.success('Password updated successfully!');
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2500);
    } catch (err) {
      console.error('Reset password error:', err);
      const errorMessage = err.message || 'Failed to reset password. Token may be invalid or expired.';
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Password Reset Complete</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Your password has been reset successfully. Redirecting to login...
        </p>

        <div className="pt-4">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        {apiError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm flex items-start space-x-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Reset Token Input */}
        <FormInput
          name="token"
          label="Reset Token *"
          placeholder="Enter reset token from email"
          readOnly={!!initialToken}
        />

        {/* New Password */}
        <div className="relative">
          <FormInput
            name="newPassword"
            label="New Password *"
            type={showNewPassword ? 'text' : 'password'}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground p-1 focus:outline-none"
          >
            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Password Strength Meter */}
        <PasswordStrengthIndicator password={newPasswordValue || ''} />

        {/* Confirm Password */}
        <div className="relative pt-2">
          <FormInput
            name="confirmPassword"
            label="Confirm New Password *"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-11 text-muted-foreground hover:text-foreground p-1 focus:outline-none"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 mt-6"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              <span>Reset Password</span>
              <KeyRound className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </FormProvider>
  );
};

export default ResetPasswordForm;
