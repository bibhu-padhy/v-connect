<template>
  <div class="chat_wrapper">
    <div class="users_list">
      <div class="text-center" v-if="usersList.length === 0">No User</div>
      <UsersList @start-chat="startChat" :usersList="usersList" />
    </div>
    <div class="messaging_container">
      <message />
    </div>
  </div>
</template>

<script>
import { firestore, database, auth } from "../services/firebase/firebase";
import UsersList from "../components/UsersList.vue";
import { mapGetters, useStore } from "vuex";
import Message from "../components/Message.vue";
import moment from "moment";
export default {
  name: "Chat",
  components: { UsersList, Message },
  data() {
    return {
      store$: useStore(),
      usersList: [],
      messageRef: firestore.collection("messages"),
      usersListRB_Ref: (uid = "") => database.ref("/usersList/" + uid),
      userCollectionRef: firestore.collection("usersList"),
    };
  },
  methods: {
    getMessages(user) {
      this.messageRef
        .doc(this.setChatId(user.uid))
        .collection("chat")
        .get()
        .then((snap) => {
          snap.docs.forEach((msg) => {
            console.log(msg);
            console.log(msg.data());
          });
        });
    },
    setChatId(user) {
      return user.uid < this.loggedinUserUid
        ? user.uid + this.loggedinUserUid
        : this.loggedinUserUid + user.uid;
    },
    startChat(user) {
      this.store$.dispatch("setCurrentChatUser", user);
      this.getMessages(user);
    },
    getChatUsersList() {
      this.usersListRB_Ref().on("value", (snap) => {
        const users = [];
        if (snap.exists) {
          Object.values(snap.val()).forEach((user) => {
            if (user.uid !== auth.currentUser.uid) {
              user.lastChanged = moment(user.lastChanged).fromNow();
              users.push(user);
            }
          });
          this.usersList = users;
          console.log(users);
        }
      });
    },
  },
  computed: {},
  mounted() {
    database.ref(".info/connected").on("value", async (snapshot) => {
      if (snapshot.val() === true) {
        this.usersListRB_Ref(auth.currentUser.uid)
          .onDisconnect()
          .update({ online: false, lastChanged: new Date() });
        this.usersListRB_Ref(auth.currentUser.uid).update({
          online: true,
          lastChanged: new Date(),
        });
      }
    });
    this.getChatUsersList();
  },
};
</script>
<style scoped>
.chat_wrapper {
  display: flex;
  padding: 10px;
}
.users_list {
  width: 35%;
}
.messaging_container {
  width: 65%;
  margin-left: 10px;
}
</style>
