import axios from "../api/axios"
import useAuth from "./useAuth"

const LOGOUT_URL = "/adminLogout"

const useLogout = () => {
    const { setAuth } = useAuth()

    const logout = async () => {
        try {
            await axios.get(LOGOUT_URL, { withCredentials: true })
            setAuth({})
        } catch(err) {
            console.error(err)
        }
    }
    
    return logout
}

export default useLogout