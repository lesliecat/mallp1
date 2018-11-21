import {
  // getUserInfo,
  logout,
  loginByUsername
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken,
  getRoles,
  setRoles
} from '@/utils/auth'
import axios from 'axios/index'
import element from 'element-ui'
import gen from '@/assets/js/gen'
import router from '../../router'
const successCode = '000000'

axios.defaults.withCredentials = true

// 加密
function creatPwd (pwd) {
  // let curve = 'SM2'
  // let ec = new KJUR.crypto.ECDSA({
  //   "curve" : curve
  // });
  // let keypair = ec.generateKeyPairHex();
  // let publickey = keypair.ecpubhex;
  // if (publickey.length > 64 * 2) {
  //   publickey = publickey.substr(publickey.length - 64 * 2);
  // }

  // let localGen = gen.prod
  let localGen = process.env.NODE_ENV === 'production' ? gen.prod : gen.test
  let xHex = localGen.x
  let yHex = localGen.y
  /* eslint-disable no-undef */
  let msgData = CryptoJS.enc.Utf8.parse(pwd)
  let cipherMode = SM2CipherMode.C1C3C2
  let cipher = new SM2Cipher(cipherMode)
  let userKey = cipher.CreatePoint(xHex, yHex)

  msgData = cipher.GetWords(msgData.toString())
  let encryptData = cipher.Encrypt(userKey, msgData)
  return encryptData
}

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    midRoles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
      window.sessionStorage.setItem('username', name)
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_MID_ROLES: (state, roles) => {
      state.midRoles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername ({ commit }, userInfo) {
      const username = userInfo.username.trim()
      // 加密
      const password = creatPwd(userInfo.password)
      return new Promise((resolve, reject) => {
        let option = loginByUsername(username, password)
        axios(option)
          .then(res => {
            if (res.data.code === successCode) {
              const data = res.data.body
              // data.roles = 'admin' // mock roles
              // console.log(data)
              data.token = 'admin' // mock token
              commit('SET_TOKEN', data.token)
              commit('SET_NAME', data.username)
              commit('SET_MID_ROLES', data.roles)
              setToken(data.token)
              setRoles(data.roles)
              resolve(res)
            } else {
              element.Message(res.data.message)
            }
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },

    // 获取用户信息
    GetUserInfo ({ commit, state }) {
      if (state.midRoles.length === 0) {
        commit('SET_MID_ROLES', getRoles())
      }
      const userMap = {
        data: {
          // role: ['admin'],
          // token: 'admin',
          // name: 'Super Admin',
          role: state.midRoles,
          token: state.token,
          name: state.name,
          introduction: '我是超级管理员',
          avatar:
            'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        }
      }
      commit('SET_ROLES', userMap.data.role)
      // commit('SET_NAME', userMap.data.name)
      commit('SET_INTRODUCTION', userMap.data.introduction)
      commit('SET_AVATAR', userMap.data.avatar)
      return userMap
      // return new Promise((resolve, reject) => {
      //   getUserInfo(state.token).then(response => {
      //     if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
      //       reject('error')
      //     }
      //     const data = response.data
      //     commit('SET_ROLES', data.role)
      //     commit('SET_NAME', data.name)
      //     commit('SET_AVATAR', data.avatar)
      //     commit('SET_INTRODUCTION', data.introduction)
      //     resolve(response)
      //   }).catch(error => {
      //     const userMap = {
      //       admin: {
      //         role: ['admin'],
      //         token: 'admin',
      //         introduction: '我是超级管理员',
      //         avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      //         name: 'Super Admin'
      //       },
      //       editor: {
      //         role: ['editor'],
      //         token: 'editor',
      //         introduction: '我是编辑',
      //         avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      //         name: 'Normal Editor'
      //       }
      //     }
      //     commit('SET_ROLES', userMap.role)
      //     commit('SET_NAME', userMap.name)
      //     commit('SET_AVATAR', userMap.avatar)
      //     commit('SET_INTRODUCTION', userMap.introduction)
      //     resolve(userMap)
      //     // reject(error)
      //   })
      // })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut ({ commit }) {
      return new Promise((resolve, reject) => {
        let option = logout()
        axios(option)
          .then(res => {
            if (res.data.code === successCode) {
              commit('SET_TOKEN', '')
              commit('SET_ROLES', [])
              removeToken()
              resolve()
              router.push({path: '/login'})
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRole ({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.role)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
