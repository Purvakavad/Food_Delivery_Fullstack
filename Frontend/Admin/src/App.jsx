import React, { lazy, Suspense, useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Sidebar from './Components/Sidebar/Sidebar'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { AdminContext } from './Context/AdminContext'
const AddItemPage = lazy(() => import('./Pages/ProductPages/AddItemPage/AddItemPage'))
const Category = lazy(() => import('./Pages/CategoryPages/Category/Category'))
const AddCategory = lazy(() => import('./Pages/CategoryPages/AddCategory/AddCategory'))
const EditCategory = lazy(() => import('./Pages/CategoryPages/EditCategory/EditCategory'))
const Product = lazy(() => import('./Pages/ProductPages/Product/Product'))
const EditProduct = lazy(() => import('./Pages/ProductPages/EditProduct/EditProduct'))
const Login = lazy(() => import('./Pages/Login/Login'))
const Orders = lazy(() => import('./Pages/Orders/Orders'))
const MyProfile = lazy(() => import('./Pages/Myprofile/MyProfile'))
const AccountSetting = lazy(() => import('./Pages/AccountSetting/AccountSetting'))
const Dashboard = lazy(() => import('./Pages/Dashboard/Dashboard'))
const Users = lazy(() => import('./Pages/Users/Users'))
const UserDetails = lazy(() => import('./Pages/Users/singleUserDetails/UserDetails'))
const NotFound = lazy(() => import('./Pages/NotFound/NotFound'))
const Payments = lazy(() => import('./Pages/Payment/Payments'))
const PaymentDetails = lazy(() => import('./Pages/Payment/PaymentDetails/PaymentDetails'))
export default function App() {
  const { isLogin } = useContext(AdminContext)
  if (isLogin == false) {
    return (
      <>
        <ToastContainer />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </>
    )
  }
  return (
    <div className='main_container'>
      <ToastContainer />
      <Navbar />
      <div className="main">
        <Sidebar />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path="/product" element={<Product />} />
            <Route
              path="/product/add"
              element={<AddItemPage />}
            />
            <Route
              path="/product/edit/:id"
              element={<EditProduct />}
            />
            <Route
              path='/category'
              element={<Category />}
            />
            <Route
              path='/addCategory'
              element={<AddCategory />}
            />
            <Route
              path='/category/edit/:id'
              element={<EditCategory />}
            />
            <Route
              path='/Orders'
              element={<Orders />}
            />
            <Route
              path='/Users'
              element={<Users />}
            />
            <Route
              path='/userdetails/:id'
              element={<UserDetails />}
            />
            <Route
              path="/payments"
              element={<Payments />}
            />
            <Route
              path="/payments/:id"
              element={<PaymentDetails />}
            />
            <Route
              path='/myprofile'
              element={<MyProfile />}
            />
            <Route
              path="/edit-account"
              element={<AccountSetting />}
            />
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}