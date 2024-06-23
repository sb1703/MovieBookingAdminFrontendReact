import { useState } from "react"
import { ArrowBigLeft, ArrowBigRight } from "lucide-react"

const ImageSlider = ({ urls, files, media }) => {
  const [mediaIndex, setMediaIndex] = useState(0)

  const showPrevMedia = () => {
    setMediaIndex((index) => {
      if (index === 0) return urls.length + files.length - 1
      return index - 1
    })
  }

  const showNextMedia = () => {
    setMediaIndex((index) => {
      if (index === urls.length + files.length - 1) return 0
      return index + 1
    })
  }

  return urls.length > 0 || files.length > 0 ? (
    media === "image" ? (
      <div
        className="media"
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            overflow: "hidden",
          }}
        >
          {urls.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Image ${index}`}
              className="img-slider-img"
              width={500}
              height={500}
              style={{ translate: `${-100 * mediaIndex}%` }}
            />
          ))}
          {files.map((image, index) => {
            console.log(URL.createObjectURL(image))
            console.log(urls.length + index)
            return (
              <img
                key={urls.length + index}
                src={URL.createObjectURL(image)}
                alt={`Image ${urls.length + index}`}
                className="img-slider-img"
                width={500}
                height={500}
                style={{ translate: `${-100 * mediaIndex}%` }}
              />
            )
          })}
        </div>
        <button
          type="button"
          onClick={showPrevMedia}
          className="img-slider-btn"
          style={{ left: 0 }}
        >
          <ArrowBigLeft />
        </button>
        <button
          type="button"
          onClick={showNextMedia}
          className="img-slider-btn"
          style={{ right: 0 }}
        >
          <ArrowBigRight />
        </button>
      </div>
    ) : (
      <div
        className="media"
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            overflow: "hidden",
          }}
        >
          {urls.map((video, index) => (
            <video
              width="500"
              height="300"
              controls
              key={index}
              className="img-slider-img"
              style={{ translate: `${-100 * mediaIndex}%` }}
            >
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ))}
          {files.map((video, index) => (
            <video
              width="500"
              height="300"
              controls
              key={urls.length + index}
              className="img-slider-img"
              style={{ translate: `${-100 * mediaIndex}%` }}
            >
              <source src={URL.createObjectURL(video)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ))}
        </div>
        <button
          type="button"
          onClick={showPrevMedia}
          className="img-slider-btn"
          style={{ left: 0 }}
        >
          <ArrowBigLeft />
        </button>
        <button
          type="button"
          onClick={showNextMedia}
          className="img-slider-btn"
          style={{ right: 0 }}
        >
          <ArrowBigRight />
        </button>
      </div>
    )
  ) : null
}

export default ImageSlider
