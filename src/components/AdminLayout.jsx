import {
  Outlet,
  ScrollRestoration,
  useNavigation,
} from "react-router-dom"
import Navbar from "./Navbar"

const AdminLayout = () => {
  const navigate = useNavigation()
  const isLoading = navigate.state === "loading"

  return (
    <>
      <Navbar />
      <ScrollRestoration />
      {isLoading && <div className="loading-spinner" />}
      <div className={`container ${isLoading ? "loading" : ""}`}>
        <Outlet />
      </div>
    </>
  )
}

export default AdminLayout
