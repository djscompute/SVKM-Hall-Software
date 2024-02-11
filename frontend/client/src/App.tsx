import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGeneralStore } from "./store/generalStore";

export default function App() {
  const [bears, increase] = useGeneralStore((store) => [
    store.bears,
    store.increase,
  ]);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col ">
        <p>{bears}</p>
        <button onClick={() => increase(1)}>increase</button>
      </div>
    </QueryClientProvider>
  );
}
