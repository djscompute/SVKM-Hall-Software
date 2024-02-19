import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HallInfo from "./pages/hallInfo";
import "./style.css";

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col">
        <HallInfo />
      </div>
    </QueryClientProvider>
  );
}
