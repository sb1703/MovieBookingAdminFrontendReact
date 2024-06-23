import { Link, useLoaderData, redirect, Form } from "react-router-dom"
import { getAllMoviesFromDB } from "../api/movies"
import { FormGroup } from "./FormGroup"
import { useEffect, useRef, useState } from "react"
import { MovieCard } from "./MovieCard"
import Modal from "./Modal"
import "../styles/admin.css"

const Admin = () => {
  const {
    movies,
    searchParams: { query },
  } = useLoaderData()
  const queryRef = useRef()
  const [isOpenModal, setIsOpenModal] = useState(false)

  useEffect(() => {
    queryRef.current.value = query || ""
  }, [query])

  return (
    <>
      <h1 className="page-title">
        Movies
        <div className="title-btns">
          <Link className="btn btn-outline" to="new">
            New
          </Link>
          <Link
            onClick={() => setIsOpenModal(true)}
            className="btn btn-outline"
          >
            Add Show
          </Link>
          <Modal open={isOpenModal} onClose={() => setIsOpenModal(false)} movies={movies.data} />
        </div>
      </h1>

      <Form className="form mb-4">
        <div className="form-row">
          <FormGroup>
            <label htmlFor="query">Query</label>
            <input type="search" name="query" id="query" ref={queryRef} />
          </FormGroup>
          <button className="btn">Filter</button>
        </div>
      </Form>

      <div className="card-grid">
        {movies.data.map((movie) => (
          <MovieCard key={movie._id} {...movie} />
        ))}
      </div>
    </>
  )
}

async function loader({ request: { signal, url } }) {
  const searchParams = new URL(url).searchParams
  const query = searchParams.get("query")
  try {
    return query
      ? {
          movies: await getAllMoviesFromDB(query, { signal }),
          searchParams: { query },
        }
      : {
          movies: await getAllMoviesFromDB({ signal }),
          searchParams: { query },
        }
  } catch (err) {
    throw redirect("/")
  }
}

export const adminMovieRoute = {
  loader,
  element: <Admin />,
}

export default Admin
