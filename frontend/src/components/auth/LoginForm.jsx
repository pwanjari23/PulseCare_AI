import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

import { loginSchema } from '../../validators/auth.validator';
import { FormInput, FormCheckbox } from '../ui/forms/Form';
import { useAuthStore } from '../../stores/auth.store';
import authApi from '../../services/api/auth.api';
import { ROUTES } from '../../constants/routes';
import SocialDivider from './SocialDivider';

export const LoginForm = () => {
  const navigate = useNavigate();
  const loginStoreAction = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values) => {
    setApiError(null);
    setIsLoading(true);

    try {
      const response = await authApi.login({
        email: values.email,
        password: values.password,
      });

      // Response format: { accessToken, refreshToken, user }
      const { accessToken, refreshToken, user } = response;

      loginStoreAction(accessToken, refreshToken, user);
      toast.success(`Welcome back, ${user?.firstName || 'User'}!`);

      // Role-Based Navigation
      const role = user?.role?.toLowerCase() || '';
      if (role === 'patient') {
        navigate(ROUTES.PATIENT.DASHBOARD);
      } else if (role === 'doctor') {
        navigate(ROUTES.DOCTOR.DASHBOARD);
      } else if (role === 'admin') {
        navigate(ROUTES.ADMIN.DASHBOARD);
      } else {
        navigate(ROUTES.UNAUTHORIZED);
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'Invalid email or password. Please try again.';
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-5">
        {/* API Error Banner */}
        {apiError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm flex items-start space-x-2.5 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Email Input */}
        <FormInput
          name="email"
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
        />

        {/* Password Input */}
        <div className="relative">
          <FormInput
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground p-1 focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <FormCheckbox name="rememberMe" label="Remember me" />
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-xs font-semibold text-primary hover:text-primary/80 hover:underline transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <LogIn className="w-4 h-4" />
            </>
          )}
        </button>

        <SocialDivider text="Don't have an account?" />

        {/* Registration Navigation buttons */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <Link
            to={ROUTES.REGISTER_PATIENT}
            className="py-2.5 px-3 rounded-xl border border-border/80 text-xs font-semibold text-foreground hover:bg-accent/60 transition-colors"
          >
            Register as Patient
          </Link>
          <Link
            to={ROUTES.REGISTER_DOCTOR}
            className="py-2.5 px-3 rounded-xl border border-border/80 text-xs font-semibold text-foreground hover:bg-accent/60 transition-colors"
          >
            Register as Doctor
          </Link>
        </div>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
