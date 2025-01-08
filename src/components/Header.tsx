import AsciiTitle from "./AsciiTitle";

const Header = () => {
  return (
    <header className="w-full p-4 mb-8 relative z-10">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          </a>
          <a
            href="https://x.com/home"
            target="_blank"
            rel="noopener noreferrer"
            className="text-heading hover:opacity-80 transition-opacity"
          >
            <img 
              src="/lovable-uploads/nexx.png" 
              alt="X Logo" 
              width={48} 
              height={30}
              className="w-[48px] h-[30px]"
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