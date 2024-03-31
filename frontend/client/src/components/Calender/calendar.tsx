"use client";
import { useState } from "react";
import { EachHallType, bookingStatusType } from "../../types/Hall.types";
import EachDay from "./eachDay";
import EachMobileDay from "./eachMobileDay";
import dayjs from "dayjs";
import axiosInstance from "../../config/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

type dummyDataType = {
  from: string;
  to: string;
  status: bookingStatusType;
  initial: string;
};

const dummySlotData: dummyDataType[] = [
  {
    from: "8:00am",
    to: "12:00pm",
    status: "CONFIRMED",
    initial: "C",
  },
  {
    from: "1:00pm",
    to: "4:00pm",
    status: "ENQUIRY",
    initial: "E",
  },
  {
    from: "5:00pm",
    to: "8:00pm",
    status: "TENTATIVE",
    initial: "T",
  },
  {
    from: "9:00pm",
    to: "12:00am",
    status: "EMPTY",
    initial: "O",
  },
];

type Props = {
  hallId: string;
  HallData: EachHallType;
};

//calendar
const Calendar = ({ hallId, HallData }: Props) => {
  const [currentDate, setCurrentDate] = useState(
    dayjs().startOf("month").toDate()
  );
  const [selectedMobileDate, setSelectedMobileDate] = useState<number>(1);

  const startDate = dayjs(currentDate)
    .startOf("month")
    .format("YYYY-MM-DD[T]00:00:00");
  const endDate = dayjs(currentDate)
    .endOf("month")
    .format("YYYY-MM-DD[T]23:59:59");

  const {
    data: allBookingData,
    error,
    isFetching,
  } = useQuery({
    queryKey: [`bookings-${startDate}-${endDate}`],
    queryFn: async () => {
      const response = await axiosInstance.get("getBooking", {
        params: {
          from: startDate,
          to: endDate,
        },
      });
      console.log(response.data);
      if (response.data.message == "No bookings found for the specified range.") return []
      // sort based of from
      response.data.sort((a: any, b: any) => dayjs(a.from).diff(dayjs(b.from)));
      return response.data;
    },
  });

  console.log(allBookingData);

  const daysInMonth = dayjs(currentDate).daysInMonth();

  const firstDayOfMonth = dayjs(currentDate).startOf("month").day();

  const onNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const onPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const totalSlots = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
  const trailingDays = totalSlots - (firstDayOfMonth + daysInMonth);

  if (isFetching)
    return (
      <>
        <p>LOADING</p>
      </>
    );
  

  return (
    <div className=" flex justify-center items-center">
      <div className="flex flex-col justify-center w-full md:mx-10 h-full border-[3px] border-border-color rounded-lg shadow-custom p-4">
        {/* Top heading */}
        <div className="flex justify-between items-center mb-4 w-3/4 mx-auto">
          <svg
            className=" cursor-pointer"
            onClick={onPreviousMonth}
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7.125 13.25L0.875 7L7.125 0.75" stroke="black" />
          </svg>
          <span className="text-lg cursor-pointer">
            {currentDate.toLocaleDateString("default", {
              month: "short",
              year: "numeric",
            })}
          </span>
          <svg
            className=" cursor-pointer rotate-180"
            onClick={onNextMonth}
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7.125 13.25L0.875 7L7.125 0.75" stroke="black" />
          </svg>
        </div>

        {/* CALENDER GRId */}
        <div className="grid grid-cols-7 gap-[2px]">
          {/* Week Days */}
          {weekDays.map((eachWeekDay, index) => (
            <div
              key={`days-${index}`}
              className=" w-full m-auto text-center text-sm md:text-lg bg-gray-100"
            >
              {eachWeekDay}
            </div>
          ))}
          {/* leading spare days */}
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div
              key={`empty-${i}`}
              className="flex flex-col items-center h-full w-full bg-gray-100 rounded-md"
            ></div>
          ))}
          {/* Legit Dates */}
          {Array.from({ length: daysInMonth }, (_, i) => (
            <EachDay
              i={i + 1}
              currentDate={currentDate}
              HallSessionsArray={HallData.sessions}
              selectedMobileDate={selectedMobileDate}
              setSelectedMobileDate={setSelectedMobileDate}
              allBookingData={allBookingData}
            />
          ))}
          {/* trailing spare days */}
          {Array.from({ length: trailingDays }, (_, i) => (
            <div
              key={`empty-trail-${i}`}
              className="flex flex-col items-center h-full w-full bg-gray-100 rounded-md"
            ></div>
          ))}
        </div>

        {/* SLOT FOR EACH DAY ON MOBILE VERSION */}
        <div className=" block lg:hidden mt-10">
          <EachMobileDay dummySlotData={dummySlotData} i={selectedMobileDate} />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
