const API_URL = 'http://localhost:3024/'

let dataMusic = [];

let playList = []

const favourites = localStorage.getItem('favourites')
  ? JSON.parse(localStorage.getItem('favourites'))
  : []

const audio = new Audio()
const header = document.querySelector('.header')
const headerLogo = document.querySelector('.header__logo')
const favBtn = document.querySelector('.header__favourite-btn')
const catalogContainer = document.querySelector('.catalog__container')
const tracksCard = document.getElementsByClassName('track')
const player = document.querySelector('.player')
const trackTitle = document.querySelector('.track-info__title')
const trackArtist = document.querySelector('.track-info__artist')
const pauseBtn = document.querySelector('.player__controller-pause')
const stopBtn = document.querySelector('.player__controller-stop')
const prevBtn = document.querySelector('.player__controller-prev')
const nextBtn = document.querySelector('.player__controller-next')
const likeBtn = document.querySelector('.player__controller-fav')
const likeIcon = document.getElementById('like')
const muteBtn = document.querySelector('.player__icon_mute')
const muteIcon = document.querySelector('.fa-volume-low')
const playerProgressInput = document.querySelector('.player__progress-input')
const playerTimePassed = document.querySelector('.player__time-passed')
const playerTimeTotal = document.querySelector('.player__time-total')
const playerVolume = document.querySelector('.player__volume-input')
const search = document.querySelector('.search')
const playIcon = document.getElementById('play')
const catalogAddBtn = document.createElement('button')
catalogAddBtn.classList.add('catalog__btn-add')

catalogAddBtn.innerHTML = `
  <span>see all</span>
  <svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.589996 10.59L5.17 6L0.589996 1.41L2 0L8 6L2 12L0.589996 10.59Z" />
  </svg>
`

const pausePlayer = () => {
  const trackActive = document.querySelector('.track_active')
  if (audio.paused) {
    audio.play()
    playIcon.classList.replace('fa-circle-play', 'fa-circle-pause')
    trackActive.classList.remove('track_pause')

  } else {
    audio.pause()
    playIcon.classList.replace('fa-circle-pause', 'fa-circle-play')
    trackActive.classList.add('track_pause')
  }
}

const playMusic = event => {
  event.preventDefault()
  const trackActive = event.currentTarget

  if (trackActive.classList.contains('track_active')) {
    pausePlayer()
    return
  }

  let i = 0
  const id = trackActive.dataset.idTrack

  const index = favourites.indexOf(id)
  if (index !== -1) {
    likeIcon.classList.replace('fa-regular', 'fa-solid')
  } else {
    likeIcon.classList.replace('fa-solid', 'fa-regular')
  }

  const track = playList.find((item, index) => {
    i = index
    return id === item.id
  })
  audio.src = `${API_URL}${track.mp3}`
  trackTitle.textContent = track.track
  trackArtist.textContent = track.artist

  audio.play()
  playIcon.classList.replace('fa-circle-play', 'fa-circle-pause')
  player.classList.add('player_active')
  player.dataset.idTrack = id

  const prevTrack = i === 0 ? playList.length - 1 : i - 1
  const nextTrack = i + 1 === playList.length ? 0 : i + 1
  prevBtn.dataset.idTrack = playList[prevTrack].id
  nextBtn.dataset.idTrack = playList[nextTrack].id
  likeBtn.dataset.idTrack = id

  for (let i = 0; i < tracksCard.length; i++) {
    if (id === tracksCard[i].dataset.idTrack) {
      tracksCard[i].classList.add('track_active')
    } else {
      tracksCard[i].classList.remove('track_active')
    }
  }
}

const addHandlerTrack = () => {
  for (let i = 0; i < tracksCard.length; i++) {
    tracksCard[i].addEventListener('click', playMusic)
  }
}

playIcon.addEventListener('click', pausePlayer)

stopBtn.addEventListener('click', () => {
  player.classList.remove('player_active')
  audio.src = ''
  document.querySelector('.track_active').classList.remove('track_active')
})

const createCard = (data) => {
  const card = document.createElement('a')
  card.href = '#'
  card.classList.add('catalog__item', 'track')
  if (player.dataset.idTrack === data.id) {
    card.classList.add('track_active')
    if (audio.paused) {
      card.classList.add('track_pause')
    }
  }
  card.dataset.idTrack = data.id
  card.innerHTML = `
    <div class="track__img-wrap">
      <img class="track__poster" src=${API_URL}${data.poster} alt=${data.artist} width="180" height="180">
    </div>
    <div class="track__info track-info">
      <p class="track-info__title">${data.track}</p>
      <p class="track-info__artist">${data.artist}</p>
    </div>
  `
  return card
}

