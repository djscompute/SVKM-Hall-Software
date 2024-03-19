import { useQuery } from "@tanstack/react-query";
import Card from "../components/homePage/Card";
import axiosInstance from "../config/axiosInstance.ts";
import { EachHallType } from "../types/Hall.types.ts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomePage() {
  const { data, error, isFetching } = useQuery({
    queryKey: ["allhalls"],
    queryFn: async () => {
      try {
        const responsePromise = axiosInstance.get("getAllHalls");
        toast.promise(responsePromise, {
          pending: "Fetching halls...",
          success: "Latest Halls Data Fetched !",
          error: "Failed to fetch Halls. Please try again.",
        });
        const response = await responsePromise;
        return response.data as EachHallType[];
      } catch (error) {
        toast.error("Failed to fetch Halls. Please try again.");
        throw error;
      }
    },
  });


  return (
    <div className="flex flex-col items-center">
      <h1 className=" text-3xl font-semibold my-5">All Halls</h1>
      <div className="flex flex-wrap justify-around w-full">
        {data?.map((hallProp) => (
          <Card
            key={hallProp._id}
            id={hallProp._id}
            img={hallProp.images[0]}
            tagline={hallProp.about}
            name={hallProp.name}
            place={hallProp.location.desc1}
            numPhotos={hallProp.images.length}
            minCapacity={hallProp.capacity}
            maxCapacity={hallProp.capacity}
            price={hallProp.pricing}
          />
        ))}
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default HomePage;
