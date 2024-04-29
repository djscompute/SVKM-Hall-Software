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
        <div>
          {data ? (
            <div className="flex w-full flex-col items-center gap-5 sm:gap-10 px-3 sm:px-10 md:px-16 lg:px-28">
              <h1 className="text-center text-5xl mt-10">{data.name}</h1>
              {/* <Calendar hallId={id as string} HallData={data} /> */}
              <ImageCarousel data={data} />
              <hr className=" bg-gray-300 h-[1.5px] w-full" />
              <HallLocation data={data} />

              {/* About Hall */}
              <div className="w-[95%] mx-auto my-5  border-[4px] bg-blue-100 rounded-xl border-sapblue-300 shadow-2xl py-7 px-10 ">
                <h2 className=" font-bold text-xl mb-3">About this venue</h2>
                <div
                  className={`flex flex-col text-lg ${
                    isOpen ? "" : " h-24 overflow-hidden"
                  }`}
                >
                  {data.about}
                </div>
                {!isOpen ? (
                  <button
                    onClick={toggleReadMore}
                    className="read-more-btn text-gray-700 font-semibold text-lg"
                  >
                    Read More
                  </button>
                ) : (
                  <button
                    onClick={toggleReadMore}
                    className="read-less-btn text-gray-700 font-semibold text-lg"
                  >
                    Read Less
                  </button>
                )}
              </div>

              {/* Seating and capacity */}
              <div className="w-[95%] mx-auto my-5 border-[4px] bg-blue-100 rounded-xl border-sapblue-300 shadow-2xl py-7 px-10 ">
                <h2 className="font-bold text-xl mb-3">Capacity</h2>
                <div className="flex ">
                  <p>Capacity : </p>
                  <p>{data.capacity}</p>
                </div>
              </div>

              <div className="w-[95%] mx-auto my-5 border-[4px] bg-blue-100 rounded-xl border-sapblue-300 shadow-2xl py-7 px-10 ">
                <h2 className="font-bold text-xl mb-3">
                  Security Deposit ( if applicable )
                </h2>
                <div className="flex ">
                  <p>Security Deposit Amount : </p>
                  <p> Rs. {data.securityDeposit}</p>
                </div>
              </div>

              <div className="w-[95%] mx-auto my-5 border-[4px] bg-blue-100 rounded-xl border-sapblue-300 shadow-2xl py-7 px-10 ">
                <h2 className="font-bold text-xl mb-3">Event Restrictions</h2>
                <p>
                  The following types of events are not allowed to be booked at
                  this hall.
                </p>
                <div className="flex ">
                  {data.eventRestrictions ? (
                    data.eventRestrictions
                  ) : (
                    <p>No restrictions</p>
                  )}
                </div>
              </div>

              <div className="w-[95%] mx-auto my-5 border-[4px] bg-blue-100 rounded-xl border-sapblue-300 shadow-2xl py-7 px-10 ">
                <h2 className="font-bold text-xl mb-3">Additional Features</h2>
                <div className="about-hall text-lg">
                  {data.additionalFeatures?.map((feature, index) => (
                    <div key={index} className="flex flex-col mb-3">
                      <p className="font-medium text-lg">{feature.heading}</p>
                      <p>{feature.desc}</p>
                      <p>Rs. {feature.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-[95%] mx-auto my-5 border-[4px] bg-blue-100 rounded-xl border-sapblue-300 shadow-2xl py-7 px-10 ">
                {data.sessions.map((eachSession, index) => (
                  <div key={index} className="flex flex-col mb-3">
                    <p className="font-medium text-lg">{eachSession.name}</p>
                    <div className="flex justify-between">
                      <div className="flex gap-2 bg-white px-2 rounded-md">
                        <span>From:</span>
                        <span className="">
                          {eachSession.from
                            ? convert_IST_TimeString_To12HourFormat(
                                eachSession.from
                              )
                            : "NAN"}
                        </span>
                      </div>
                      <div className="flex gap-2 bg-white px-2 rounded-md">
                        <span>To:</span>
                        <span className="">
                          {convert_IST_TimeString_To12HourFormat(
                            eachSession.to
                          )}
                        </span>
                      </div>
                    </div>
                    <div className=" mt-2 mb-3">
                      {eachSession.price.map((eachSessionPrice, index) => (
                        <div className="flex justify-evenly w-full" key={index}>
                          <span className="border border-gray-600 border-r-0  w-full text-center">
                            {eachSessionPrice.categoryName}
                          </span>
                          <span className="border border-gray-600 w-full text-center">
                            {eachSessionPrice.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
