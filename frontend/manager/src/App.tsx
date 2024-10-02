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
import Dashboard from "./pages/dashboard/dashboard";
import Report1 from "./pages/dashboard/report1";
import Report2 from "./pages/dashboard/report2";
import Report3 from "./pages/dashboard/report3";
import Report4 from "./pages/dashboard/report4";
import Report5 from "./pages/dashboard/report5";
import Report6 from "./pages/dashboard/report6";
import Report7 from "./pages/dashboard/report7";
import Report8 from "./pages/dashboard/report8";
import Report9 from "./pages/dashboard/report9";
import Report10 from "./pages/dashboard/report10";
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
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/hall-wise-bookings"
          element={
            <ProtectedRoute>
              <Report1 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/get-session-wise-bookings"
          element={
            <ProtectedRoute>
              <Report2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/get-booking-type-counts"
          element={
            <ProtectedRoute>
              <Report3 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/get-collection-details"
          element={
            <ProtectedRoute>
              <Report4 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/get-monthwise-collection-details"
          element={
            <ProtectedRoute>
              <Report5 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/total-interaction"
          element={
            <ProtectedRoute>
              <Report6 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/hall-wise-additional-feature-report"
          element={
            <ProtectedRoute>
              <Report7 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/booking-information-report"
          element={
            <ProtectedRoute>
              <Report8 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/booking-confirmation-report"
          element={
            <ProtectedRoute>
              <Report9 />
            </ProtectedRoute>
          }
        />
         <Route
          path="/dashboard/hall-information-report"
          element={
            <ProtectedRoute>
              <Report10 />
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
