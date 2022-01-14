export default {
  namespaced: true,
  state: {
    name: 'moduleA'
  },
  getters: {
    getName(state) {
      return state.name
    }
  },
  mutations: {
    CHANGE_NAME(state, name) {
      state.name = name
    }
  },
  actions: {
    changeNameAction({ commit }, name) {

      setTimeout(() => {
        commit('CHANGE_NAME', name)
      }, 2000);
    }
  }
}