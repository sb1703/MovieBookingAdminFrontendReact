import { Form, Link } from "react-router-dom"
import { FormGroup } from "./FormGroup"
import { useEffect, useRef, useState } from "react"
import { getMoviesFromApi } from "../api/movies"
import useDebounce from "../hooks/useDebounce"
import ImageSlider from "./ImageSlider"
import { set } from "date-fns"

export function MovieForm({ isSubmitting, errors = {}, defaultValues = {} }) {
  const [activeSuggestions, setActiveSuggestions] = useState(0)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [userInput, setUserInput] = useState(defaultValues.Title || "")
  const [selectedImages, setSelectedImages] = useState([])
  const [selectedVideos, setSelectedVideos] = useState([])
  const [selectedImagesUrls, setSelectedImagesUrls] = useState(
    defaultValues.Images ? [...defaultValues.Images] : []
  )
  const [selectedVideosUrls, setSelectedVideosUrls] = useState(
    defaultValues.Videos ? [...defaultValues.Videos] : []
  )
  const [isLoading, setIsLoading] = useState(false)

  const yearRef = useRef()
  const runtimeRef = useRef()
  const directorRef = useRef()
  const writerRef = useRef()
  const actorsRef = useRef()
  const genreRef = useRef()
  const imdbRatingRef = useRef()
  const plotRef = useRef()

  const debouncedSearchTerm = useDebounce(userInput, 1000)

  useEffect(() => {
    if (isLoading) {
      console.log("Loading")
    } else {
      console.log("Not Loading")
    }
  }, [isLoading])

  useEffect(() => {
    if (debouncedSearchTerm) {
      const fetchMovies = async () => {
        // if(yearRef.current && yearRef.current.value > 0 && ) return
        try {
          // console.log(`debouncedSearchTerm - ${debouncedSearchTerm}`)
          const suggestedMovie = await getMoviesFromApi(
            debouncedSearchTerm,
            "false"
          )

          console.log(suggestedMovie)

          const suggestions = suggestedMovie.data?.Title
            ? [suggestedMovie.data?.Title]
            : []

          // console.log(suggestions)

          const filteredSuggestions = suggestions.filter(
            (suggestion) =>
              suggestion
                .toLowerCase()
                .indexOf(debouncedSearchTerm.toLowerCase()) > -1
          )

          setActiveSuggestions(0)
          setFilteredSuggestions(filteredSuggestions)
          setShowSuggestions(true)
          // Only set the user input if it's different from the current value
          if (userInput !== debouncedSearchTerm) {
            setUserInput(debouncedSearchTerm)
          }
          // setUserInput(debouncedSearchTerm)
          // setUserInput(inputValue)
        } catch (err) {
          console.log(err)
          setActiveSuggestions(0)
          setFilteredSuggestions([])
          setShowSuggestions(false)
          // Only set the user input if it's different from the current value
          // if (userInput !== debouncedSearchTerm) {
          //   setUserInput(debouncedSearchTerm)
          // }
          // setUserInput(debouncedSearchTerm)
          // setUserInput(inputValue)
        }
      }

      fetchMovies()
    }
  }, [debouncedSearchTerm])

  const updateValues = async () => {
    setIsLoading(true)
    const suggestedMovie = await getMoviesFromApi(debouncedSearchTerm, "true")
    yearRef.current.value = suggestedMovie.data?.Year
    runtimeRef.current.value = suggestedMovie.data?.Runtime
    directorRef.current.value = suggestedMovie.data?.Director
    writerRef.current.value = suggestedMovie.data?.Writer
    actorsRef.current.value = suggestedMovie.data?.Actors
    genreRef.current.value = suggestedMovie.data?.Genre
    imdbRatingRef.current.value = suggestedMovie.data?.imdbRating
    plotRef.current.value = suggestedMovie.data?.Plot
    setSelectedImagesUrls(suggestedMovie.data?.Images || [])
    setSelectedVideosUrls(suggestedMovie.data?.Videos || [])
    setIsLoading(false)
  }

  const onChange = async (e) => {
    setUserInput(e.currentTarget.value)
  }

  const onClick = (e) => {
    setActiveSuggestions(0)
    setFilteredSuggestions([])
    setShowSuggestions(false)
    const clickedValue = e.currentTarget.innerText;
    // Only update if the clicked value is different from the current input value
    if (clickedValue !== userInput) {
      setUserInput(clickedValue)
      setActiveSuggestions(0)
    setFilteredSuggestions([])
    setShowSuggestions(false)
      updateValues()
    }
    // setUserInput(e.currentTarget.innerText)
    // updateValues()
  }

  const onKeyDown = (e) => {
    // User pressed the enter key
    if (e.keyCode === 13) {
      setActiveSuggestions(0)
      setShowSuggestions(false)
      setUserInput(filteredSuggestions[activeSuggestions])
      updateValues()

      // User pressed the up arrow
    } else if (e.keyCode === 38) {
      if (activeSuggestions === 0) {
        return
      }

      setActiveSuggestions(activeSuggestions - 1)

      // User pressed the down arrow
    } else if (e.keyCode === 40) {
      if (activeSuggestions - 1 === filteredSuggestions.length) {
        return
      }

      setActiveSuggestions(activeSuggestions + 1)
    }
  }

  const suggestionsListComponent =
    showSuggestions && userInput ? (
      filteredSuggestions.length ? (
        <ul className="suggestions">
          {filteredSuggestions.map((suggestion, index) => {
            let className

            if (index === activeSuggestions) {
              className = "suggestion-active"
            }

            return (
              <li className={className} key={suggestion} onClick={onClick}>
                {suggestion}
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="no-suggestions">
          <em>No suggestions available.</em>
        </div>
      )
    ) : null

  const handleImagesChange = (e) => {
    setSelectedImages([...e.target.files])
  }

  const handleVideosChange = (e) => {
    setSelectedVideos([...e.target.files])
  }

  return (
    <Form encType="multipart/form-data" method="post" className="form">
      <div className="form-row">
        <FormGroup errorMessage={errors.title}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            // defaultValue={defaultValues.Title}
            autoComplete="off"
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={userInput}
          />
          {suggestionsListComponent}
        </FormGroup>
        <FormGroup errorMessage={errors.year}>
          <label htmlFor="year">Year</label>
          <input
            type="number"
            name="year"
            id="year"
            min={1500}
            defaultValue={defaultValues.Year}
            ref={yearRef}
          />
        </FormGroup>
      </div>
      <div className="form-row">
        <FormGroup errorMessage={errors.runtime}>
          <label htmlFor="runtime">Runtime (in min)</label>
          <input
            type="text"
            name="runtime"
            id="runtime"
            defaultValue={defaultValues.Runtime}
            ref={runtimeRef}
          />
        </FormGroup>
        <FormGroup errorMessage={errors.director}>
          <label htmlFor="director">Director</label>
          <input
            type="text"
            name="director"
            id="director"
            defaultValue={defaultValues.Director}
            ref={directorRef}
          />
        </FormGroup>
      </div>
      <div className="form-row">
        <FormGroup errorMessage={errors.writer}>
          <label htmlFor="writer">Writer</label>
          <input
            type="text"
            name="writer"
            id="writer"
            defaultValue={defaultValues.Writer}
            ref={writerRef}
          />
        </FormGroup>
        <FormGroup errorMessage={errors.actors}>
          <label htmlFor="actors">Actors</label>
          <input
            type="text"
            name="actors"
            id="actors"
            defaultValue={defaultValues.Actors}
            ref={actorsRef}
          />
        </FormGroup>
      </div>
      <div className="form-row">
        <FormGroup errorMessage={errors.genre}>
          <label htmlFor="genre">Genre</label>
          <input
            type="text"
            name="genre"
            id="genre"
            defaultValue={defaultValues.Genre}
            ref={genreRef}
          />
        </FormGroup>
        <FormGroup errorMessage={errors.imdbRating}>
          <label htmlFor="imdbRating">IMDB Rating</label>
          <input
            type="number"
            name="imdbRating"
            id="imdbRating"
            step={0.1}
            min={0}
            max={10}
            defaultValue={defaultValues.imdbRating}
            ref={imdbRatingRef}
          />
        </FormGroup>
      </div>
      <div className="form-row">
        <FormGroup errorMessage={errors.images}>
          {(selectedImages.length > 0 || selectedImagesUrls.length > 0) && (
            <div
              style={{
                maxWidth: "500px",
                width: "100%",
                aspectRatio: "10 / 6",
                margin: "0 auto",
              }}
            >
              <ImageSlider
                urls={selectedImagesUrls}
                files={selectedImages}
                media="image"
              />
            </div>
          )}
          <label htmlFor="images">Images</label>
          <input
            type="file"
            name="images"
            id="images"
            multiple
            accept="image/*"
            onChange={handleImagesChange}
          />
          <input
            type="hidden"
            name="imageUrls"
            value={JSON.stringify(selectedImagesUrls)}
          />
        </FormGroup>
        <FormGroup errorMessage={errors.videos}>
          {(selectedVideos.length > 0 || selectedVideosUrls.length > 0) && (
            <div
              style={{
                maxWidth: "500px",
                width: "100%",
                aspectRatio: "10 / 6",
                margin: "0 auto",
              }}
            >
              <ImageSlider
                urls={selectedVideosUrls}
                files={selectedVideos}
                media="videos"
              />
            </div>
          )}
          <label htmlFor="videos">Videos</label>
          <input
            type="file"
            name="videos"
            id="videos"
            multiple
            accept="video/*"
            onChange={handleVideosChange}
          />
          <input
            type="hidden"
            name="videoUrls"
            value={JSON.stringify(selectedVideosUrls)}
          />
        </FormGroup>
      </div>
      <div className="form-row">
        <FormGroup errorMessage={errors.plot}>
          <label htmlFor="plot">Plot</label>
          <textarea
            name="plot"
            id="plot"
            defaultValue={defaultValues.Plot}
            ref={plotRef}
          ></textarea>
        </FormGroup>
      </div>
      <div className="form-row form-btn-row">
        <Link className="btn btn-outline" to="/admin">
          Cancel
        </Link>
        <button disabled={isSubmitting} className="btn">
          {isSubmitting ? "Saving" : "Save"}
        </button>
      </div>
    </Form>
  )
}

function validateVideoSize(file) {
  const maxSize = 50000000 // Maximum size in bytes (50MB)
  const fileSize = file.size // Size of file in bytes

  if (fileSize > maxSize) {
    alert("Invalid video size. Size should be less than 50MB.")
    return false
  }

  return true
}

function validateImage(file) {
  const fileType = file.type

  if (fileType.startsWith("image/")) {
    return true
  }

  alert("Invalid image type. Please upload an image file.")
  return false
}

function validateVideo(file) {
  const fileType = file.type

  if (fileType.startsWith("video/")) {
    return true
  }

  alert("Invalid video type. Please upload an video file.")
  return false
}

export function movieFormValidator({
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
}) {
  const errors = {}

  if (title === "") {
    errors.title = "Required"
  }

  if (year === "") {
    errors.year = "Required"
  }

  if (parseInt(year) < 1800 || parseInt(year) > new Date().getFullYear() + 1) {
    errors.year = "Invalid year"
  }

  if (parseInt(runtime) <= 0) {
    errors.runtime = "Invalid runtime"
  }

  if (director === "") {
    errors.director = "Required"
  }

  if (writer === "") {
    errors.writer = "Required"
  }

  if (actors === "") {
    errors.actors = "Required"
  }

  if (genre === "") {
    errors.genre = "Required"
  }

  if (parseInt(imdbRating) < 0 && parseInt(imdbRating) > 10) {
    errors.imdbRating = "Invalid IMDB rating"
  }

  if (
    images &&
    images.length > 0 &&
    images[0].name !== "" &&
    images.map((image) => validateImage(image)).includes(false)
  ) {
    errors.images = "Invalid image type. Please upload an image file."
  }

  if (
    videos &&
    videos.length > 0 &&
    videos[0].name !== "" &&
    videos.map((video) => validateVideo(video)).includes(false)
  ) {
    errors.videos = "Invalid video type. Please upload an video file."
  }

  if (
    videos &&
    videos.length > 0 &&
    videos[0].name !== "" &&
    videos.map((video) => validateVideoSize(video)).includes(false)
  ) {
    errors.videos = "Invalid video size. Size should be less than 50MB"
  }

  if (plot === "") {
    errors.plot = "Required"
  }

  return errors
}
