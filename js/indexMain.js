import { getAvailableDevices, getCode, getMe, getSavedTracks, getToken } from "./api.js";
import { init } from "./index1.js";


const loginBtn = document.getElementById('login')
const logoutBtn = document.getElementById('logout')

const ME = "https://accounts.spotify.com/authorize";
const clientId = 'cf82e53c0a1745d7b418cfc9b58ca05c';
// const clientSecret = '1d1496a44b8a457caf0a79950c9b98c1';
const redirectUri = 'http://127.0.0.1:5501/callback.html'

let access_token = localStorage.getItem('access_token')
  ? JSON.parse(localStorage.getItem('access_token'))
  : []

const auth = () => {

  const scope = 'user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private'
  window.location.href = `${ME}?client_id=${clientId}&response_type=code&redirect_uri=${encodeURI(redirectUri)}&scope=${scope}&show_dialog=${true}`

}

window.onload = () => {

  if (window.location.pathname == '/login.html') {
    loginBtn.addEventListener('click', auth)
  }

  if (window.location.pathname === '/callback.html') {
    let code = getCode()
    getToken(code)
  }

  if (window.location.pathname == '/index.html') {
    getAvailableDevices()
    getMe()
    getSavedTracks()
    init()
    logoutBtn.addEventListener('click', () => {
      console.log('click logout')
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login.html'
    })

  }

}




