import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Hall from "./screens/Hall";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
     <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/halls/:id" element={<Hall />} />
      </Routes>
    </QueryClientProvider>
  );
}
