import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Landing from "@/components/Landing";

import Index from "@/pages/Index";

const router = createBrowserRouter([

{

path: "/",
element: <Landing />,
},

{

path: "/home",
element: <Index />,
},

]);

export const Router = () => {

return <RouterProvider router={router} />;

};

