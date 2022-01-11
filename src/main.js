import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { auth } from "./services/firebase/firebase";

const unsubscribe = auth.onAuthStateChanged((user) => {
  let u = null;
  if (user) {
    u = {
      displayName: user.displayName,
      email: user.email,
      uid: user.uid,
      photoURL: user.photoURL,
    };
  }

  store.dispatch("setUser", u || user);
  createApp(App).use(store).use(router).mount("#app");
  unsubscribe();
});
