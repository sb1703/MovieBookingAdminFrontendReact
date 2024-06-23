import { Link } from "react-router-dom"

export function MovieCard({ _id, Title, Director, Year, Runtime, Plot }) {
  return (
    <div className="card">
      <div className="card-header">{Title}</div>
      <div className="card-body">
        <div className="card-preview-text">{Plot}</div>
      </div>
      <div className="card-footer">
        <Link className="btn" to={`/admin/edit/${_id}`}>
          View
        </Link>
      </div>
    </div>
  )
}
