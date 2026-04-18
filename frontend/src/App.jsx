import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserOrders from "./pages/UserOrders";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageOrders from "./pages/admin/ManageOrders";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        
        <main className="flex-grow container mx-auto p-4 flex flex-col">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/category/:slug" element={<Category />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/my-orders" element={<UserOrders />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<ManageProducts />} />
              <Route path="/admin/categories" element={<ManageCategories />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/orders" element={<ManageOrders />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
