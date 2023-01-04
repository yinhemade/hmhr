import { requestOfLogin, requestOfUserMessage, requestOfBaseInfo } from '@/api'
import { getToken, setToken, removeToken } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: {},
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
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  REMOVE_TOKEN: (state) => {
    state.token = ''
    removeToken()
  },
  // 获取用户信息
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  // 删除用户信息
  REMOVE_USER_INFO: (state) => {
    state.userInfo = {}
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
  async getUserInfo({ commit }) {
    const { data: userObj } = await requestOfUserMessage()
    const { data: photoObj } = await requestOfBaseInfo(userObj.userId)
    commit('SET_USER_INFO', { ...userObj, ...photoObj })
    return userObj
  },

  // 登出：1.token过期、2.用户主动登出
  logout({ commit }) {
    // 删除本地
    commit('REMOVE_TOKEN')
    // 删除vuex的数据
    commit('REMOVE_USER_INFO')
  },

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

