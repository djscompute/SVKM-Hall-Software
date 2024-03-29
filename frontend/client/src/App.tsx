import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Hall from "./screens/Hall";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HallDetails from "./pages/HallDetails";
import NavBar from "./components/navbar/Navbar";
import { ToastContainer } from "react-toastify";

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NavBar />
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/details" element={<HallDetails />} />
        <Route path="/halls/:id" element={<Hall />} />
      </Routes>
    </QueryClientProvider>
  );
}
