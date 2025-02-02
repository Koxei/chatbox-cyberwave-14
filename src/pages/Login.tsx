// src/pages/Login.tsx
import { useNavigate } from "react-router-dom";
import AuthModal from "@/features/auth/components/AuthModal";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0">
      <div className="relative z-10">
        <AuthModal 
          isOpen={true}
          onPasswordResetStart={() => {}}
          onPasswordResetComplete={() => {}}
          onGuestLogin={() => navigate('/home')}
        />
      </div>
    </div>
  );
};

export default Login;
