export const state = () => ({
  error: null,
  authError: null,
})

export const mutations = {
  setError(state, error) {
    state.error = error
  },
  setAuthError(state, error) {
    state.authError = error
  },
  clearError(state) {
    state.error = null
  },
}
export const actions = {
  nuxtClientInit({ dispatch }) {
    dispatch('auth/autoLogin')
  },
}

export const getters = {
  error: (state) => state.error,
  authError: (state) => state.authError,
}
