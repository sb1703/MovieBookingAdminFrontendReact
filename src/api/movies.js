import axios from "./axios"

const options2 = {
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true,
}

const options3 = {
  withCredentials: true,
}

export function createMovie(movie, options) {
  return axios.post("/movies/new", movie, { ...options, ...options3 })
}

export function updateMovie(movie, options) {
  return axios.post(`/movies/update`, movie, { ...options, ...options3 })
}

export function getMovieFromDB(_id, options) {
  return axios.get(`/movies/db/${_id}`, { ...options, ...options2 })
}

export function getAllMoviesFromDB(query = "", options) {
  return axios.post(`/movies/all`, JSON.stringify({ query: query }), {
    ...options,
    ...options2,
  })
}

export function getMoviesFromApi(query = "", media = "false") {
  return axios.post(`/movies/api/${query}`, JSON.stringify({ media: media }), {
    ...options2,
  })
}

export function getShowsAlt(audi, date, options) {
  return axios.post(
    `/audis/getShows`,
    JSON.stringify({ audi, date }),
    { ...options, ...options2 }
  )
}

export function addShow(show, options) {
  return axios.post(`/audis/addShow`, show, { ...options, ...options2 })
}

export function removeShow(show, options) {
  return axios.post(`/audis/removeShow`, show, { ...options, ...options2 })
}
