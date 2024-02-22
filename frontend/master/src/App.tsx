import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HallInfo from "./pages/hallInfo";
import "./style.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./components/login/Login"
import NotFoundPage from "./pages/NotFoundPage";
// import ProtectedRoute from '../src/components/ProtectedRoute';

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/halls/:id" element={<HallInfo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/error" element={<NotFoundPage/>} />
      </Routes>
    </QueryClientProvider>
  );
}
