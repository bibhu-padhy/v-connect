import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { auth } from "./services/firebase/firebase";
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'

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
  createApp(App).use(Quasar, quasarUserOptions).use(store).use(router).mount("#app");
  unsubscribe();
});
