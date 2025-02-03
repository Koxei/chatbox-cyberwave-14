import { LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const GuestChatHeader = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('guest_session');
      localStorage.removeItem('guest_chat');
      navigate('/');
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (err: any) {
      console.error('Logout failed:', err);
      toast({
        title: "Logout failed",
        description: err.message || "There was a problem logging out",
        variant: "destructive",
      });
      navigate('/');
    }
  };

  const handleClose = () => {
    navigate('/home');
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-50">
      <div className="relative flex justify-between items-center p-4">
        <div className="absolute inset-x-0 flex justify-center items-center">
          <div className="border border-userMessage px-5 py-3 rounded">
            <h1 className="text-xl font-bold">Chat</h1>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2 ml-auto">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleClose}
            className="text-userMessage hover:text-white transition-colors p-2"
          >
            <X className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={handleLogout}
            className="text-userMessage hover:text-white transition-colors p-2"
          >
            <LogOut className="h-7 w-7" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuestChatHeader;