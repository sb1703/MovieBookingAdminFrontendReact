import ReactDom from "react-dom"
import { FormGroup } from "./FormGroup"
import DismissableTag from "./DismissableTag"
import { useEffect, useState } from "react"
import { addShow, removeShow, getShowsAlt } from "../api/movies"
import { parse, format, addMinutes } from "date-fns"

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#FFF",
  padding: "2rem",
  zIndex: 10001,
  borderRadius: "10px",
  width: "56.5%",
  height: "75%",
}

const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, .7)",
  zIndex: 10001,
}

const SCROLLABLE_FORM_WITH_TAGS = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gridTemplateRows: "max(100px)",
  overflowY: "auto",
  height: "100%",
  backgroundColor: "#f5f5f5",
  textOverflow: "ellipsis",
}

const SCROLLABLE_FORM_WITHOUT_TAGS = {
  overflowY: "auto",
  height: "100%",
  backgroundColor: "#f5f5f5",
}

const Modal = ({ open, onClose, movies }) => {
  const [shows, setShows] = useState([])
  const [errors, setErrors] = useState({})
  const [audi, setAudi] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [selectedMovieId, setSelectedMovieId] = useState(
    movies && movies.length > 0 ? movies[0]._id : ""
  )

  const getShowsFunction = async () => {
    try {
      const showsResponse = await getShowsAlt(audi, date)
      setShows(showsResponse.data)
    } catch (err) {
      setShows([])
      console.error("Error fetching shows:", err.message)
    }
  }

  useEffect(() => {
    if (audi && date && audi !== "" && date !== "") {
      getShowsFunction()
    }
  }, [audi, date])

  useEffect(() => {
    setErrors(
      addShowFormValidator({
        audi: audi,
        date: date,
        time: time,
      })
    )
  }, [audi, date, time])

  const handleAddShow = () => {
    const addShowFunction = async () => {
      if (Object.keys(errors).length > 0) return

      const startTime = parse(time, "HH:mm", new Date())

      const runtime = movies.find(
        (movie) => movie._id === selectedMovieId
      ).Runtime
      const endTime = addMinutes(startTime, parseInt(runtime.split(" ")[0]))

      const endTimeFormatted = format(endTime, "HH:mm aa")
      const startTimeFormatted = format(startTime, "HH:mm aa")

      const timeInterval = `${startTimeFormatted}-${endTimeFormatted}`

      const showsResponse = await addShow({
        number: audi,
        date,
        time: timeInterval,
        movie: selectedMovieId,
      })
      if (showsResponse.status === 200) {
        getShowsFunction()
      }
    }
    addShowFunction()
  }

  const handleRemoveShow = (time, movieId) => {
    console.log(`Removing show: ${time} for movie: ${movieId}`)
    const removeShowFunction = async (time, movieId) => {
      const showsResponse = await removeShow({
        movieId: movieId,
        number: audi,
        date,
        time: time
      })
      if (showsResponse.status === 200) {
        getShowsFunction()
      }
    }
    removeShowFunction(time, movieId)
  }

  if (!open) return null
  return ReactDom.createPortal(
    <>
      <div onClick={onClose} style={OVERLAY_STYLES}></div>
      <div style={MODAL_STYLES} className="form">
        <div className="form-row">
          <FormGroup errorMessage={errors.audi}>
            <label htmlFor="audi">Audi</label>
            <input
              type="number"
              name="audi"
              id="audi"
              max={12}
              min={1}
              value={audi}
              onChange={(e) => setAudi(e.target.value)}
            />
          </FormGroup>
          <FormGroup errorMessage={errors.date}>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormGroup>
        </div>
        <div
          className="scrollable-form"
          style={
            audi && date && audi !== "" && date !== "" && shows.length > 0
              ? SCROLLABLE_FORM_WITH_TAGS
              : SCROLLABLE_FORM_WITHOUT_TAGS
          }
        >
          {audi && date && audi !== "" && date !== "" ? (
            shows.length > 0 ? (
              shows.map((show, i) => (
                <DismissableTag
                  key={i}
                  text={show.Time}
                  movieName={
                    movies.find((movie) => movie._id === show.Movie).Title
                  }
                  onClose={() => handleRemoveShow(show.Time, show.Movie)}
                />
              ))
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                No shows available on the selected date and audi
              </div>
            )
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              Select date and audi to view shows
            </div>
          )}
        </div>
        <div className="form-row">
          <FormGroup errorMessage={errors.movie}>
            <label htmlFor="movie">Movie</label>
            <select
              name="movie"
              id="movie"
              value={selectedMovieId}
              onChange={(e) => setSelectedMovieId(e.target.value)}
            >
              {movies.map((movie) => (
                <option key={movie._id} value={movie._id}>
                  {movie.Title}
                </option>
              ))}
            </select>
          </FormGroup>
          <FormGroup errorMessage={errors.time}>
            <label htmlFor="time">Time</label>
            <input
              type="time"
              name="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </FormGroup>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button onClick={handleAddShow} className="btn">
              Add
            </button>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  )
}

export function addShowFormValidator({ audi, date, time }) {
  const errors = {}

  if (!(audi >= 1 && audi <= 12)) {
    errors.audi = "Valid audi should be between 1 and 12"
  }

  if (date === "") {
    errors.date = "Required"
  } else {
    const inputDate = new Date(date)
    if (isNaN(inputDate)) {
      errors.date = "Invalid date"
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0) // set time to 00:00:00.000
      if (inputDate < today) {
        errors.date = "Date cannot be in the past"
      }
    }
  }

  if (time === "") {
    errors.time = "Required"
  } else {
    const timePattern = /^([0-1][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/
    if (!timePattern.test(time)) {
      errors.time = "Invalid time"
    }
  }

  return errors
}

export default Modal
