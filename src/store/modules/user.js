import { requestOfLogin } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
    setToken(token)
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  REMOVE_TOKEN: (state, token) => {
    state.token = ''
    removeToken()
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const res = await requestOfLogin(userInfo)
    commit('SET_TOKEN', res.data)
    return res
  },

  // get user info
  getInfo({ commit, state }) {},

  // user logout
  logout({ commit, state }) {},

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

