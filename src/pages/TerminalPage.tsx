// src/pages/TerminalPage.tsx
import { Terminal } from "@/components/Terminal/Terminal";
import AppOverlay from "@/components/layouts/AppOverlay";

const TerminalPage = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <Terminal />
    </div>
  );
};

export default TerminalPage;
