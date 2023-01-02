
const clientId = 'cf82e53c0a1745d7b418cfc9b58ca05c';
const clientSecret = '1d1496a44b8a457caf0a79950c9b98c1';
const ME = "https://api.spotify.com/v1/me";
const redirectUri = 'http://127.0.0.1:5501/callback.html'


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

export const getToken = async (code) => {

  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ":" + clientSecret)
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURI(redirectUri)}`
  });

  const data = await result.json();
  localStorage.setItem('access_token', JSON.stringify(data.access_token))
  localStorage.setItem('refresh_token', JSON.stringify(data.refresh_token))

  console.log(data)

  window.location.href = '/index.html'


  return data;
}

export const refreshToken = () => {
  return fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ":" + clientSecret)
    },
    body: `grant_type=refresh_token&refresh_token=${JSON.parse(localStorage.getItem('refresh_token'))}`
  })
    .then(res => res.json())

    .then(data => {
      if (!data.error) {
        console.log(data)
        localStorage.setItem('access_token', JSON.stringify(data.access_token))
      }
    })
}

export const getMe = () => {

  fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('access_token'))
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        refreshToken().then(getSavedTracks())
      }
      console.log(data)
    })

    .catch(err => {
      if (res.status === 401) {
        refreshToken()
      }
      console.log(err)
    })
}

export async function getSavedTracks() {
  const res = await fetch(`https://api.spotify.com/v1/me/tracks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('access_token'))
    }
  });
  const data = await res.json();
  console.log(data.items)

  return data.items

}

export async function getAvailableDevices() {
  const res = await fetch(`https://api.spotify.com/v1/me/player/devices`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('access_token'))
    }
  });
  const data = await res.json();
  console.log(data.devices)

  return data.devices[0].id

}

export async function playTrack(uri, availableDevices) {
  const res = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${availableDevices}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('access_token'))
    },
    body: JSON.stringify({
      "uris": [uri],
      "position_ms": 200
    })
  });
}

export async function pauseTrack(uri, availableDevices) {
  const res = await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${availableDevices}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('access_token'))
    },
    body: JSON.stringify({
      "uris": [uri]
    })
  });

}

