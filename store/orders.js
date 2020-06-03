export const actions = {
  async updateDeclarantDocumentById({ commit }, { id, formData }) {
    try {
      return await this.$axios.$put(`api/orders/declarant/${id}`, formData, {progress: false})
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },
  async updateStatusDeclarantDocumentById({ commit }, { id, formData }) {
    try {
      return await this.$axios.$put(`api/orders/declarant/status/${id}`, formData, {progress: false})
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  }
}
