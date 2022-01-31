<template>
  <!-- <div class="no_user text-center" v-if="!currentChatUser"></div> -->
  <div v-if="currentChatUser" class="chat_screen_container">
    <div class="chat_screen_header">
      <img :src="currentChatUser.photoURL" :alt="currentChatUser.displayName" />
      <div class="name">
        <div>
          {{ currentChatUser.displayName }}
        </div>
        <div
          :class="currentChatUser.online ? 'online_dot' : 'offline_dot'"
        ></div>
      </div>
    </div>
    <div class="chat_screen_body">
      <div
        :style="{
          'justify-content':
            message.user.uid !== loggedinUserUid ? 'flex-start' : 'flex-end',
        }"
        class="message_container"
        v-for="message in currentChatUserMessages"
        :key="message"
      >
        <div class="message">
          <div class="message_timestamp">
            {{ showFromNow(message.timestamp) }}
          </div>
          {{ message.message }}
        </div>
      </div>
    </div>
    <div class="chat_screen_input">
      <input
        v-model="inputValue"
        placeholder="Press Enter to send a message"
        type="text"
        @keyup.enter="newMessage"
      />
    </div>
  </div>
</template>

<script>
import { firestore } from "../services/firebase/firebase";
import { mapGetters } from "vuex";
import UsersListModal from "./UsersListModal.vue";
import moment from "moment";
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
    showFromNow(date) {
      if (
        moment(new Date(date.toDate())).fromNow() !== "a few seconds ago" &&
        moment(new Date(date.toDate())).fromNow() !== "a minute ago"
      ) {
        return moment(new Date(date.toDate())).format("ddd Do YY");
      }
      return moment(new Date(date.toDate())).fromNow();
    },
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
    console.log(new Date().toLocaleTimeString());
  },
  computed: {
    ...mapGetters([
      "loggedinUserUid",
      "currentChatUser",
      "currentUser",
      "currentChatUserMessages",
    ]),
  },
};
</script>

<style scoped>
.no_user {
  height: 89vh;
  background-color: #c9f4f6;
  border-radius: 15px;
}
.chat_screen_header {
  width: fit-content;
  border-radius: 15px;
  background-color: #c5f7cf;
  display: flex;
  padding: 5px 10px;
}
.chat_screen_header img {
  height: 50px;
  width: 50px;
  border-radius: 50%;
}
.chat_screen_header .name {
  margin: 0 10px;
  display: flex;
  align-items: center;
  height: fit-content;
}
.name .online_dot {
  background-color: #89ff89;
  box-shadow: 0 0 21px 3px #12c481;
  height: 15px;
  width: 15px;
  border-radius: 50%;
  margin: 0 10px;
}
.name .offline_dot {
  background-color: #8d918d;
  box-shadow: 0 0 21px 3px #898989;
  height: 15px;
  width: 15px;
  border-radius: 50%;
  margin: 0 10px;
}
.chat_screen_body {
  height: 72vh;
  border: 1px solid aqua;
  margin: 10px 0;
  width: 100%;
  border-radius: 18px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
}
.chat_screen_body .message_container {
  display: flex;
  margin-bottom: 10px;
}
.message {
  width: 40%;
  border: 1px solid #acffff;
  padding: 5px;
  border-radius: 10px;
}
.message .message_timestamp {
  font-size: 10px;
  color: cadetblue;
}
.chat_screen_input input {
  width: 100%;
  border: 1px solid aqua;
  padding: 7px;
  border-radius: 10px;
  outline: none;
}
</style>
