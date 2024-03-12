import React, { useState } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
// import CalendarBook from "../components/homePage/CalendarBook.tsx";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axiosInstance.ts";
import { EachHallType } from "../types/Hall.types.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { convert_IST_TimeString_To12HourFormat } from "../utils/convert_IST_TimeString_To12HourFormat.tsx";
import { Carousel } from "@material-tailwind/react";
import Calendar from "../components/Calender/calendar.tsx";
function Hall() {
  const { id } = useParams<{ id: string }>();

  const { data, error, isFetching, status } = useQuery({
    queryKey: ["allhalls"],
    queryFn: async () => {
      const response = await axiosInstance.get(`getHall/${id}`);
      return response.data as EachHallType;
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const toggleReadMore = () => setIsOpen(!isOpen);

  // const [currentIndex, setCurrentIndex] = useState(0);

  if (isFetching) {
    return <div>Fetching Info</div>;
  }

  return (
    <>
      {data ? (
        <div className="flex w-full flex-col">
          <h1 className="text-center text-5xl font-light mt-10">{data.name}</h1>
          {/* Carousel */}
          <div className="w-3/4 mx-auto items-center">
            <Carousel
              placeholder={"Hall Image Carousel"}
              transition={{ duration: 1 }}
              className="rounded-xl my-6"
            >
              {data.images.map((eachImageSrc) => (
                <img
                  src={eachImageSrc}
                  className="h-[80vh] w-full object-cover"
                />
              ))}
            </Carousel>
          </div>
          {/* Calender */}
          <div className="w-full">
            <h1 className=" text-3xl text-center my-2">Bookings</h1>
            <Calendar />
          </div>
          {/* Hall Location */}
          <div className="w-[95%] mx-auto my-5  border-[4px] bg-blue-100 rounded-xl border-SAPBlue-300 shadow-2xl py-7 px-10 ">
            <h1 className="text-3xl">Details:</h1>
            <hr className="my-4" />
            <h1 className="text-2xl ">
              <h2 className="font-bold text-xl mb-3">Location</h2>
              <div className=" text-lg">
                <div className=" my-2">{data.location.desc1}</div>
                <div>{data.location.desc2}</div>
              </div>
            </h1>
            <a
              href={data.location.gmapurl}
              className="flex items-center bg-blue-300 w-[10%] my-2 p-1 rounded-md border-2 border-blue-400"
              target="_blank"
            >
              <FontAwesomeIcon className="text-red-600" icon={faLocationDot} />
              <span className="ml-1 ">View on map</span>
            </a>
            <iframe
              src={data.location.iframe}
              width="600"
              height="450"
              className="mt-4"
            ></iframe>
            <hr className="my-4" />
          </div>

          {/* About Hall */}
          <div className="w-[95%] mx-auto my-5  border-[4px] bg-blue-100 rounded-xl border-SAPBlue-300 shadow-2xl py-7 px-10 ">
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
          <div className="w-[95%] mx-auto my-5 border-[4px] bg-blue-100 rounded-xl border-SAPBlue-300 shadow-2xl py-7 px-10 ">
            <h2 className="font-bold text-xl mb-3">Capacity and Seating</h2>
            <div className="flex ">
              <p>Capacity : </p>
              <p>{data.capacity}</p>
            </div>
            <div className="flex ">
              <p>Seating : </p>
              <p>{data.seating}</p>
            </div>
          </div>

          <div className="w-[95%] mx-auto my-5 border-[4px] bg-blue-100 rounded-xl border-SAPBlue-300 shadow-2xl py-7 px-10 ">
            <h2 className="font-bold text-xl mb-3">Additional Features</h2>
            <div className="about-hall text-lg">
              {data.additionalFeatures?.map((feature, index) => (
                <div key={index} className="flex flex-col mb-3">
                  <p className="font-medium text-lg">{feature.heading}</p>
                  <p>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-[95%] mx-auto my-5 border-[4px] bg-blue-100 rounded-xl border-SAPBlue-300 shadow-2xl py-7 px-10 ">
            <div className="about-hall text-lg">
              {data.sessions.map((eachSession, index) => (
                <div key={index} className="flex flex-col mb-3">
                  <p className="font-medium text-lg">{eachSession.name}</p>
                  <div className="flex justify-between">
                    <div className="flex gap-2 bg-white px-2 rounded-md">
                      <span>From:</span>
                      <span className="">
                        {eachSession.from
                          ? convert_IST_TimeString_To12HourFormat(eachSession.from)
                          : "NAN"}
                      </span>
                    </div>
                    <div className="flex gap-2 bg-white px-2 rounded-md">
                      <span>To:</span>
                      <span className="">
                        {convert_IST_TimeString_To12HourFormat(eachSession.to)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-[95%] mx-auto my-5 border-[4px] bg-blue-100 rounded-xl border-SAPBlue-300 shadow-2xl py-7 px-10 ">
            <div className="flex flex-col w-full">
              <h2 className="font-bold text-xl mb-3">Pricing</h2>
              {data.pricing ? (
                <p className="text-lg">{data.pricing}</p>
              ) : (
                <p>No pricing set for this hall. Edit to set the Price</p>
              )}
            </div>
          </div>
          <button className="border border-SAPBlue-800 hover:border-SAPBlue-900 rounded py-4 px-8 bg-transparent font-bold text-SAPBlue-800 hover:text-SAPBlue-900 transition duration-500">
            Place Request
          </button>
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
