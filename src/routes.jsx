import {
  HomeIcon,
  BoltIcon,
  GlobeAmericasIcon,
  TruckIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Energy, Environment, Mobility } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
        roles: ["areamanager","admin", "user", "manager"], // allowed roles
      },
      {
        icon: <BoltIcon {...icon} />,
        name: "energy",
        path: "/energy",
        element: <Energy />,
        roles: ["areamanager","admin", "manager"], // μόνο admin
      },
      {
        icon: <GlobeAmericasIcon {...icon} />,
        name: "environment",
        path: "/environment",
        element: <Environment />,
        roles: ["areamanager","admin", "manager"], // admin + manager
      },
      {
        icon: <TruckIcon {...icon} />,
        name: "mobility",
        path: "/mobility",
        element: <Mobility />,
        roles: ["areamanager","user", "admin"], // user + admin
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
        roles: ["*"], // public
      },
    ],
  },
];



export default routes;
