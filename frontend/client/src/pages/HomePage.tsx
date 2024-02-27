import { useQuery } from "@tanstack/react-query";
import Card from "../components/homePage/Card";
import axiosInstance from "../config/axiosInstance.ts";
// import { EachHallType } from "../types/Hall.types.ts";
import {EachHallType} from "../../../../types/global.ts"

function HomePage() {
  //getAllHalls
  // hallProps

  const { data, error, isFetching, status } = useQuery({
    queryKey: ["allhalls"],
    queryFn: async () => {
      const response = await axiosInstance.get("getAllHalls");
      return response.data as EachHallType[];
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
    </div>
  );
}

export default HomePage;
