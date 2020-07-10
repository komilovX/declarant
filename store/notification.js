export const state = () => ({
  notifications: [],
})

export const mutations = {
  setNotification(state, notifications) {
    state.notifications = notifications
  },
  changeToWatched(state) {
    state.notifications = state.notifications.map((note) => ({
      ...note,
      watched: true,
    }))
  },
  clearNotification(state) {
    state.notifications = []
  },
  deleteMessage(state, id) {
    state.notifications = state.notifications.filter((m) => m.id != id)
  },
}

export const actions = {
  async fetchNotifications({ commit }) {
    try {
      const notifications = await this.$axios.$get(`api/notification`)
      commit('setNotification', notifications)
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },
  async createNotifications({ commit }, formData) {
    try {
      return await this.$axios.$post('api/notification', formData)
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },
  async changeToWatched({ commit }) {
    try {
      await this.$axios.$put('api/notification')
      commit('changeToWatched')
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },
  async deleteNotification({ commit }, id) {
    try {
      await this.$axios.$delete(`api/notification/${id}`)
      commit('deleteMessage', id)
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },
}

export const getters = {
  notifications: (state) => state.notifications,
}
