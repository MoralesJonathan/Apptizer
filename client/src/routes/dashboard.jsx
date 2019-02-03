import Dashboard from "../views/Dashboard/Dashboard";
import UserProfile from "../views/UserProfile/UserProfile";
import TableList from "../views/TableList/TableList";
import Typography from "../views/Typography/Typography";
import Icons from "../views/Icons/Icons";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard
  },
  {
    path: "/restaurantInfo",
    name: "Restaurant Profile",
    icon: "pe-7s-portfolio",
    component: UserProfile
  },
  {
    path: "/loyalty",
    name: "Loyalty Program",
    icon: "pe-7s-wallet",
    component: TableList
  },
  {
    path: "/menu",
    name: "Menu",
    icon: "pe-7s-news-paper",
    component: Typography
  },
  { path: "/ordering",
  name: "Online Ordering",
  icon: "pe-7s-cart",
  component: Icons
  },
  { path: "/locations",
  name: "Locations and Hours",
  icon: "pe-7s-map",
  component: Icons
  },
  { path: "/partners",
  name: "Merchant Partners",
  icon: "pe-7s-plugin",
  component: Icons
  },
  { support: true,
  path: "/support",
  name: "Contact Support",
  icon: "pe-7s-help1",
  component: Icons
  },
  { redirect: true, path: "/", to: "/dashboard", name: "Dashboard" }
];

export default dashboardRoutes;
