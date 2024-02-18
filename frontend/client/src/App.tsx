import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGeneralStore } from "./store/generalStore";
import Hall from "./screens/Hall";
import hallProps from "./constants/hallProps";
import Card from './components/Card';
import bj from "./assets/bj-hall.png"
import nmims from "./assets/nmims-hall.jpg"

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
      <div className="flex flex-wrap justify-around"></div>
        <Card 
          img= {bj}
          tagline="SVKM : Happiness Assured"
          name="BJ Hall"
          place="Vile Parle"
          numPhotos={30}
          minCapacity={50}
          maxCapacity={300}
          price={2000}
        />
        <Card 
          img= {nmims}
          tagline="NMIMS : Happiness Assured"
          name="NMIMS Hall"
          place="Vile Parle"
          numPhotos={25}
          minCapacity={150}
          maxCapacity={500}
          price={2500}
        />
        <Card />
        <Card />
        <Card />
      <div/>
    </QueryClientProvider>
  );
}
