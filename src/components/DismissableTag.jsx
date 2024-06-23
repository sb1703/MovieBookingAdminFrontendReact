import { Tag, X } from "lucide-react"

const TAG_STYLES = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem",
    borderRadius: "0.5rem",
    backgroundColor: "#f0f0f0",
    margin: "0.5rem 0",
    color: "#333",
    flexGrow: 1
}

const X_STYLES = {
    cursor: "pointer",
    color: "#333",
}

const TEXT_STYLES = {
    fontSize: "1rem",
}

const DismissableTag = ({ text, movieName, onClose }) => {
  return (
    <div className="tag" style={TAG_STYLES}>
      <Tag />
      <div>
        <div style={TEXT_STYLES}>{text}</div>
        <div style={TEXT_STYLES}>{movieName}</div>
      </div>
      <X style={X_STYLES} onClick={() => onClose(text)} />
    </div>
  )
}

export default DismissableTag
