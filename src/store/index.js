import { createStore } from "vuex";
export default createStore({
  state: {
    loading: {
      isLoading: false,
      message: "",
    },
    currentUser: null,
    currentChatUser: null,
    chatUsersList: null,
    currentChatUserMessages: [],
  },
  mutations: {
    setUser(state, payload) {
      state.currentUser = payload;
    },
    setCurrentChatUser(state, payload) {
      state.currentChatUser = payload;
    },
    setChatUsersList(state, payload) {
      state.chatUsersList = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setCurrentChatUserMessages(state, payload) {
      state.currentChatUserMessages = payload;
    },
  },
  actions: {
    // async stuff goes here
    setUser({ commit }, payload) {
      commit("setUser", payload);
    },
    setCurrentChatUser({ commit }, payload) {
      commit("setCurrentChatUser", payload);
    },
    setChatUsersList({ commit }, payload) {
      commit("setChatUsersList", payload);
    },
    setLoading({ commit }, payload) {
      commit("setLoading", payload);
    },
    setCurrentChatUserMessages({ commit }, payload) {
      commit("setCurrentChatUserMessages", payload);
    },
  },
  getters: {
    currentUser: (state) => state.currentUser,
    currentChatUser: (state) => state.currentChatUser,
    loggedinUserUid: (state) => state.currentUser.uid || null,
    chatUsersList: (state) => state.chatUsersList,
    loading: (state) => state.loading,
    currentChatUserMessages: (state) => state.currentChatUserMessages,
  },
});
