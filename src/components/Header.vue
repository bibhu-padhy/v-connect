<template>
  <div class="header_container">
    <button class="btn" @click="$router.push('/users-list')">New Chat</button>
    <span>{{ currentLoggedinUser.displayName }}</span>
    <img
      @click="$router.push('/profile')"
      :src="currentLoggedinUser?.photoURL"
      alt=""
    />
    <button class="btn btn-outline-secondary btn-sm mx-2" @click="logout">
      Logout
    </button>
  </div>
</template>

<script>
import { auth, firestore } from "../services/firebase/firebase";
import { mapState } from "vuex";
export default {
  name: "Header",
  data() {
    return {
      userCollectionRef: firestore.collection("usersList"),
    };
  },
  methods: {
    logout() {
      // this.userCollectionRef
      //   .doc(auth.currentUser.uid)
      //   .set({ online: false }, { merge: true })
      //   .then(() => {
      //     });
      auth.signOut().then(() => {
        this.$router.push("/");
        this.$store.dispatch("setUser", null);
      });
    },
    mounted() {
      console.log(this.currentLoggedinUser);
    },
  },
  computed: {
    ...mapState({
      currentLoggedinUser: (state) => state.currentUser,
    }),
  },
};
</script>
<style scoped>
.header_container {
  height: 8vh;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 10px;
  background-color: #fd9a75;
}
.header_container img {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  margin: 0 10px;
  cursor: pointer;
}
</style>
