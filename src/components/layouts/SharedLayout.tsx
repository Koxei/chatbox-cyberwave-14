import { Outlet } from "react-router-dom";

const SharedLayout = () => {
  return (
    <div className="min-h-screen w-full bg-deep-sea">
      <Outlet />
    </div>
  );
};

export default SharedLayout;