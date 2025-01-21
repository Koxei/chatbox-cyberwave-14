import AppOverlay from "@/components/layouts/AppOverlay";

import { Terminal } from "@/components/Terminal/Terminal";

const TerminalPage = () => {

return (

<AppOverlay title="CYBERPUNK TERMINAL">
  <div className="min-h-screen flex items-center justify-center p-4 bg-deep-sea-blue">
    <Terminal />
  </div>
</AppOverlay>
);

};

export default TerminalPage;