window.onscroll = function () {
  if (window.scrollY > 50) {
    header.classList.add('header_active')
  } else {
    header.classList.remove('header_active')
  }
}

const renderCatalog = (dataMusic) => {
  playList = [...dataMusic]
  catalogContainer.textContent = ''
  const listCards = dataMusic.map(createCard)
  catalogContainer.append(...listCards)
  addHandlerTrack()
}

const checkCount = (i = 1) => {
  tracksCard[0]
  if (tracksCard.length !== 0) {

    if (catalogContainer.clientHeight > tracksCard[0].clientHeight * 3) {
      tracksCard[tracksCard.length - i].style.display = 'none'
      checkCount(i + 1)
    } else if (i !== 1) {
      catalogContainer.append(catalogAddBtn)
    }
  } else {
    catalogContainer.innerHTML = `<div class="catalog__container-error">not found</div>`
  }
}

const throttle = (callee, timeout) => {
  let timer = null
  return function perform(...args) {
    if (timer) return
    timer = setTimeout(() => {
      callee(...args)
      clearTimeout(timer)
      timer = null
    }, timeout)
  }
}

const updateTime = () => {
  const duration = audio.duration
  const currentTime = audio.currentTime
  const progress = (currentTime / duration) * playerProgressInput.max
  playerProgressInput.value = progress ? progress : 0

  const minutesPassed = Math.floor(currentTime / 60) || '0'
  const secondsPassed = Math.floor(currentTime % 60) || '0'

  const minutesDuration = Math.floor(duration / 60) || '0'
  const secondsDuration = Math.floor(duration % 60) || '0'

  playerTimePassed.textContent = `${minutesPassed}:${secondsPassed < 10 ? '0' + secondsPassed : secondsPassed}`
  playerTimeTotal.textContent = `${minutesDuration}:${secondsDuration < 10 ? '0' + secondsDuration : secondsDuration}`

}

const init = async () => {
  audio.volume = localStorage.getItem('volume') || 1
  playerVolume.value = audio.volume * 100

  const dataMusic = await fetch(`${API_URL}api/music`).then(data => data.json())
  renderCatalog(dataMusic)
  checkCount()

  catalogAddBtn.addEventListener('click', () => {
    [...tracksCard].forEach(trackCard => {
      trackCard.style.display = ''
      catalogAddBtn.remove()
    });
  })

  prevBtn.addEventListener('click', playMusic)
  nextBtn.addEventListener('click', playMusic)

  audio.addEventListener('ended', () => {
    nextBtn.dispatchEvent(new Event('click', { bubbles: true }))
  })

  const updateTimeThrottle = throttle(updateTime, 500)

  audio.addEventListener('timeupdate', updateTimeThrottle)

  playerProgressInput.addEventListener('change', () => {
    const progress = playerProgressInput.value
    audio.currentTime = (progress / playerProgressInput.max) * audio.duration
  })

  favBtn.addEventListener('click', () => {
    const data = dataMusic.filter((item) => favourites.includes(item.id))
    renderCatalog(data)
  })

  headerLogo.addEventListener('click', () => {
    renderCatalog(dataMusic)
    checkCount()
  })

  likeBtn.addEventListener('click', () => {
    const index = favourites.indexOf(likeBtn.dataset.idTrack)
    if (index === -1) {
      favourites.push(likeBtn.dataset.idTrack)
      likeIcon.classList.replace('fa-regular', 'fa-solid')
      likeIcon.classList.add('player__icon-active')

    } else {
      favourites.splice(index, 1)
      likeIcon.classList.replace('fa-solid', 'fa-regular')
      likeIcon.classList.remove('player__icon-active')

    }
    localStorage.setItem('favourites', JSON.stringify(favourites))
  })

  playerVolume.addEventListener('input', () => {
    const value = playerVolume.value
    audio.volume = value / 100
    localStorage.setItem('volume', audio.volume)
  })

  muteBtn.addEventListener('click', () => {
    if (audio.volume) {
      localStorage.setItem('volume', audio.volume)
      audio.volume = 0
      muteIcon.classList.replace('fa-volume-low', 'fa-volume-xmark')
      playerVolume.value = 0
    } else {
      audio.volume = localStorage.getItem('volume')
      muteIcon.classList.replace('fa-volume-xmark', 'fa-volume-low')
      playerVolume.value = audio.volume * 100
    }
  })

  search.addEventListener('submit', async (event) => {
    event.preventDefault()
    playList = await fetch(`${API_URL}api/music?search=${search.search.value}`)
      .then(data => data.json())
      .catch(error => console.log(error))
    renderCatalog(playList)
    checkCount()
  })
}

init()

