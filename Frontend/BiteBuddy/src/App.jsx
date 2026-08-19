import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Component/Navbar/Navbar";
import Footer from "./Component/Footer/Footer";
import { ToastContainer } from "react-toastify";
const Home = lazy(() =>
  import("./Pages/Home/Home").then((module) => ({
    default: module.Home,
  }))
);
const Menu = lazy(() => import("./Pages/Menu/Menu"));
const About = lazy(() => import("./Pages/About/About"));
const Contact = lazy(() => import("./Pages/Contact/Contact"));
const Login = lazy(() => import("./Pages/Login/Login"));
const Cart = lazy(() => import("./Pages/Cart/Cart"));
const PlaceOrder = lazy(() => import("./Pages/PlaceOrder/PlaceOrder"));
const MyOrder = lazy(() => import("./Pages/MyOrder/MyOrders"));
const SingleProduct = lazy(() =>
  import("./Pages/SingleProduct/SingleProduct")
);
const MyProfile = lazy(() => import("./Pages/Profile/MyProfile"));
const EditProfile = lazy(() =>
  import("./Pages/EditProfile/EditProfile")
);
const NotFound = lazy(() => import("./Pages/NotFound/NotFound"));
const App = () => {
  return (
    <div className="main_conatiner">
      <ToastContainer />
      <Navbar />
      <main className="main_content">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route
              path="/singleproduct/:id"
              element={<SingleProduct />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/palceorder" element={<PlaceOrder />} />
            <Route path="/myorder" element={<MyOrder />} />
            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="/edit-account" element={<EditProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <div className="footer_conteiner">
        <Footer />
      </div>
    </div>
  );
};
export default App;