import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { History, LogOut, MessageCirclePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Chat } from "@/types/chat";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ChatHistory from "./ChatHistory";
import { useState } from "react";

interface ChatHeaderProps {
  currentChat: Chat | null;
  chats: Chat[];
  onChatSelect: (chat: Chat) => void;
  onNewChat: () => void;
  isAuthenticated: boolean;
}

const ChatHeader = ({ currentChat, chats, onChatSelect, onNewChat, isAuthenticated }: ChatHeaderProps) => {
  const navigate = useNavigate();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      navigate('/');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (err: any) {
      console.error('Logout failed:', err);
      toast({
        title: "Logout failed",
        description: err.message || "There was a problem logging out",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    navigate('/home');
  };

  const handleChatSelect = (chat: Chat) => {
    onChatSelect(chat);
    setIsHistoryOpen(false);
  };

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-2 flex-1 justify-center">
        <h1 className="text-xl font-bold">Chat</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="text-userMessage hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </Button>
        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <span className="sr-only">Open menu</span>
                •••
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={onNewChat}>
                <MessageCirclePlus className="mr-2 h-4 w-4" />
                <span>New Chat</span>
              </DropdownMenuItem>
              <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <SheetTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <History className="mr-2 h-4 w-4" />
                    <span>History</span>
                  </DropdownMenuItem>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="text-aiMessage font-arcade px-4 mt-5">Chat History</SheetTitle>
                  </SheetHeader>
                  <ChatHistory chats={chats} onChatSelect={handleChatSelect} />
                </SheetContent>
              </Sheet>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;