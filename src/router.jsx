import { createBrowserRouter, Navigate, useRouteError } from "react-router-dom"
import Layout from "./components/Layout"
import Missing from "./components/Missing"
import Login from "./components/Login"
import Register from "./components/Register"
import Unauthorized from "./components/Unauthorized"
import Admin from "./components/Admin"
import AdminLayout from "./components/AdminLayout"
import PersistLogin from "./components/PersistLogin"
import RequireAuth from "./components/RequireAuth"
import { newMovieRoute } from "./components/NewMovieFormPage"
import { editMovieRoute } from "./components/EditMovieFormPage"
import { adminMovieRoute } from "./components/Admin"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "unauthorized",
        element: <Unauthorized />,
      },
      {
        element: <PersistLogin />,
        children: [
          {
            element: <RequireAuth allowedRoles={[1984, 5150]} />,
            children: [
              {
                path: "admin",
                element: <AdminLayout />,
                children: [
                  {
                    index: true,
                    element: <Admin />,
                    ...adminMovieRoute
                  },
                  {
                    path: "new",
                    ...newMovieRoute
                  },
                  {
                    path: "edit/:_id",
                    ...editMovieRoute
                  },
                ]
              },
            ],
          },
          {
            element: <RequireAuth allowedRoles={[5150]} />,
            children: [
              {
                path: "register",
                element: <Register />,
              },
            ],
          },
        ],
      },
      { path: "*", element: <Missing /> },
    ],
  },
])

function ErrorPage() {
  const error = useRouteError()

  return (
    <>
      <h1>Error - Something went wrong</h1>
      {import.meta.env.MODE !== "production" && (
        <>
          <pre>{error.message}</pre>
          <pre>{error.stack}</pre>
        </>
      )}
    </>
  )
}
