<template>
  <div class="users_list_container">
    <div @click.prevent="$emit('start-chat', user)" class="user_card">
      <img :src="user?.photoURL" :alt="user.displayName" />
      <div class="user_name">
        {{ user.displayName }}
        {{ user.online ? "online" : "offline" }}
        <div>
          {{ showFromNow(user.lastChanged) }}
        </div>
        <div v-if="user?.lastMessage">
          {{ user.lastMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "UsersList",
  props: ["user"],
  methods: {
    showFromNow(date) {
      if (
        moment(date).month() === moment(new Date()).month() &&
        moment(date).date() === moment(new Date()).date()
      ) {
        return "Today";
      } else if (
        moment(date).month() === moment(new Date()).month() &&
        moment(date).date() - 1 === moment(new Date()).date() - 1
      ) {
        return "Yesterday";
      }
      return moment(new Date(date)).format("ddd Do YY");
    },
  },
};
</script>
<style scoped>
.users_list_container .user_card {
  display: flex;
  align-items: center;
  background-color: cornsilk;
  padding: 5px;
  border-radius: 15px;
  margin-bottom: 5px;
}
.user_card img {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 1px solid black;
}
.user_card .user_name {
  flex: 1;
  margin: 0 5px;
}
</style>
