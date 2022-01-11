<template>
  <!-- <div class="no_user text-center" v-if="!currentChatUser"></div> -->
  <div v-if="currentChatUser" class="chat_screen_container">
    <div class="chat_screen_header">
      <img :src="currentChatUser.photoURL" :alt="currentChatUser.displayName" />
      <div></div>
    </div>
    <div class="chat_screen_body"></div>
    <div class="chat_screen_input"></div>
    <!-- <input v-model="inputValue" type="text" @keyup.enter="newMessage" /> -->
  </div>
</template>

<script>
import { firestore } from "../services/firebase/firebase";
import { mapGetters } from "vuex";
import UsersListModal from "./UsersListModal.vue";
export default {
  components: { UsersListModal },
  name: "Message",
  data() {
    return {
      messageRef: firestore.collection("messages"),
      inputValue: "",
    };
  },
  methods: {
    newMessage() {
      const chatId = this.$parent.setChatId(this.currentChatUser);
      const payload = {
        message: this.inputValue,
        timestamp: new Date(),
        user: this.currentUser,
      };
      this.messageRef.doc(chatId).collection("chat").add(payload);
      this.inputValue = "";
    },
  },
  mounted() {
    console.log();
  },
  computed: {
    ...mapGetters(["loggedinUserUid", "currentChatUser", "currentUser"]),
  },
};
</script>

<style scoped>
.no_user {
  height: 89vh;
  background-color: #c9f4f6;
  border-radius: 15px;
}
.chat_screen_container {
  /* display: flex; */
}
.chat_screen_header {
  height: 50px;
  width: fit-content;
  border-radius: 15px;
  background-color: #c5f7cf;
  display: flex;
}
.chat_screen_header img {
  height: 50px;
  width: 50px;
  border-radius: 50%;
}
</style>
