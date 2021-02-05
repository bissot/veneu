import Vue from "vue";
import VueRouter from "vue-router";

import AdminOverview from "./components/AdminOverview";
import AdminUsers from "./components/AdminUsers";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Voyager from "./pages/Voyager.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/admin",
      name: "AdminOverview",
      component: AdminOverview,
      meta: {
        auth: true
      }
    },
    {
      path: "/admin/users",
      name: "AdminUsers",
      component: AdminUsers,
      meta: {
        auth: true
      }
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
      meta: {
        auth: true
      }
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/signup",
      name: "Signup",
      component: Signup
    },
    {
      path: "/",
      name: "Landing",
      component: Landing
    },
    {
      path: "/voyager",
      name: "Voyager",
      component: Voyager,
      meta: {
        auth: true
      }
    }
  ],
  mode: "history"
});

router.beforeEach((to, from, next) => {
  if (from.name == "Voyager" || to.name != "Voyager") {
    var element = document.getElementById("voyager");
    if (element) element.parentNode.removeChild(element);
  }
  if (to.meta.auth && !localStorage.getItem("token")) next({ name: "Login", query: { redirect: to.path } });
  else next();
});

export default router;
