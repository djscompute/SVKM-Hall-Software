import { useQuery } from "@tanstack/react-query";
import Card from "../components/homePage/Card";
import axiosInstance from "../config/axiosInstance.ts";
// import { EachHallType } from "../types/Hall.types.ts";
import { EachHallType } from "../../../../types/global.ts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomePage() {
  const { data, error, isFetching } = useQuery({
    queryKey: ["allhalls"],
    queryFn: async () => {
      try {
        const responsePromise = axiosInstance.get("getAllHalls");
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
  });

  if (isFetching) {
    return <div>Fetching Info</div>;
  }

  return (
    <div className="flex flex-wrap justify-around w-full mt-10">
      {data?.map((hallProp) => (
        <Card
          _id={hallProp._id}
          key={hallProp._id}
          images={hallProp.images}
          name={hallProp.name}
          location={hallProp.location}
          capacity={hallProp.capacity}
          seating={hallProp.seating}
          pricing={hallProp.pricing}
        />
      ))}
    </div>
  );
}

export default HomePage;
