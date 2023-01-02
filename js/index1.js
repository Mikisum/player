import { getAvailableDevices, getSavedTracks, pauseTrack, playTrack } from "./api.js"

const catalogContainer = document.querySelector('.catalog__container')
const tracksCard = document.getElementsByClassName('track')

let availableDevices
export const init = () => {
  getSavedTracks().then(data => renderCatalog(data))
  getAvailableDevices().then(data => availableDevices = data)
  console.log(availableDevices)
}

const renderCatalog = (dataMusic) => {
  catalogContainer.textContent = ''
  const listCards = dataMusic.map(createCard)
  catalogContainer.append(...listCards)
  addHandlerTrack(listCards)

  const catalogAddBtn = createCatalogBtn()
  checkCount(catalogAddBtn)
}

const addHandlerTrack = (listCards) => {
  listCards.forEach(card => card.addEventListener('click', play))
}

const play = (e) => {
  const trackActive = e.currentTarget
  const uri = trackActive.dataset.uri
  console.log(trackActive)
  console.log('play')
  trackActive.classList.add('track_active')
  playTrack(uri, availableDevices)

  if (trackActive.classList.contains('track_active')) {
    // pause(trackActive)
  }
}

const pause = (trackActive) => {

  const uri = trackActive.dataset.uri
  pauseTrack(uri, availableDevices)
  console.log(' pause')
}


const createCard = (data) => {
  const card = document.createElement('a')
  card.href = '#'
  card.classList.add('catalog__item', 'track')
  // if (player.dataset.idTrack === data.id) {
  //   card.classList.add('track_active')
  //   if (audio.paused) {
  //     card.classList.add('track_pause')
  //   }
  // }
  card.dataset.uri = data.track.uri

  card.innerHTML = `
    <div class="track__img-wrap">
      <img class="track__poster" src=${data.track.album.images[1].url} alt=${data.artist} width="180" height="180">
    </div>
    <div class="track__info track-info">
      <p class="track-info__title">${data.track.name}</p>
      <p class="track-info__artist">${data.track.artists[0].name}</p>
    </div>
  `
  return card
}


const createCatalogBtn = () => {
  const catalogAddBtn = document.createElement('button')
  catalogAddBtn.innerHTML = `
        <span>see all</span>
        <svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.589996 10.59L5.17 6L0.589996 1.41L2 0L8 6L2 12L0.589996 10.59Z" />
        </svg>
      `
  catalogAddBtn.addEventListener('click', () => {
    [...tracksCard].forEach(trackCard => {
      trackCard.style.display = ''
      catalogAddBtn.remove()
    });
  })
  catalogAddBtn.classList.add('catalog__btn-add')

  return catalogAddBtn
}

const checkCount = (catalogAddBtn, i = 1) => {

  if (catalogContainer.clientHeight > tracksCard[0].clientHeight * 3) {
    tracksCard[tracksCard.length - i].style.display = 'none'
    return checkCount(catalogAddBtn, i + 1)
  }
  if (i !== 1) {
    catalogContainer.append(catalogAddBtn)
  }
}