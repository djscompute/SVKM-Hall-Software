"use client";
import { useEffect, useState } from "react";
import { EachHallType } from "../../types/Hall.types";
import EachDay from "./eachDay";
import EachMobileDay from "./eachMobileDay";
import dayjs from "dayjs";
import axiosManagerInstance from "../../config/axiosClientInstance";
import { useQuery } from "@tanstack/react-query";
import Legends from "./legends";
import utc from "dayjs/plugin/utc";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

// CHANGE 1: Add constants for start and end years
const START_YEAR = new Date().getFullYear();
const END_YEAR = START_YEAR + 2;

type Props = {
  hallId: string;
  HallData: EachHallType;
};

//calendar
const Calendar = ({ hallId, HallData }: Props) => {
  dayjs.extend(utc);

  const [currentDate, setCurrentDate] = useState(() => {
    const now = dayjs();
    return now.year() < START_YEAR
      ? dayjs(`${START_YEAR}-01-01`).toDate()
      : now.startOf("month").toDate();
  });

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
      const response = await axiosManagerInstance.get("getBooking", {
        params: {
          from: startDate,
          to: endDate,
          hallId: hallId,
        },
      });
      console.log("data is here ", response.data);
      if (response.data.message == "No bookings found for the specified range.")
        return [];
      // sort based of from
      response.data.sort((a: any, b: any) => dayjs(a.from).diff(dayjs(b.from)));
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // Data is considered fresh for 1 minutes
  });

  console.log(allBookingData);

  const daysInMonth = dayjs(currentDate).daysInMonth();

  const firstDayOfMonth = dayjs(currentDate).startOf("month").day();

  const onNextMonth = () => {
    const nextMonth = dayjs(currentDate).add(1, "month");
    if (nextMonth.year() > END_YEAR) return;
    setCurrentDate(nextMonth.toDate());
  };

  const onPreviousMonth = () => {
    const previousMonth = dayjs(currentDate).subtract(1, "month");
    if (previousMonth.year() < START_YEAR) return;
    setCurrentDate(previousMonth.toDate());
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
        {/* Date  */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={dayjs(currentDate)}
            onChange={(newState): any => {
              if (newState) {
                setCurrentDate(newState.startOf("month").toDate());
              }
            }}
            views={["year", "month"]}
            minDate={dayjs(`${START_YEAR}-01-01`)}
            maxDate={dayjs(`${END_YEAR}-12-31`)}
          />
        </LocalizationProvider>
        {/* Top heading */}
        <div className="flex justify-between items-center mb-4 w-3/4 mx-auto">
          <svg
            className={`cursor-pointer ${
              dayjs(currentDate).year() === START_YEAR &&
              dayjs(currentDate).month() === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
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
        <Legends />
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
              hallId={hallId}
              currentDate={currentDate}
              HallSessionsArray={HallData}
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
          <EachMobileDay
            i={selectedMobileDate}
            hallId={hallId}
            currentDate={currentDate}
            HallSessionsArray={HallData}
            selectedMobileDate={selectedMobileDate}
            setSelectedMobileDate={setSelectedMobileDate}
            allBookingData={allBookingData}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
