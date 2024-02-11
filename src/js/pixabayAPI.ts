import axios, { AxiosError } from "axios"

const pixabay = axios.create({
  baseURL: "https://pixabay.com/api/",
  params: {
    key: "42224825-192c1ca3521bf566a7b944455",
    image_type: "photo",
    orientation: "horizontal",
    per_page: 40,
    safesearch: "true",
  },
})

export async function getPhotos(searchTerm: string, page = 1): Promise<SearchResult> {
  const response = await pixabay.get("", { params: { page, q: searchTerm } })
    .catch((error: AxiosError) => { throw error.toJSON() })
  return response.data as SearchResult
}


type SearchResult = {
  total: number;
  totalHits: number;
  hits: {
    id: number;
    pageURL: string;
    // type: string;
    tags: string;
    previewURL: string;
    previewWidth: number;
    previewHeight: number;
    webformatURL: string;
    webformatWidth: number;
    webformatHeight: number;
    largeImageURL: string;
    imageWidth: number;
    imageHeight: number;
    imageSize: number;
    views: number;
    downloads: number;
    collections: number;
    likes: number;
    comments: number;
    // user_id: number;
    // user: string;
    // userImageURL: string;
  }[];
}
