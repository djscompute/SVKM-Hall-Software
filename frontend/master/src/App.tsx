import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HallInfo from "./pages/hallInfo";
import "./style.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NavBar from "./components/navbar/Navbar";

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NavBar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/halls/:id" element={<HallInfo />} />
      </Routes>
    </QueryClientProvider>
  );
}
