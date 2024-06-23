import {
  useNavigate,
  ScrollRestoration,
  useActionData,
  redirect,
  useNavigation,
} from "react-router-dom"
import { MovieForm, movieFormValidator } from "./MovieForm"
import { createMovie } from "../api/movies"

const NewMovieFormPage = () => {
  const navigate = useNavigation()
  const errors = useActionData()
  const isSubmitting = navigate.state === "submitting"

  return (
    <>
      <MovieForm isSubmitting={isSubmitting} errors={errors} />
    </>
  )
}

async function action({ request }) {
  const formData = await request.formData()
  const title = formData.get("title")
  const year = formData.get("year")
  const runtime = formData.get("runtime")
  const director = formData.get("director")
  const writer = formData.get("writer")
  const actors = formData.get("actors")
  const genre = formData.get("genre")
  const imdbRating = formData.get("imdbRating")
  const images = formData.getAll("images")
  const videos = formData.getAll("videos")
  const plot = formData.get("plot")
  const imageUrls = formData.get("imageUrls")
  const videoUrls = formData.get("videoUrls")

  console.log(videos)

  const errors = movieFormValidator({
    title,
    year,
    runtime,
    director,
    writer,
    actors,
    genre,
    imdbRating,
    images,
    videos,
    plot,
  })

  if (Object.keys(errors).length > 0) {
    return errors
  }

  const movie = await createMovie(
    formData,
    // { title, year, runtime, director, writer, actors, genre, imdbRating, images, videos, plot },
    { signal: request.signal }
  )

  return redirect(`/admin`)
}

export const newMovieRoute = {
  action,
  element: <NewMovieFormPage />,
}

export default NewMovieFormPage
