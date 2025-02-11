import React from 'react';

export const AuthFooter = () => {
  return (
    <div className="text-center text-sm text-gray-500">
      <p>
        Protected by reCAPTCHA and subject to the{' '}
        <a href="/privacy" className="text-cyan-600 hover:text-cyan-500">
          Privacy Policy
        </a>{' '}
        and{' '}
        <a href="/terms" className="text-cyan-600 hover:text-cyan-500">
          Terms of Service
        </a>
        .
      </p>
    </div>
  );
};