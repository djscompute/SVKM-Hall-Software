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
    <div className="flex flex-col items-center">
      {isFetching ? (
        <h1 className="text-3xl font-semibold my-5">Loading...</h1>
      ) : (
        <>
          <h1 className="text-3xl font-semibold my-5">All Halls</h1>
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
        </>
      )}
    </div>
  );
}

export default HomePage;
