// src/pages/Login.tsx
import { useNavigate } from "react-router-dom";
import AuthModal from "@/features/auth/components/AuthModal";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0">
      {/* Background image with blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-xl brightness-50"
        style={{ backgroundImage: "url('/lovable-uploads/73e97728-d0f0-4a4f-8e49-34667bc28380.png')" }}
      />
      {/* Content overlay */}
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
