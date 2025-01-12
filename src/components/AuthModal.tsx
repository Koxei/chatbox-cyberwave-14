const AuthModal = ({

  isOpen,
  
  onPasswordResetStart,
  
  onPasswordResetComplete
  
  }: AuthModalProps) => {
  
  const [isLogin, setIsLogin] = useState(true);
  
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  
  const [resetStep, setResetStep] = useState<'email' | 'otp' | 'password'>('email');
  
  console.log('AuthModal render - States:', { isOpen, showPasswordReset, resetStep });
  
  // Keep dialog open during password reset
  
  const keepOpen = isOpen || showPasswordReset;
  
  console.log('keepOpen value:', keepOpen);
  
  // Handle password reset state changes
  
  const handlePasswordResetStart = () => {
  
  console.log('handlePasswordResetStart called');
  setShowPasswordReset(true);
  setResetStep('email');
  onPasswordResetStart?.();
  };
  
  const handlePasswordResetComplete = () => {
  
  console.log('handlePasswordResetComplete called');
  setShowPasswordReset(false);
  setResetStep('email');
  onPasswordResetComplete?.();
  };
  
  const handleBackToLogin = () => {
  
  console.log('handleBackToLogin called');
  setShowPasswordReset(false);
  setResetStep('email');
  setIsLogin(true);
  };
  
  const handleStepChange = (step: 'email' | 'otp' | 'password') => {
  
  console.log('handleStepChange called with step:', step);
  setResetStep(step);
  setShowPasswordReset(true);
  };
  
  // Add useEffect to track state changes
  
  useEffect(() => {
  
  console.log('State changed:', { isLogin, showPasswordReset, resetStep, keepOpen });
  }, [isLogin, showPasswordReset, resetStep, keepOpen]);
  
  return (
  
  <Dialog open={keepOpen} modal>
    <DialogContent className="sm:max-w-[425px] bg-white text-black p-6">
      <div className="space-y-6">
        <AuthHeader 
          isLogin={isLogin} 
          showPasswordReset={showPasswordReset}
          resetStep={resetStep}
        />
        <AuthForm 
          isLogin={isLogin} 
          redirectURL={redirectURL}
          onToggle={() => {
            console.log('AuthForm toggle called');
            setIsLogin(!isLogin);
          }}
          showPasswordReset={showPasswordReset}
          setShowPasswordReset={handlePasswordResetStart}
          resetStep={resetStep}
          setResetStep={handleStepChange}
          onPasswordResetComplete={handlePasswordResetComplete}
          onBackToLogin={handleBackToLogin}
        />
        <AuthFooter />
      </div>
    </DialogContent>
  </Dialog>
  );
  
  };
