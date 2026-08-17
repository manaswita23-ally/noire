import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Collections from "./pages/Collections.jsx";
import CollectionDetail from "./pages/CollectionDetail.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Search from "./pages/Search.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Account from "./pages/Account.jsx";

import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminOverview from "./pages/admin/AdminOverview.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminProductForm from "./pages/admin/AdminProductForm.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminCollections from "./pages/admin/AdminCollections.jsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.jsx";

function StorefrontLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Admin routes — separate layout, no storefront navbar/footer */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/:id/edit" element={<AdminProductForm />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="collections" element={<AdminCollections />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      {/* Storefront routes */}
      <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
      <Route path="/shop" element={<StorefrontLayout><Shop /></StorefrontLayout>} />
      <Route path="/collections" element={<StorefrontLayout><Collections /></StorefrontLayout>} />
      <Route path="/collection/:slug" element={<StorefrontLayout><CollectionDetail /></StorefrontLayout>} />
      <Route path="/product/:id" element={<StorefrontLayout><ProductDetails /></StorefrontLayout>} />
      <Route path="/search" element={<StorefrontLayout><Search /></StorefrontLayout>} />
      <Route path="/about" element={<StorefrontLayout><About /></StorefrontLayout>} />
      <Route path="/login" element={<StorefrontLayout><Login /></StorefrontLayout>} />
      <Route path="/register" element={<StorefrontLayout><Register /></StorefrontLayout>} />
      <Route path="/cart" element={<StorefrontLayout><Cart /></StorefrontLayout>} />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <StorefrontLayout><Checkout /></StorefrontLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <StorefrontLayout><Orders /></StorefrontLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <StorefrontLayout><OrderDetail /></StorefrontLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <StorefrontLayout><Wishlist /></StorefrontLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <StorefrontLayout><Account /></StorefrontLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <StorefrontLayout>
            <div className="container-px py-32 text-center">
              <h1 className="heading-serif text-4xl mb-4">Page not found</h1>
              <p className="text-stone">The page you're looking for doesn't exist.</p>
            </div>
          </StorefrontLayout>
        }
      />
    </Routes>
  );
}
