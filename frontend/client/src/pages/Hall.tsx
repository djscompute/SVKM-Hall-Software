import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosClientInstance from "../config/axiosClientInstance.ts";
import { EachHallType } from "../types/Hall.types.ts";
import { toast } from "react-toastify";
import Calendar from "../components/Calender/calendar.tsx";
import "react-toastify/dist/ReactToastify.css";
import ImageCarousel from "../components/hall/ImageCarousel.tsx";
import HallLocation from "../components/hall/HallLocation.tsx";
import AboutHall from "../components/hall/AboutHall.tsx";
import HallCapacity from "../components/hall/HallCapacity.tsx";
import HallAdditionalFeatures from "../components/hall/HallAdditionalFeatures.tsx";
import HallPricing from "../components/hall/HallPricing.tsx";

function Hall() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const { data, isFetching } = useQuery({
    queryKey: ["allhalls", `hall-${id}`],
    queryFn: async () => {
      // eslint-disable-next-line no-useless-catch
      try {
        const responsePromise = axiosClientInstance.get(`getHall/${id}`);
        toast.promise(responsePromise, {
          pending: "Fetching hall...",
          error: "Failed to fetch Hall. Please try again.",
        });
        const response = await responsePromise;
        return response.data as EachHallType;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    
    if (location.hash && !isFetching) {
      const timeoutId = setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 500); 

      return () => clearTimeout(timeoutId);
    }
  }, [location.hash, isFetching]);

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Fetching Info...
      </div>
    );
  }

  return (
    <>
      {data && (
        <div className="pb-20">
          {data ? (
            <div className="flex w-full flex-col items-center gap-5 sm:gap-10 px-3 sm:px-10 md:px-16 lg:px-28">
              <h1 className="text-center text-5xl mt-10">{data.name}</h1>
              <Calendar hallId={id as string} HallData={data} />
              <ImageCarousel data={data} />
              <hr className="bg-gray-300 h-[1.5px] w-full" />
              <HallLocation data={data} />
              <hr className="bg-gray-300 h-[1.5px] w-full" />
              <AboutHall data={data} />
              <HallCapacity data={data} />
              <hr className="bg-gray-300 h-[1.5px] w-full" />
              <HallAdditionalFeatures data={data} />
              <hr className="bg-gray-300 h-[1.5px] w-full" />
              <div id="hall-pricing">
                <HallPricing data={data} />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center min-h-screen">
              <h1 className="text-3xl font-semibold my-5 text-center">
                NO SUCH HALL EXISTS
              </h1>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Hall;