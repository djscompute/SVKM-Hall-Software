import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axiosInstance.ts";
import { EachHallType } from "../types/Hall.types.ts";
import { convert_IST_TimeString_To12HourFormat } from "../utils/convert_IST_TimeString_To12HourFormat.tsx";
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

  const { data, error, isFetching } = useQuery({
    queryKey: ["allhalls"],
    queryFn: async () => {
      try {
        const responsePromise = axiosInstance.get(`getHall/${id}`);
        toast.promise(responsePromise, {
          pending: "Fetching hall...",
          // success: "Hall fetched successfully!",
          error: "Failed to fetch Hall. Please try again.",
        });
        const response = await responsePromise;
        return response.data as EachHallType;
      } catch (error) {
        throw error;
      }
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const toggleReadMore = () => setIsOpen(!isOpen);

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    if (!data?.images) return;
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? data?.images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    if (!data?.images) return;
    const isLastSlide = currentIndex === data?.images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: React.SetStateAction<number>) => {
    setCurrentIndex(slideIndex);
  };

  if (isFetching) {
    return (
      <>
        <div>Fetching Info</div>
      </>
    );
  }

  return (
    <>
      {data && (
        <div className="pb-20">
          {data ? (
            <div className="flex w-full flex-col items-center gap-5 sm:gap-10 px-3 sm:px-10 md:px-16 lg:px-28">
              <h1 className="text-center text-5xl mt-10">{data.name}</h1>
              {/* <Calendar hallId={id as string} HallData={data} /> */}
              <ImageCarousel data={data} />
              <hr className=" bg-gray-300 h-[1.5px] w-full" />
              <HallLocation data={data} />

              <hr className=" bg-gray-300 h-[1.5px] w-full" />
              {/* About Hall */}
              <AboutHall data={data}/>

              {/* Seating and capacity */}
              <HallCapacity data={data}/>
              <hr className=" bg-gray-300 h-[1.5px] w-full" />

              <HallAdditionalFeatures data={data}/>
              <hr className=" bg-gray-300 h-[1.5px] w-full" />

              <HallPricing data={data}/>
              
            </div>
          ) : (
            <div>
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
