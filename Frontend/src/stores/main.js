import { defineStore } from "pinia";
import { reactive, toRefs } from "vue";
import axios from "axios";

export const useMainStore = defineStore("main", () => {
  const state = reactive({
    /* User */
    user: {
      name: null,
      email: null,
      avatar: null,
    },

    /* Field focus with ctrl+k (to register only once) */
    isFieldFocusRegistered: false,

    /* Sample data (commonly used) */
    clients: [],
    history: [],
  });

  const setUser = (payload) => {
    if (payload.name) {
      state.user.name = payload.name;
    }
    if (payload.email) {
      state.user.email = payload.email;
    }
    if (payload.avatar) {
      state.user.avatar = payload.avatar;
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/user/register"
      );
      if (response && response.data) {
        state.clients = response.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getUser = () => {
    return state.user;
  };

  return {
    ...toRefs(state),
    setUser,
    fetchClients,
    getUser,
  };
});
