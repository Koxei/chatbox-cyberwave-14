import AsciiTitle from "./AsciiTitle";

const Header = () => {
  return (
    <header className="w-full p-4 mb-8 relative z-10">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <a
            href="https://x.com/home"
            target="_blank"
            rel="noopener noreferrer"
            className="text-heading hover:opacity-80 transition-opacity"
          >
            <img 
              src="/lovable-uploads/354a3ed6-b88c-45d5-a696-6eb3bc0db0e9.png" 
              alt="X Logo" 
              width={40} 
              height={40}
              className="w-[40px] h-[40px]"
            />
          </a>
          <a
            href="https://x.com/home"
            target="_blank"
            rel="noopener noreferrer"
            className="text-heading hover:opacity-80 transition-opacity"
          >
            <img 
              src="/lovable-uploads/98d01e29-167d-4e94-9a5f-f3a5ecca26d7.png" 
              alt="X Logo" 
              width={38} 
              height={38}
              className="w-[38px] h-[38px]"
            />
          </a>
        </div>
        <AsciiTitle />
        <div className="w-[40px]"></div>
      </div>
    </header>
  );
};

export default Header;