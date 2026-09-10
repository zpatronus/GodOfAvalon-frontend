// Thin wrapper around axios for the GoA backend.
//
// Every authenticated call is a POST with the credentials in a JSON body
// (no credentials in the URL). A CSRF token is fetched lazily once and sent as
// an X-CSRFToken header. All responses are {"ok": ..., ...}; non-ok responses
// resolve normally (HTTP 200) and carry an "ok": false + "message".
import axios from 'axios'
import store from '@/store'

let token = ''

export async function ensureToken () {
  if (token) return token
  const { data } = await axios.get(`${store.state.server}/csrf/`, { withCredentials: true })
  token = data.token
  return token
}

export async function post (path, body) {
  const csrf = await ensureToken()
  const { data } = await axios.post(`${store.state.server}${path}`, body || {}, {
    headers: {
      'X-CSRFToken': csrf,
      'Content-Type': 'application/json'
    },
    withCredentials: true
  })
  return data
}

export async function get (path) {
  const { data } = await axios.get(`${store.state.server}${path}`, { withCredentials: true })
  return data
}