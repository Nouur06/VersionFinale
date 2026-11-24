import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import RoomDetail from "./pages/RoomDetail";
import HeritageDetail from "./pages/HeritageDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminUsers from "./pages/admin/AdminUsers";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chambres" element={<Rooms />} />
          <Route path="/chambres/:id" element={<RoomDetail />} />
          <Route path="/galerie" element={<Gallery />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/a-propos/:slug" element={<HeritageDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Pages réservées aux utilisateurs connectés */}
          <Route element={<ProtectedRoute />}>
            <Route path="/booking" element={<Booking />} />
            <Route path="/mes-reservations" element={<MyBookings />} />
            <Route path="/profil" element={<Profile />} />
          </Route>

          {/* Administration : admin et super_admin uniquement */}
          <Route element={<RoleRoute roles={["admin", "super_admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="reservations" element={<AdminBookings />} />
              <Route path="chambres" element={<AdminRooms />} />
              <Route path="galerie" element={<AdminGallery />} />
              <Route path="utilisateurs" element={<AdminUsers />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
