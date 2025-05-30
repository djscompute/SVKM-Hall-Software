import { useQuery } from "@tanstack/react-query";
import Card from "../components/homePage/Card";
import axiosClientInstance from "../config/axiosClientInstance.ts";
// import { EachHallType } from "../types/Hall.types.ts";
import { EachHallType } from "../../../../types/global.ts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomePage() {
  const { data, error, isFetching } = useQuery({
    queryKey: ["allhalls"],
    queryFn: async () => {
      try {
        const responsePromise = axiosClientInstance.get("getAllHalls");
        toast.promise(responsePromise, {
          pending: "Fetching halls...",
          // success: "Halls fetched successfully!",
          error: "Failed to fetch Halls. Please reload.",
        });
        const response = await responsePromise;
        return response.data as EachHallType[];
      } catch (error) {
        console.log("ERROR WHILE FETCHING HALLS");
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
  });

  if (isFetching) {
    return <div>Fetching Info</div>;
  }

  return (
    <div className="flex flex-wrap justify-around w-full my-10">
      {data?.map((hallProp) => (
        <Card hallData={hallProp} />
      ))}
    </div>
  );
}

export default HomePage;
