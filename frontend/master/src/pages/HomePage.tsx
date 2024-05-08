import { useQuery } from "@tanstack/react-query";
import Card from "../components/homePage/Card";
import axiosInstance from "../config/axiosInstance.ts";
import { EachHallType } from "../types/Hall.types.ts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomePage() {
  const { data, isFetching } = useQuery({
    queryKey: ["allhalls"],
    queryFn: async () => {
      try {
        const responsePromise = axiosInstance.get("getAllHalls");
        console.log("FETCHING");
        toast.promise(responsePromise, {
          pending: "Fetching halls...",
          success: "Latest Halls Data Fetched !",
          error: "Failed to fetch Halls. Please try again.",
        });
        const response = await responsePromise;
        return response.data as EachHallType[];
      } catch (error) {
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
  });

  if (isFetching) return <h1>LOADING</h1>;
  return (
    <div className="flex flex-col items-center">
      <h1 className=" text-3xl font-semibold my-5">All Halls</h1>
      <div className="flex flex-wrap justify-around w-full">
        {data?.map((hallProp) => (
          <Card hallData={hallProp} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
