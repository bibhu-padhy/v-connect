<template>
  <div>
    <Spinner v-if="loading.isLoading" :message="loading.message" />
    <Header v-if="currentUser" />
    <router-view />
  </div>
</template>
<script>
import Spinner from "./components/Spinner.vue";
import Header from "./components/Header.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    Spinner,
    Header,
  },
  computed: {
    ...mapGetters(["currentUser", "loading"]),
  },
};
</script>
<style>
* {
  font-family: "Roboto", sans-serif !important;
}
.loading {
  position: fixed;
  z-index: 1000;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  /* backdrop-filter: grayscale(0.5) opacity(0.8); */
}
</style>
