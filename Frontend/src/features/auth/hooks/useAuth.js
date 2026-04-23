import { login, register, getMe, logout } from "../services/auth.api";
import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { useEffect } from "react";


export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    async function handleRegister({ username, email, password }) {
    setLoading(true)
    try {
        const data = await register({ username, email, password })
        setUser(data.user)
    } catch (err) {
        throw err
    } finally {
        setLoading(false)
    }
}

    async function handleLogin({ username, email, password }) {
    setLoading(true)
    try {
        const data = await login({ username, email, password })
        setUser(data.user)
    } catch (err) {
        throw err // 👈 Login page ko pata chale
    } finally {
        setLoading(false)
    }
}

   async function handleGetMe() {
    setLoading(true)
    try {
        const data = await getMe()
        setUser(data.user)
    } catch (err) {
        console.log("User not logged in") // 👈 401 yaha aayega
        setUser(null)
    } finally {
        setLoading(false) // 🔥 ALWAYS chalega
    }
}

    async function handleLogout() {
        setLoading(true)
        const data = await logout()
        setUser(null)
        setLoading(false)
    }

    useEffect(() => {
        handleGetMe()
    }, [])

    return ({
        user, loading, handleRegister, handleLogin, handleLogout, handleGetMe
    })
}