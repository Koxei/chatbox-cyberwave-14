import { Outlet } from "react-router-dom";

export const SharedLayout = () => {
  return (
    <div className="min-h-screen bg-deep-sea-blue">
      <Outlet />
    </div>
  );
};