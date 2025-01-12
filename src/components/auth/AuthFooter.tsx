export const AuthFooter = () => (
  <div className="text-center text-xs text-gray-500 mt-6">
    <div className="flex items-center justify-center space-x-2">
      <span>Protected by</span>
      <a 
        href="https://supabase.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block"
      >
        <img 
          src="/lovable-uploads/supabaselogo.png"
          alt="Supabase" 
          className="h-6"
        />
      </a>
    </div>
  </div>
);