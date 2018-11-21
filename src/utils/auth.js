// import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken () {
  return JSON.parse(sessionStorage.getItem(TokenKey))
  // return Cookies.get(TokenKey)
}

export function setToken (token) {
  return sessionStorage.setItem(TokenKey, JSON.stringify(token))
  // return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return sessionStorage.removeItem(TokenKey)
  // return Cookies.remove(TokenKey)
}

export function getRoles () {
  return JSON.parse(sessionStorage.getItem('roles'))
}

export function setRoles (roles) {
  return sessionStorage.setItem('roles', JSON.stringify(roles))
}
