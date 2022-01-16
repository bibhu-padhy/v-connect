<template>
  <div class="chat_wrapper">
    <div class="users_list">
      <div class="text-center" v-if="usersList.length === 0">No User</div>
      <User
        v-for="user in usersList"
        @click="getMessages(user)"
        :key="user.uid"
        :user="user"
      />
    </div>
    <div class="messaging_container">
      <message />
    </div>
  </div>
</template>

<script>
import { firestore, database, auth } from "../services/firebase/firebase";
import User from "../components/User.vue";
import { useStore, mapGetters } from "vuex";
import Message from "../components/Message.vue";
import moment from "moment";
export default {
  name: "Chat",
  components: { User, Message },
  data() {
    return {
      store$: useStore(),
      usersList: [],
      messageRef: firestore.collection("messages"),
      usersListRB_Ref: (uid = "") => database.ref("/usersList/" + uid),
      userCollectionRef: firestore.collection("usersList"),
      conversationIdsCollectionRef: (uid = "") =>
        firestore.collection("/conversationIds/" + uid),
    };
  },
  methods: {
    getChatUsers() {},
    async getConverSationsIds() {
      const res = await this.conversationIdsCollectionRef()
        .doc(this.loggedinUserUid)
        .collection("ids")
        .get();
      if (res.empty) return; // no chat users for this logged in user
      const usersRef = await await this.userCollectionRef.get(); // if logged in user has chat user
      if (usersRef.empty) return;
      const users = [];
      console.log(res);
      res.docs.forEach((doc) => {
        usersRef.docs.forEach((user) => {
          if (doc.data().recipiant === user.data().uid) {
            users.push({ ...user.data(), lastMessage: doc.data().lastMessage });
          }
        });
      });
      this.usersList = users;
    },
    getMessages(user) {
      this.store$.dispatch("setCurrentChatUser", user);
      this.messageRef
        .doc(this.setChatId(user))
        .collection("chat")
        .orderBy("timestamp")
        .onSnapshot((snap) => {
          if (!snap.empty) {
            const messages = [];
            snap.docs.forEach((msg) => {
              messages.push(msg.data());
            });
            this.store$.dispatch("setCurrentChatUserMessages", messages);
          } else {
            this.store$.dispatch("setCurrentChatUserMessages", []);
          }
        });
    },
    setChatId(user) {
      return user.uid < this.loggedinUserUid
        ? user.uid + this.loggedinUserUid
        : this.loggedinUserUid + user.uid;
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
          // this.usersList = users;
          console.log(users);
        }
      });
    },
  },
  computed: {
    ...mapGetters(["loggedinUserUid"]),
  },
  mounted() {
    this.getConverSationsIds();
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
