<template>
  <div class="users_list_container">
    <div
      @click.prevent="$emit('start-chat', user)"
      class="user_card"
      v-for="user in usersList"
      :key="user.uid"
    >
      <img :src="user?.photoURL" :alt="user.displayName" />
      <div class="user_name">
        {{ user.displayName }}
        {{ user.online ? "online" : "offline" }}
        <div v-if="user.online === false">
          {{ user.lastChanged }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UsersList",
  props: ["usersList"],
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
