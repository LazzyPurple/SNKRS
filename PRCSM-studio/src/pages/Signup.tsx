import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignupForm } from '../components/auth/SignupForm';
import { AuthLayout } from '../components/auth/AuthLayout';

export const Signup: React.FC = () => {
  const navigate = useNavigate();

  const handleSignupSuccess = () => {
    navigate('/account', { replace: true });
  };

  return (
    <AuthLayout>
      <SignupForm onSuccess={handleSignupSuccess} />
    </AuthLayout>
  );
};