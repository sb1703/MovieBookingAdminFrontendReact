import React from "react"
import ReactDOM from "react-dom/client"
import { AuthProvider } from "./context/AuthProvider.jsx"
import { disableReactDevTools } from "@fvilers/disable-react-devtools"
import { RouterProvider } from "react-router-dom"
import { router } from "./router.jsx"
import "./styles/main.css"

if (process.env.NODE_ENV === "production") {
  disableReactDevTools()
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)
