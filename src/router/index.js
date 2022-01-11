import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import { auth } from "../services/firebase/firebase";
const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    beforeEnter: (to, from, next) => {
      if (auth.currentUser) {
        console.log(auth.currentUser);
        next("/chat");
      } else {
        next();
      }
    },
  },
  {
    path: "/chat",
    name: "chat",
    component: () => import("../views/Chat.vue"),
    beforeEnter: (to, from, next) => {
      if (!auth.currentUser) {
        next("/login");
      } else {
        next();
      }
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    beforeEnter: (to, from, next) => {
      if (!auth.currentUser) {
        next("/login");
      } else {
        next();
      }
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
