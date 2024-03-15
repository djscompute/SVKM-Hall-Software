import { useQuery } from "@tanstack/react-query";
import Card from "../components/homePage/Card";
import axiosInstance from "../config/axiosInstance.ts";
import { EachHallType } from "../../../../types/global.ts";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

function HomePage() {
  const [toastShown, setToastShown] = useState(false)
  const { data, error, isFetching } = useQuery({
    queryKey: ["allhalls"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("getAllHalls");
        const promise = new Promise((resolve) => setTimeout(resolve, 1000)); 
        if(!toastShown) //Toast message to appear only once
        {
          toast.promise(
            promise,
            {
              pending: 'Fetching halls...', 
              success: 'Halls fetched successfully!', 
              error: 'Failed to fetch Halls. Please try again.', 
            }
          );
          setToastShown(true)
        }
        return response.data as EachHallType[];
      } catch (error) {   
          
        toast.error('Failed to fetch Halls. Please try again.');
        
        setToastShown(true)
        throw error;
      }
    },
  });

  return (
    <div className="flex flex-col items-center">
      
      {!data?<h1 className="text-3xl font-semibold my-5">Loading...</h1>:<h1 className="text-3xl font-semibold my-5">All Halls</h1>}
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
      <ToastContainer position="top-right"/>
    </div>
  );
}

export default HomePage;
