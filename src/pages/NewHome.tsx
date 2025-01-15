import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/chat/hooks/useAuth";
import { useEffect } from "react";

const NewHome = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isGuest } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isGuest) {
      navigate("/");
    }
  }, [isAuthenticated, isGuest, navigate]);

  const apps = [
    { id: 1, name: "Chatbox", route: "/chatbox" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
        {apps.map((app) => (
          <div
            key={app.id}
            onClick={() => navigate(app.route)}
            className="flex cursor-pointer flex-col items-center transition-transform hover:scale-105"
          >
            <div className="h-24 w-24 rounded-xl bg-black shadow-lg sm:h-32 sm:w-32" />
            <p className="mt-3 font-arcade text-sm text-white">{app.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewHome;