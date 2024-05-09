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
import Constants from "./pages/Constants";
import Report7 from "./pages/dashboard/report7";
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
          path="/dashboard/report2"
          element={
            <ProtectedRoute>
              <Report2 />
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
