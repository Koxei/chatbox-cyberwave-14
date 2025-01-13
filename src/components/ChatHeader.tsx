import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { History, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Chat } from "@/types/chat";

interface ChatHeaderProps {
  currentChat: Chat | null;
  chats: Chat[];
  onChatSelect: (chat: Chat) => void;
  onNewChat: () => void;
  isAuthenticated: boolean;
}

const ChatHeader = ({ currentChat, chats, onChatSelect, onNewChat, isAuthenticated }: ChatHeaderProps) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">Chat</h1>
        {isAuthenticated && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onNewChat}
            className="text-userMessage"
          >
            <Plus className="h-5 w-5" />
          </Button>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="sr-only">Open menu</span>
            •••
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          {isAuthenticated && (
            <>
              <DropdownMenuItem>
                <History className="mr-2 h-4 w-4" />
                <span>History</span>
                <DropdownMenu>
                  <DropdownMenuContent>
                    {chats.map((chat) => (
                      <DropdownMenuItem
                        key={chat.id}
                        onClick={() => onChatSelect(chat)}
                      >
                        {chat.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChatHeader;