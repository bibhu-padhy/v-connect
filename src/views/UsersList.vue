<template>
  <div v-for="user in listOfUsers" :key="user.uid">
    {{ user.displayName }}
    <input @change.prevent="inputChange" type="text" />
    <button @click="sendMsg(user)">send</button>
  </div>
</template>
<script>
import { firestore } from "../services/firebase/firebase";
import { mapGetters } from "vuex";
export default {
  name: "UsersList",
  data() {
    return {
      inputValue: null,
      listOfUsers: null,
      userCollectionRef: firestore.collection("usersList"),
      conversationIdCollectionRef: firestore.collection("conversationIds"),
    };
  },
  methods: {
    setChatId(user) {
      return user.uid < this.loggedinUserUid
        ? user.uid + this.loggedinUserUid
        : this.loggedinUserUid + user.uid;
    },
    inputChange(e) {
      console.log(e.target.value);
    },
    sendMsg(user) {
      this.conversationIdCollectionRef.doc(user.uid).collection("ids").add({
        recipiant: this.loggedinUserUid,
        lastMessage: "test message",
        isActive: true,
      });
      this.conversationIdCollectionRef
        .doc(this.loggedinUserUid)
        .collection("ids")
        .add({
          recipiant: user.uid,
          lastMessage: "test message",
          isActive: true,
        });
    },
    getUsers() {
      this.userCollectionRef.get().then((res) => {
        if (res.empty) return;
        const users = [];
        res.docs.forEach((doc) => {
          if (doc.data().uid !== this.loggedinUserUid) {
            users.push(doc.data());
          }
        });
        this.listOfUsers = users;
      });
    },
  },
  created() {
    this.getUsers();
  },
  computed: {
    ...mapGetters(["loggedinUserUid"]),
  },
};
</script>
<style lang=""></style>
