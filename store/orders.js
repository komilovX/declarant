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
  },
  async createOrder({ commit }, fd) {
    try {
      return await this.$axios.$post(`api/orders`, fd)
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },


  // Decorated documents
  async addDecoratedDocuments({ commit }, {id, form}) {
    try {
      return await this.$axios.$post(`api/orders/${id}/decorated`, {documents: form})
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },

  async findDecoratedDocumentsByOrderId({commit}, id ) {
    try {
      return await this.$axios.$get(`api/orders/${id}/decorated`)
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },

  async deleteDecoratedDocument({ commit }, id) {
    try {
      return await this.$axios.$delete(`api/orders/${id}/decorated`)
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },
  async updateDecoratedDocumentFile({commit}, {id, formData}) {
    try {
      return await this.$axios.$put(`api/orders/${id}/decorated`, formData, {progress: false})
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },


  // Declarant
  async addDeclarantDocuments({ commit }, {id, form}) {
    try {
      return await this.$axios.$post(`api/orders/declarant/${id}`, {documents: form})
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },
  async findDeclarantDocumentsByOrderId({commit}, id ) {
    try {
      return await this.$axios.$get(`api/orders/${id}/declarant`)
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },
  async deleteDeclarantdDocument({ commit }, id) {
    try {
      return await this.$axios.$delete(`api/orders/declarant/${id}`)
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },
}
