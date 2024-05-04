import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Hall from "./pages/Hall";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NavBar from "./components/navbar/Navbar";
import { ToastContainer } from "react-toastify";
import BookADay from "./pages/BookADay";
import BookingSuccessful from "./pages/BookingSuccessful";

export const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavBar />
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/halls/:id" element={<Hall />} />
        <Route path="/halls/:id/:day" element={<BookADay />} />
        <Route path="/bookingsuccessful" element={<BookingSuccessful />} />
      </Routes>
    </QueryClientProvider>
  );
}
