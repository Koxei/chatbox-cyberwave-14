import { Outlet } from "react-router-dom";

const SharedLayout = () => {
  return (
    <div className="min-h-screen bg-deep-sea-blue">
      <Outlet />
    </div>
  );
};

export default SharedLayout;