import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import EventList from "./pages/EventList";
import EventDetails from "./pages/Eventdetails";
import EventMap from "./pages/EventMap";
import AdminCreateEvent from "./pages/Admincreateevent";
import AdminMapEditor from "./pages/AdminMapeditor";
import QrScanner from "./pages/QrScanner";
import ManagerBanners from "./pages/ManagerBanners";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function AppContent() {
  const location = useLocation();
  const isMapPage = location.pathname.includes("/map");

  return (
    <>
      {!isMapPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/event/:id/map" element={<EventMap />} />
        <Route path="/scan-qr" element={<QrScanner />} />
        <Route path="/admin" element={<AdminCreateEvent />} />
        <Route path="/admin/map/:eventId" element={<AdminMapEditor />} />
        <Route path="/admin/banners" element={<ManagerBanners />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      {!isMapPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;