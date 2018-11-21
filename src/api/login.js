const URL = process.env.BASE_API
const URI_PRE = '/credit/paces-emall-admin/emp/admin' //   /emp
let BASE_URL = URL + URI_PRE

export function loginByUsername (username, password) {
  const data = {
    username,
    password
  }
  return {
    url: BASE_URL + '/login',
    method: 'post',
    params: {
      username: data.username,
      password: data.password
    }
  }
}
export function logout () {
  return {
    url: BASE_URL + '/logout',
    method: 'post',
    params: {}
  }
}
