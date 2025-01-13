import { useNavigate } from "react-router-dom";
import AuthModal from "@/features/auth/components/AuthModal";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/80">
      <AuthModal 
        isOpen={true}
        onPasswordResetStart={() => {}}
        onPasswordResetComplete={() => {}}
        onGuestLogin={() => navigate('/home')}
      />
    </div>
  );
};

export default Login;