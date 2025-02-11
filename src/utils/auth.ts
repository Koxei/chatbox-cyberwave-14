import { AuthError, AuthApiError } from '@supabase/supabase-js';

export const getAuthErrorMessage = (error: AuthError): string => {
  if (error instanceof AuthApiError) {
    switch (error.status) {
      case 400:
        return 'Invalid email or password';
      case 422:
        return 'Email already registered';
      case 429:
        return 'Too many attempts, please try again later';
      default:
        return error.message;
    }
  }
  return error.message;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};