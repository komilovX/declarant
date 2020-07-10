export const actions = {
  async getDocuments({ commit }) {
    try {
      return await this.$axios.$get('api/service/document')
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },

  async findAllUserTasks({ commit }, id) {
    try {
      return await this.$axios.$get(`api/service/task`)
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },

  async createDocument({ commit }, formData) {
    try {
      return await this.$axios.$post('api/service/document', formData)
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },

  async giveTask({ commit }, fd) {
    try {
      return await this.$axios.$post(`api/service/task`, fd)
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },

  async doTask({ commit }, { id, ...formData }) {
    try {
      return await this.$axios.$put(`api/service/task/${id}`, formData)
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },
  async deleteDocument({ commit }, id) {
    try {
      return await this.$axios.$delete(`api/service/document/${id}`)
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },
}
