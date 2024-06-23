import { Outlet } from "react-router-dom"
import { useState, useEffect } from "react"
import useAuth from "../hooks/useAuth"
import useLocalStorage from "../hooks/useLocalStorage"
import { adminVerifySession } from "../api/auth"

const ADMIN_VERIFY_SESSION_URL = "/adminVerifySession"

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true)
    const { auth, setAuth } = useAuth()
    const [persist] = useLocalStorage('persist', false)

    useEffect(() => {
        let isMounted = true

        const verifySession = async () => {
            try {
                const response = await adminVerifySession()
                setAuth({ user: response?.data?.user, roles: response?.data?.roles })
            }
            catch (error) {
                console.log("No session found")
            }
            finally {
                isMounted && setIsLoading(false)
            }
        }

        !auth?.user ? verifySession() : setIsLoading(false)

        return () => isMounted = false
    }, [])

    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <h1>Loading...</h1>
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin