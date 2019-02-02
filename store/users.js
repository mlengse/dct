export const state = () => ({
  user: false
});

export const mutations = {
  saveUser(state, authUser) {
    state.user = authUser
  },
  emptyUser(state) {
    state.user = false;
  }
};

export const getters = {
  getUser: ({ user }) => user
};
