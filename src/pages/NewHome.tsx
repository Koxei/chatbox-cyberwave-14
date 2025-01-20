import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/chat/hooks/useAuth";
import { useGuestSession } from "@/features/chat/hooks/useGuestSession";
import AuthModal from "@/features/auth/components/AuthModal";
import { Terminal as TerminalIcon } from "lucide-react";
import { MessageSquare } from "lucide-react";

const NewHome = () => {
  const navigate = useNavigate();
  const { isAuthenticated, showAuthModal, setShowAuthModal, isResettingPassword, setIsResettingPassword } = useAuth();
  const { isGuest, initGuestSession } = useGuestSession();

  const handleGuestLogin = () => {
    initGuestSession();
    navigate('/home', { replace: true });
  };

  if (!isAuthenticated && !isGuest) {
    return (
      <div className="fixed inset-0 bg-black/80">
        <AuthModal 
          isOpen={true}
          onPasswordResetStart={() => setIsResettingPassword(true)}
          onPasswordResetComplete={() => {
            setIsResettingPassword(false);
            if (isAuthenticated) {
              setShowAuthModal(false);
            }
          }}
          onGuestLogin={handleGuestLogin}
        />
      </div>
    );
  }

  const apps = [
    {
      name: "Chatbox",
      icon: <MessageSquare className="w-12 h-12" />,
      path: "/chatbox",
      description: "Chat with AI",
      gradient: "from-cyan-500/30 to-blue-500/30"
    },
    {
      name: "Terminal",
      icon: <TerminalIcon className="w-12 h-12" />,
      path: "/terminal",
      description: "Command Interface",
      gradient: "from-purple-500/30 to-pink-500/30"
    }
  ];

  return (
    <div className="fixed inset-0 bg-deep-sea-blue overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-deep-sea-blue via-[#1a1b4b] to-[#4a1942] animate-gradient-shift"></div>
      
      {/* Content container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {apps.map((app) => (
            <div
              key={app.name}
              onClick={() => navigate(app.path)}
              className="group relative cursor-pointer"
            >
              {/* Bubble container */}
              <div className="relative transform transition-all duration-300 group-hover:translate-y-[-8px]">
                {/* Outer glow */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${app.gradient} blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`}></div>
                
                {/* Main bubble */}
                <div className="relative bg-black/20 backdrop-blur-xl rounded-full p-8 border border-white/10 shadow-lg transform transition-all duration-300">
                  {/* Glass effect overlay */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-transparent"></div>
                  
                  {/* Content */}
                  <div className="relative flex flex-col items-center space-y-4">
                    {/* Icon container with glow */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full transform scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative text-cyan-500 transform transition-transform duration-300 group-hover:scale-110">
                        {app.icon}
                      </div>
                    </div>
                    
                    {/* Text */}
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-white mb-1">{app.name}</h3>
                      <p className="text-sm text-cyan-300/80">{app.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewHome;