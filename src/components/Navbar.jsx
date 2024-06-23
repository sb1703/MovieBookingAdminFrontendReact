import { Link } from "react-router-dom"
import useLogout from "../hooks/useLogout"

const Navbar = () => {
  const logout = useLogout()

  const signOut = async () => {
    await logout()
  }

  return (
    <nav className="top-nav">
      <div className="nav-text-large">Admin</div>
      <ul className="nav-list">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link onClick={signOut} to="/">
            Sign Out
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
