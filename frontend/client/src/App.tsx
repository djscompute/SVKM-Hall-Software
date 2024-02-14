import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGeneralStore } from "./store/generalStore";
import Hall from "./screens/Hall";
import hallProps from "./constants/hallProps";


export default function App() {
  const [bears, increase] = useGeneralStore((store) => [
    store.bears,
    store.increase,
  ]);


 
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="">
        <Hall hallProps={hallProps}/>
      </div>
    </QueryClientProvider>
  );
}
