import { useState, useEffect } from "react";
import axios from 'axios'
import { createContext } from "react";
import { useNavigate } from 'react-router-dom';
export const AdminContext = createContext()
const AdminContextProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false)
    const backend_url = import.meta.env.VITE_BACKED_URL
    const navigate = useNavigate()
    const [adminData, setAdminData] = useState({})
    const [showSidebar, setShowSidebar] = useState(false)
    const getAdminInfo = async () => {
        try {
            const response = await axios.get(`${backend_url}/api/user/adminuser`, { withCredentials: true })
            if (response.data.success) {
                setAdminData(response.data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const checkAuth = async () => {
        try {
            const response = await axios.get(`${backend_url}/api/user/checkauth`, {
                withCredentials: true,
            })
            if (response.data.success) {
                setIsLogin(true)
            } else {
                setIsLogin(false)
            }
        } catch (error) {
            console.log(error)
            setIsLogin(false)
        }
    }
    useEffect(() => {
        checkAuth();
        getAdminInfo()
    }, [])
    const value = { showSidebar, setShowSidebar, isLogin, getAdminInfo, setIsLogin, adminData, setAdminData, backend_url, navigate }
    return (
        < AdminContext.Provider value={value} >
            {children}
        </AdminContext.Provider >
    )
}
export default AdminContextProvider 