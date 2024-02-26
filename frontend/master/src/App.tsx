import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EditHall from "./pages/editHall";
import "./style.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NavBar from "./components/navbar/Navbar";
import Login from "./components/login/Login";
import NotFoundPage from "./pages/NotFoundPage";
import AddHall from "./pages/addHall";
// import ProtectedRoute from '../src/components/ProtectedRoute';
export const queryClient = new QueryClient();

export default function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/addnewhall" element={<AddHall />} />
        <Route path="/halls/:id" element={<EditHall />} />
        <Route path="/login" element={<Login />} />
        <Route path="/error" element={<NotFoundPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
