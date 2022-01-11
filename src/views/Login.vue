<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <form class="w-25 m-3">
      <div class="d-grid gap-2">
        <button class="btn btn-outline-danger my-2" @click="login">
          Login with Google
        </button>
      </div>
      <h3>
        {{ isLogin ? "Login" : "Register" }}
      </h3>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" v-model="email" class="form-control" id="email" />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">password</label>
        <input class="form-control" v-model="password" id="password" />
      </div>
      <div v-if="isLogin">
        <button class="btn btn-primary mx-3" @click.prevent="emailLogin">
          Login
        </button>
        <a href="#" @click="isLogin = !isLogin">New User</a>
      </div>
      <div v-if="!isLogin">
        <button class="btn btn-primary mx-3" @click.prevent="emailRegister">
          Register
        </button>
        <a href="#" @click="isLogin = !isLogin">Exist User</a>
      </div>
    </form>
  </div>
</template>

<script>
import { GoogleAuthProvider } from "firebase/auth";
import { firestore, auth, database } from "../services/firebase/firebase";
export default {
  name: "Login",
  data() {
    return {
      isLogin: true,
      email: null,
      password: null,
      userCollectionRef: firestore.collection("usersList"),
      usersListRB_Ref: (uid = "") => database.ref("/usersList/" + uid),
    };
  },
  methods: {
    onboardUser(user) {
      const payload = {
        displayName: user.user.displayName || "",
        email: user.user.email,
        uid: user.user.uid,
        photoURL: user.user.photoURL || "",
        online: true,
      };
      if (user.additionalUserInfo.isNewUser) {
        // if logged in user is new then creating a new doc on realtime db
        this.usersListRB_Ref(user.user.uid).set(payload);
      }
      this.$store.dispatch("setUser", payload);
      this.$router.push("/chat");
    },
    async emailLogin() {
      const userRef = await auth.signInWithEmailAndPassword(
        this.email,
        this.password
      );
      if (userRef.user.uid) {
        this.onboardUser(userRef);
        console.log(userRef.user.uid);
        this.userCollectionRef.doc(userRef.user.uid);
      }
    },
    async emailRegister() {
      const user = await auth.createUserWithEmailAndPassword(
        this.email,
        this.password
      );
      if (user.user.uid) {
        this.onboardUser(user);
      }
    },
    login() {
      auth.signInWithPopup(new GoogleAuthProvider()).then((res) => {
        console.log(res);
        if (res.user.uid) {
          this.onboardUser(res);
        }
      });
    },
  },
  mounted() {
    console.log("its login page");
  },
};
</script>
<style lang="css"></style>
