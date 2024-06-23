import {
  useNavigate,
  ScrollRestoration,
  useActionData,
  useLoaderData,
  redirect,
  useNavigation,
} from "react-router-dom"
import { MovieForm, movieFormValidator } from "./MovieForm"
import { getMovieFromDB, updateMovie } from "../api/movies"

const EditMovieFormPage = () => {
  const { movie } = useLoaderData()
  const navigate = useNavigation()
  const errors = useActionData()
  const isSubmitting = navigate.state === "submitting"

  return (
    <>
      <MovieForm
        isSubmitting={isSubmitting}
        errors={errors}
        defaultValues={movie.data}
      />
    </>
  )
}

async function action({ request, params: { _id } }) {
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

  formData.append("_id", _id)
  const movie = await updateMovie(
    formData,
    // { _id, title, year, runtime, director, writer, actors, genre, imdbRating, images, videos, plot },
    { signal: request.signal }
  )

  return redirect(`/admin`)
}

async function loader({ request: { signal }, params: { _id } }) {
  try {
    return { movie: await getMovieFromDB(_id, { signal }) }
  } catch (err) {
    throw redirect("/missing")
  }
}

export const editMovieRoute = {
  loader,
  action,
  element: <EditMovieFormPage />,
}

export default EditMovieFormPage
