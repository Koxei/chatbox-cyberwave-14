export const AUTH_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 6,
  OTP_LENGTH: 6,
  SESSION_EXPIRY: 3600,
  REDIRECT_URL: '/home',
} as const;

export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 6 characters',
  NETWORK_ERROR: 'Network error. Please check your connection',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const;