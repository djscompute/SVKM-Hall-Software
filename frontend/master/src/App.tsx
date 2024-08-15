import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EditHall from "./pages/editHall";
import "./style.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NavBar from "./components/navbar/Navbar";
import Login from "./components/login/Login";
import NotFoundPage from "./pages/NotFoundPage";
import AddHall from "./pages/addHall";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateAdmin from "./pages/createAdmin";
import EditAdmin from "./pages/editAdmin";
import Admins from "./pages/Admins";
import Dashboard from "./pages/dashboard/dashboard";
import Report1 from "./pages/dashboard/report1";
import Report2 from "./pages/dashboard/report2";
import Report3 from "./pages/dashboard/report3";
import Report4 from "./pages/dashboard/report4";
import Report5 from "./pages/dashboard/report5";
import Report6 from "./pages/dashboard/report6";
import Report7 from "./pages/dashboard/report7";
import Report8 from "./pages/dashboard/report8";
import Constants from "./pages/Constants";
import DeleteHall from "./pages/deleteHall";
import Report9 from "./pages/dashboard/report9";
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
          path="/addnewhall"
          element={
            <ProtectedRoute>
              <AddHall />
            </ProtectedRoute>
          }
        />

        <Route
          path="/deletehall"
          element={
            <ProtectedRoute>
              <DeleteHall />
            </ProtectedRoute>
          }
        />
        <Route
          path="/halls/:id"
          element={
            <ProtectedRoute>
              <EditHall />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createadmin"
          element={
            <ProtectedRoute>
              <CreateAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/:id"
          element={
            <ProtectedRoute>
              <EditAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admins"
          element={
            <ProtectedRoute>
              <Admins />
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
          path="/login"
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/constants"
          element={
            <ProtectedRoute>
              <Constants />
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
