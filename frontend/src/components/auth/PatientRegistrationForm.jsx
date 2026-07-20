import React, { useState } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { UserPlus, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

import { patientRegistrationSchema } from '../../validators/auth.validator';
import { FormInput, FormSelect } from '../ui/forms/Form';
import authApi from '../../services/api/auth.api';
import { ROUTES } from '../../constants/routes';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

export const PatientRegistrationForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const methods = useForm({
    resolver: zodResolver(patientRegistrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: 'Male',
      dateOfBirth: '',
      phone: '',
      bloodType: '',
      zipCode: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: '',
    },
    mode: 'onChange',
  });

  const passwordValue = useWatch({ control: methods.control, name: 'password' });

  const onSubmit = async (values) => {
    setApiError(null);
    setIsLoading(true);

    try {
      await authApi.registerPatient(values);
      setIsSuccess(true);
      toast.success('Patient account registered successfully!');
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.message || 'Failed to register account. Please check your details.';
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Registration Successful!</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Your patient account has been created. Redirecting to the login page...
        </p>
        <div className="pt-4">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Go to Login
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

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput name="firstName" label="First Name *" placeholder="John" />
          <FormInput name="lastName" label="Last Name *" placeholder="Doe" />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput name="email" label="Email Address *" type="email" placeholder="john.doe@example.com" />
          <FormInput name="phone" label="Phone Number" placeholder="+1 (555) 000-0000" />
        </div>

        {/* Gender & Date of Birth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormSelect
            name="gender"
            label="Gender *"
            options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' },
            ]}
          />
          <FormInput name="dateOfBirth" label="Date of Birth *" type="date" />
        </div>

        {/* Blood Type & Zip Code */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormSelect
            name="bloodType"
            label="Blood Type"
            placeholder="Select blood type..."
            options={[
              { value: 'A+', label: 'A+' },
              { value: 'A-', label: 'A-' },
              { value: 'B+', label: 'B+' },
              { value: 'B-', label: 'B-' },
              { value: 'AB+', label: 'AB+' },
              { value: 'AB-', label: 'AB-' },
              { value: 'O+', label: 'O+' },
              { value: 'O-', label: 'O-' },
            ]}
          />
          <FormInput name="zipCode" label="Zip Code" placeholder="10001" />
        </div>

        {/* Password */}
        <div className="relative">
          <FormInput
            name="password"
            label="Password *"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground p-1 focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Password Strength Meter */}
        <PasswordStrengthIndicator password={passwordValue || ''} />

        {/* Confirm Password */}
        <div className="relative pt-2">
          <FormInput
            name="confirmPassword"
            label="Confirm Password *"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 mt-6"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              <span>Create Patient Account</span>
              <UserPlus className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="text-center pt-3 text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </div>
      </form>
    </FormProvider>
  );
};

export default PatientRegistrationForm;
