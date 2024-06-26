import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./style.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NavBar from "./components/navbar/Navbar";
import Login from "./components/login/Login";
import NotFoundPage from "./pages/NotFoundPage";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import Hall from "./pages/Hall";
import Booking from "./pages/Booking";
import BookADay from "./pages/BookADay";
import BookingSuccessful from "./pages/BookingSuccessful";
export const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavBar />
      <ToastContainer position="top-right" />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/halls/:id"
          element={
            <ProtectedRoute>
              <Hall />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/:bookingId"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route path="/halls/:id/:day" element={<BookADay />} />
        <Route path="/bookingsuccessful" element={<BookingSuccessful />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/error"
          element={
            <ProtectedRoute>
              <NotFoundPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </QueryClientProvider>
  );
}
