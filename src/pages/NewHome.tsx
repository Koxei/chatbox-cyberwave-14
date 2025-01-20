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
      gradient: "from-cyan-500/30 to-blue-500/30"
    },
    {
      name: "Terminal",
      icon: <TerminalIcon className="w-12 h-12" />,
      path: "/terminal",
      gradient: "from-purple-500/30 to-pink-500/30"
    }
  ];

  return (
    <div className="fixed inset-0 bg-deep-sea-blue overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/lovable-uploads/73e97728-d0f0-4a4f-8e49-34667bc28380.png')" }}
      />
      
      {/* Content container - at bottom */}
      <div className="relative z-10 min-h-screen flex flex-col justify-end pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
          {apps.map((app) => (
            <div
              key={app.name}
              onClick={() => navigate(app.path)}
              className="group relative cursor-pointer"
            >
              {/* Shadow layer */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full blur-lg opacity-80 transition-all duration-300 group-hover:scale-75 group-hover:opacity-60 z-0"></div>
              
              {/* Bubble container with new image */}
              <div className="relative z-10 transform transition-all duration-300 group-hover:-translate-y-4">
                {/* Icon container positioned behind bubble */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="text-cyan-500 transform transition-transform duration-300 group-hover:scale-110">
                    {app.icon}
                  </div>
                </div>
                
                {/* Bubble image */}
                <div className="relative w-32 h-32 z-20">
                  <img 
                    src="/lovable-uploads/95016ec6-cadc-4408-a74c-c30ae449770e.png"
                    alt="bubble"
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
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