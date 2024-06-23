import Register from "./components/Register"
import Login from "./components/Login"
import Missing from "./components/Missing"
import Admin from "./components/Admin"
import Unauthorized from "./components/Unauthorized"
import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import RequireAuth from "./components/RequireAuth"
import PersistLogin from "./components/PersistLogin"

import './app.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public route */}
        <Route path="login" element={<Login />}></Route>
        <Route path="unauthorized" element={<Unauthorized />}></Route>

        {/* protected route */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[1984, 5150]} />}>
            
            <Route index path="admin" element={<Admin />}></Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={[5150]} />}>
            <Route path="register" element={<Register />}></Route>
          </Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  )
}

export default App
