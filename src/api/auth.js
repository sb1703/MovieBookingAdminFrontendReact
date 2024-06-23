import axios from "./axios"

const REGISTER_URL = "/adminRegister"
const LOGIN_URL = "/adminAuth"
const ADMIN_VERIFY_SESSION_URL = "/adminVerifySession"
const options = {
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
}

export function register({ user, pwd }) {
  return axios.post(REGISTER_URL, JSON.stringify({ user, pwd }), options)
}

export function login({ user, pwd }) {
    return axios.post(LOGIN_URL, JSON.stringify({ user, pwd }), options)
}

export function adminVerifySession() {
    return axios.get(ADMIN_VERIFY_SESSION_URL, options)
}
