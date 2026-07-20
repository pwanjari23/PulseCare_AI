import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Send, AlertCircle, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';

import { forgotPasswordSchema } from '../../validators/auth.validator';
import { FormInput } from '../ui/forms/Form';
import authApi from '../../services/api/auth.api';
import { ROUTES } from '../../constants/routes';

export const ForgotPasswordForm = () => {
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState(null);

  const methods = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values) => {
    setApiError(null);
    setIsLoading(true);

    try {
      await authApi.forgotPassword(values.email);
      setSubmittedEmail(values.email);
      toast.success('Password reset instructions sent!');
    } catch (err) {
      console.error('Forgot password request error:', err);
      // As per requirement: display success message or handle API error gracefully
      const message = err.message || 'Unable to request password reset. Please try again later.';
      setApiError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (submittedEmail) {
      onSubmit({ email: submittedEmail });
    }
  };

  if (submittedEmail) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Instructions Sent</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          If an account exists for <span className="font-semibold text-foreground">{submittedEmail}</span>, you will receive password reset instructions shortly.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2 bg-accent text-accent-foreground text-xs font-semibold rounded-xl border border-border/60 hover:bg-accent/80 transition-colors flex items-center justify-center space-x-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Resend Email</span>
          </button>
          <Link
            to={ROUTES.LOGIN}
            className="w-full sm:w-auto px-5 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center space-x-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Login</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-5">
        {apiError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm flex items-start space-x-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        <FormInput
          name="email"
          label="Account Email Address"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              <span>Send Reset Instructions</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="text-center pt-2">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </form>
    </FormProvider>
  );
};

export default ForgotPasswordForm;
