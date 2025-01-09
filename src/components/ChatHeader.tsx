import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { History, LogOut } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { supabase } from "@/integrations/supabase/client";
  const ChatHeader = () => {
    const handleLogout = async () => {
      await supabase.auth.signOut();
    };
    return (
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">Chat</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <span className="sr-only">Open menu</span>
              •••
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem>
              <History className="mr-2 h-4 w-4" />
              <span>History</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };
  export default ChatHeader;