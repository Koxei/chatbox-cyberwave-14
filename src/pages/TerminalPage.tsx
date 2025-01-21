import { Terminal } from "@/components/Terminal/Terminal";

interface TerminalPageProps {
  onClose?: () => void;
}

const TerminalPage = ({ onClose }: TerminalPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-deep-sea-blue">
      <Terminal />
    </div>
  );
};

export default TerminalPage;