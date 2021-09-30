import Index from "views/Index.js";
import RegisterForm from './components/login/registerComp';
import Login from './components/login/login';
import Profile from './components/Profile/profile';

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin",
  },
  {
    path: "/login",
    component: Login,
    layout: "/auth",
  },
  {
    path: "/register",
    component: RegisterForm,
    layout: "/auth",
  }
];
export default routes;
