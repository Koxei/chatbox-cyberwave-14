import React from 'react';

const AsciiTitle: React.FC = () => {
  return (
    <pre className="font-arcade text-[#7FDBFF] text-center whitespace-pre leading-none text-xs sm:text-sm mb-4">
{`
 ███████╗███╗   ███╗██╗
 ██╔════╝████╗ ████║██║
 █████╗  ██╔████╔██║██║
 ██╔══╝  ██║╚██╔╝██║██║
 ███████╗██║ ╚═╝ ██║██║
 ╚══════╝╚═╝     ╚═╝╚═╝

`}</pre>
  );
};

export default AsciiTitle;