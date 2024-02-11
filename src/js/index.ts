import { getPhotos } from "./pixabayAPI.ts"
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';

const searchForm = document.querySelector("form.search-form") as HTMLFormElement & {
  elements: {
    searchQuery: HTMLInputElement
  }
}

const photoCard = document.querySelector(".gallery>.photo-card") as HTMLDivElement
const gallery = photoCard.parentElement as HTMLDivElement
let simpleLightbox

gallery.removeChild(photoCard)
photoCard.hidden = false
let page = 1
async function loadMore(firstLoad = false) {
  loadMoreButton.style.display = "none"
  page = firstLoad ? 1 : page + 1
  const photos = await getPhotos(searchForm.elements.searchQuery.value, page)
  if (firstLoad)
    gallery.textContent = ""
  if (photos.hits.length === 0) {
    Notify.failure(firstLoad ? "Sorry, there are no images matching your search query. Please try again."
      : "We're sorry, but you've reached the end of search results.")
    return
  }
  if (firstLoad)
    Notify.success(`"Hooray! We found ${photos.totalHits} images."`)
  const infos: (keyof typeof photos["hits"][number])[] = ['likes', 'views', 'comments', 'downloads']
  console.log(photos);
  const photoCards = photos.hits.map((photo) => {
    const clone = photoCard.cloneNode(true) as HTMLDivElement;
    const img = clone.querySelector('img')!;
    img.src = photo.webformatURL;
    img.alt = photo.tags;
    clone.dataset.src = photo.largeImageURL
    clone.querySelectorAll('.info-item').forEach((item, i) => { item.insertAdjacentText("beforeend", photo[infos[i]] + "") })
    return clone
  })
  gallery.append(...photoCards)
  if (!firstLoad)
    simpleLightbox.refresh()
  loadMoreButton.style.display = "block"
}
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  gallery.textContent = "Loading..."
  await loadMore(true)
  simpleLightbox = new SimpleLightbox('.gallery>.photo-card', {
    captionsData: 'alt', captionDelay: 250, sourceAttr: 'data-src'
  });
})

const callback: IntersectionObserverCallback = (entries, observer) => {
  if (!entries[0].isIntersecting) return
  console.log("isIntersecting")
  // Infinite scrolling
  // loadMore()
}
const watchMe = new IntersectionObserver(callback, { rootMargin: "0% 0% 80%" });
const loadMoreButton = document.querySelector("button.load-more") as HTMLButtonElement
watchMe.observe(loadMoreButton)
loadMoreButton.addEventListener("click", () => loadMore())