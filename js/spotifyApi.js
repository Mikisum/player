



const clientId = 'cf82e53c0a1745d7b418cfc9b58ca05c';
const redirectUri = 'http://127.0.0.1:5501/index.html'

const clientSecret = '1d1496a44b8a457caf0a79950c9b98c1';
const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";
const ME = "https://api.spotify.com/v1/me";
const TRACKS = "https://api.spotify.com/v1/me/tracks"

var access_token = null;
var refresh_token = null;

let dataMusic = []

export function onPageLoad() {

  if (window.location.search.length > 0) {
    handleRedirect()

  } else {
    access_token = localStorage.getItem("access_token")
    getMe()
    return dataMusic = getSavedTracks()
  }

}

export function handleRedirect() {
  let code = getCode()
  fetchAccessToken(code)
  window.history.pushState("", "", redirectUri)
}

export function getCode() {
  let code = null;
  const queryString = window.location.search;
  if (queryString.length > 0) {
    const urlParams = new URLSearchParams(queryString);
    code = urlParams.get('code')
  }
  console.log(code)
  return code;
}

function fetchAccessToken(code) {
  let body = "grant_type=authorization_code";
  body += "&code=" + code;
  body += "&redirect_uri=" + encodeURI(redirectUri);
  body += "&client_id=" + clientId;
  body += "&client_secret=" + clientSecret;
  callAuthorizationApi(body);
}

function refreshAccessToken() {
  refresh_token = localStorage.getItem("refresh_token");
  let body = "grant_type=refresh_token";
  body += "&refresh_token=" + refresh_token;
  body += "&client_id=" + clientId;
  callAuthorizationApi(body);
}

function callAuthorizationApi(body) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", TOKEN, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Authorization', 'Basic ' + btoa(clientId + ":" + clientSecret));
  xhr.send(body);
  xhr.onload = handleAuthorizationResponse;
}

export function requestAuthorization() {

  let url = AUTHORIZE;
  url += "?client_id=" + clientId;
  url += "&response_type=code";
  url += "&redirect_uri=" + encodeURI(redirectUri);
  url += "&show_dialog=true";
  url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
  window.location.href = url; // Show Spotify's authorization screen
}

function handleAuthorizationResponse() {
  if (this.status == 200) {
    var data = JSON.parse(this.responseText);
    console.log(data);
    var data = JSON.parse(this.responseText);
    if (data.access_token != undefined) {
      access_token = data.access_token;
      localStorage.setItem("access_token", access_token);
    }
    if (data.refresh_token != undefined) {
      refresh_token = data.refresh_token;
      localStorage.setItem("refresh_token", refresh_token);
    }
    onPageLoad();
  }
  else {
    console.log(this.responseText);
    alert(this.responseText);
  }
}



function callApi(method, url, body, callback) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
  xhr.send(body);
  xhr.onload = callback;
}

export function getMe() {
  callApi("GET", ME, null, handleMeResponse)
}

export function getSavedTracks() {
  return callApi("GET", TRACKS, null, handleTracksResponse)
}

function handleTracksResponse() {

  if (this.status == 200) {
    let data = JSON.parse(this.responseText);
    dataMusic = data.items
    console.log('dataMusic: ', dataMusic);

    return dataMusic
  }
  else if (this.status == 401) {
    refreshAccessToken()
  }
  else {
    console.log(this.responseText);
    alert(this.responseText);
  }

}


function handleMeResponse() {
  if (this.status == 200) {
    var data = JSON.parse(this.responseText);
    console.log(data);
    return data
  }
  else if (this.status == 401) {
    refreshAccessToken()
  }
  else {
    console.log(this.responseText);
    alert(this.responseText);
  }
}