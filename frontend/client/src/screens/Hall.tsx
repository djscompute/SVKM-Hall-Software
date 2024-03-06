import React, { useState } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import CalendarBook from "../components/homePage/CalendarBook.tsx";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axiosInstance.ts";
import { EachHallType } from "../types/Hall.types.ts";

function Hall() {
  const { id } = useParams<{ id: string }>();

  const { data, error, isFetching, status } = useQuery({
    queryKey: ["allhalls"],
    queryFn: async () => {
      const response = await axiosInstance.get(`getHall/${id}`);
      return response.data as EachHallType;
    },
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  if (isFetching) {
    return <div>Fetching Info</div>;
  }

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

  return (
    <>
      {data ? (
        <div className="flex w-full flex-col">
          <h1 className="text-center text-5xl font-light mt-10">{data.name}</h1>
          <div className="flex w-3/4 mx-auto max-xl:flex-col items-center">
            {/* Carousel */}
            {data?.images && (
              <div className="max-w-[800px] h-[600px] relative m-auto py-16 px-4 group w-1/2 max-xl:w-full max-xl:max-w-[600px]">
                <div
                  style={{
                    backgroundImage: `url(${data?.images[currentIndex]})`,
                  }}
                  className="w-full h-full rounded-2xl bg-center bg-cover duration-500"
                ></div>
                {/* Left Arrow */}
                <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                  <BsChevronCompactLeft onClick={prevSlide} size={30} />
                </div>
                {/* Right Arrow */}
                <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                  <BsChevronCompactRight onClick={nextSlide} size={30} />
                </div>
                <div className="flex top-4 justify-center py-2">
                  {data?.images.map((_slide, slideIndex) => (
                    <div
                      key={slideIndex}
                      onClick={() => goToSlide(slideIndex)}
                      className="text-2xl cursor-pointer"
                    >
                      <RxDotFilled />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Carousel */}

            {/* Calendar */}
            <div className="py-16 w-1/2 max-xl:w-full max-xl:max-w-[600px] mx-auto">
              <CalendarBook />
            </div>
            {/* Calendar */}
          </div>
          <div className="w-[95%] mx-auto my-10  border-[4px] rounded-xl border-SAPBlue-300 shadow-2xl shadow-black py-7 px-10 ">
            <h1 className="text-3xl">Details:</h1>

            <hr className="my-4" />
            <h1 className="text-2xl ">
              Address: {data.location.desc1} {data.location.desc2}
            </h1>
            <iframe
              src={data.location.iframe}
              width="600"
              height="450"
              className="mt-4"
            ></iframe>
            <hr className="my-4" />

            <h1 className="text-2xl ">Our party areas:</h1>

            <h1 className="text-2xl mt-4">Capacity: {data.capacity} seats</h1>
            <h1 className="text-2xl mt-4">Seating: {data.seating} seats</h1>

            <hr className="my-4" />

            <h1 className="text-2xl ">Additional Features:</h1>
            {data.additionalFeatures?.map((feature) => {
              return (
                <h1 className="text-2xl mt-4 font-extralight">
                  <span className="font-medium text-SAPBlue-800">
                    {feature.heading}
                  </span>{" "}
                  {feature.desc}{" "}
                </h1>
              );
            })}
            <hr className="my-5" />

            <button className="border border-SAPBlue-800 hover:border-SAPBlue-900 rounded py-4 px-8 bg-transparent font-bold text-SAPBlue-800 hover:text-SAPBlue-900 transition duration-500">
              Place Request
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h1>NO SUCH HALL EXISTS</h1>
        </div>
      )}
    </>
  );
}

export default Hall;
