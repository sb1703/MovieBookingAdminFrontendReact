import { useRef, useState, useEffect } from "react"
import useAuth from "../hooks/useAuth"
import { useNavigate, useLocation } from "react-router-dom"
import useInput from "../hooks/useInput"
import useToggle from "../hooks/useToggle"
import { login } from "../api/auth"

const Login = () => {
  const { setAuth } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location?.state?.from?.pathname || "/"

  const userRef = useRef()
  const errRef = useRef()

  const [user, resetUser, userAttribs] = useInput("user", "")
  const [pwd, setPwd] = useState("")
  const [errMsg, setErrMsg] = useState("")
  const [check, toggleCheck] = useToggle("persist", false)

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg("")
  }, [user, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await login({ user, pwd })
      const roles = response?.data?.roles
      setAuth({ user, roles })
      resetUser()
      setPwd("")
      navigate(from, { replace: true })
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response")
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password")
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized")
      } else {
        setErrMsg("Unknown Error")
      }
      errRef.current.focus()
    }
  }

  return (
    <div className="App">
      <section>
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            ref={userRef}
            autoComplete="off"
            {...userAttribs}
            required
          />

          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
          />

          <button>Sign In</button>

          <div className="persistCheck">
            <input
              type="checkbox"
              id="persist"
              onChange={toggleCheck}
              checked={check}
            />
            <label htmlFor="persist">Trust This Device</label>
          </div>
        </form>
      </section>
    </div>
  )
}

export default Login
