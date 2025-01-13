export const AuthForm = ({
  isLogin,
  onToggle,
  redirectURL,
  showPasswordReset,
  setShowPasswordReset,
  resetStep,
  setResetStep,
  onPasswordResetComplete,
  onBackToLogin,
  onGuestLogin
}: AuthFormProps) => {
  if (showPasswordReset) {
    return (
      <PasswordResetFlow
        onBack={onBackToLogin}
        onSuccess={() => {
          onPasswordResetComplete?.();
          onBackToLogin();
        }}
        onStepChange={setResetStep}
        currentStep={resetStep}
      />
    );
  }

  const handleGuestLogin = () => {
    try {
      onGuestLogin?.();
    } catch (error) {
      console.error('Error during guest login:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Auth
        supabaseClient={supabase}
        view={isLogin ? "sign_in" : "sign_up"}
        appearance={{ 
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#00ffff',
                brandAccent: '#00cccc'
              }
            }
          },
          className: {
            container: 'space-y-4',
            label: 'text-sm font-medium text-gray-700',
            input: 'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500',
            button: 'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500',
            divider: 'my-4',
            anchor: 'text-sm text-cyan-600 hover:text-cyan-500'
          }
        }}
        providers={["google"]}
        redirectTo={redirectURL}
        showLinks={false}
        localization={{
          variables: {
            sign_in: {
              email_label: "Email",
              password_label: "Password",
              button_label: "Sign in",
              loading_button_label: "Signing in ...",
              social_provider_text: "Sign in with {{provider}}"
            },
            sign_up: {
              email_label: "Email",
              password_label: "Password",
              button_label: "Sign up",
              loading_button_label: "Signing up ...",
              social_provider_text: "Sign up with {{provider}}"
            }
          }
        }}
      />
      {isLogin && (
        <>
          <button
            onClick={() => setShowPasswordReset(true)}
            className="text-sm text-cyan-600 hover:text-cyan-500 w-full text-center"
          >
            Forgot password?
          </button>
          <button
            onClick={handleGuestLogin}
            className="w-full flex justify-center py-2 px-4 border border-cyan-600 rounded-md shadow-sm text-sm font-medium text-cyan-600 bg-white hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          >
            Continue as Guest
          </button>
        </>
      )}
      <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
        <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
        <button
          onClick={onToggle}
          className="text-cyan-600 hover:text-cyan-500 font-medium"
        >
          {isLogin ? "Sign up" : "Sign in"}
        </button>
      </div>
    </div>
  );
};
