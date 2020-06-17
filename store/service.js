export const actions = {
  async getDocuments({ commit }) {
    try {
      return this.$axios.$get("api/service/document");
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  },
  async createDocument({ commit }, formData) {
    try {
      return this.$axios.$post("api/service/document", formData);
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  },
  async deleteDocument({ commit }, id) {
    try {
      return this.$axios.$delete(`api/service/document/${id}`);
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  },
};
