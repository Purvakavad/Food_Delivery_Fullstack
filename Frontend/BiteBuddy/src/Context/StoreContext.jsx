import { createContext, useEffect, useState, useMemo, useCallback } from "react";
import axios from 'axios'
export const StoreContext = createContext()
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const StoreContextProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([])
    const [pendingItemId, setPendingItemId] = useState(null);
    const [cartData, setCartData] = useState({})
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [userData, setUserData] = useState(null)
    const [search, setSearch] = useState("");
    const [foods, setFoods] = useState([])
    const [category, setCategory] = useState([])
    const navigate = useNavigate()
    const location = useLocation();
    const backend_url = import.meta.env.VITE_BACKEND_URL
    const getProduct = async () => {
        try {
            const response = await axios.get(`${backend_url}/api/food/list`)
            if (response.data.success) {
                setFoods(response.data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getCatgeory = async () => {
        try {
            const response = await axios.get(`${backend_url}/api/category/list`)
            if (response.data.success) {
                setCategory(response.data.category)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const fetchCart = useCallback(async () => {
        try {
            const response = await axios.get(
                `${backend_url}/api/cart/list`,
                {
                    withCredentials: true
                }
            );
            if (response.data.success) {
                setCartData(response.data.cart);
                setCartItems(response.data.items);
            }
        } catch (error) {
            console.log(error);
        }
    }, [backend_url]);
    const fetchUser = useCallback(async () => {
        try {
            const response = await axios.get(
                `${backend_url}/api/user/me`,
                {
                    withCredentials: true
                }
            );
            if (response.data.success) {
                setUserData(response.data.data);
                await fetchCart();
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setUserData(null);
                setCartData({});
                setCartItems([]);
                return;
            }
            console.log(error);
        }
    }, [backend_url, fetchCart]);
    const addToCart = useCallback(async (id) => {
        try {
            if (!id) return;
            const response = await axios.post(
                `${backend_url}/api/cart/add`,
                { itemId: id, action: "increment" },
                { withCredentials: true }
            );
            if (response.data.success === false) {
                setShowLoginModal(true);
                return;
            }
            setCartData(prev => ({
                ...prev,
                [id]: (prev[id] || 0) + 1
            }));
            await fetchCart();
            setShowLoginModal(false);
        } catch (error) {
            if (error.response?.status === 401) {
                setPendingItemId(id);
                setShowLoginModal(true);
                return;
            }
            toast.error("Something went wrong");
        }
    }, [backend_url, fetchCart]);
    const totalCartItem = useMemo(() => {
        return Object.values(cartData).reduce(
            (total, qty) => total + qty,
            0
        );
    }, [cartData]);
    const { totalAmount, totalDiscount } = useMemo(() => {
        return cartItems.reduce(
            (acc, item) => {
                const qty = cartData[item._id] || 0;
                acc.totalAmount += qty * item.offer_price;
                acc.totalDiscount +=
                    qty * (item.price - item.offer_price);
                return acc;
            },
            {
                totalAmount: 0,
                totalDiscount: 0
            }
        );
    }, [cartItems, cartData]);
    const deliveryFee = totalAmount >= 199 ? 0 : 30;
    const increment = useCallback(async (id) => {
        await axios.post(
            `${backend_url}/api/cart/add`,
            { itemId: id, action: "increment" },
            { withCredentials: true }
        );
        setCartData(prev => ({
            ...prev,
            [id]: (prev[id] || 0) + 1
        }));
        await fetchCart();
    }, [backend_url, fetchCart]);
    const decrement = useCallback(async (id) => {
        await axios.post(
            `${backend_url}/api/cart/add`,
            { itemId: id, action: "decrement" },
            { withCredentials: true }
        );
        setCartData((prev) => ({
            ...prev,
            [id]: Math.max((prev[id] || 1) - 1, 0)
        }));
        await fetchCart();
    }, [backend_url, fetchCart]);
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);
    useEffect(() => {
        const path = location.pathname;
        if (path === "/" || path === "/menu") {
            getProduct();
            getCatgeory();
        }
    }, [location.pathname]);
    const value = useMemo(() => ({
        foods,
        setFoods,
        category,
        setCategory,
        cartItems,
        search,
        setSearch,
        setCartItems,
        addToCart,
        setShowLoginModal,
        fetchUser,
        showLoginModal,
        totalCartItem,
        navigate,
        backend_url,
        increment,
        decrement,
        setCartData,
        cartData,
        fetchCart,
        totalAmount,
        totalDiscount,
        deliveryFee,
        setUserData,
        userData
    }), [
        foods,
        category,
        cartItems,
        search,
        addToCart,
        fetchUser,
        showLoginModal,
        totalCartItem,
        navigate,
        backend_url,
        increment,
        decrement,
        cartData,
        fetchCart,
        totalAmount,
        totalDiscount,
        deliveryFee,
        userData
    ]);
    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider;