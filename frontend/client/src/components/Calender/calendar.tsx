"use client";
import { useEffect, useState } from "react";
import { EachHallType, bookingStatusType } from "../../types/Hall.types";
import EachDay from "./eachDay";
import EachMobileDay from "./eachMobileDay";
import axiosClientInstance from "../../config/axiosClientInstance";
import { useQuery } from "@tanstack/react-query";
import Legends from "./legends";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

// CHANGE 1: Define start and end years as constants
const START_YEAR = 2024;
const END_YEAR = 2050;

type Props = {
  hallId: string;
  HallData: EachHallType;
};

const Calendar = ({ hallId, HallData }: Props) => {
  dayjs.extend(utc);
  console.log("session",HallData);

  const [currentDate, setCurrentDate] = useState(() => {
    const now = dayjs();
    return now.year() < START_YEAR ? dayjs(`${START_YEAR}-01-01`) : now;
  });

  const [selectedMobileDate, setSelectedMobileDate] = useState<number>(
    currentDate.date()
  );

  const startDate = currentDate
    .startOf("month")
    .format("YYYY-MM-DD[T]00:00:00");
  const endDate = currentDate
    .endOf("month")
    .format("YYYY-MM-DD[T]23:59:59");

  const {
    data: allBookingData,
    error,
    isFetching,
  } = useQuery({
    queryKey: [`bookings-${startDate}-${endDate}`],
    queryFn: async () => {
      const response = await axiosClientInstance.get("getBooking", {
        params: {
          from: startDate,
          to: endDate,
          hallId: hallId,
        },
      });
      console.log("res",response.data);
      if (response.data.message == "No bookings found for the specified range.")
        return [];
      response.data.sort((a: any, b: any) => dayjs(a.from).diff(dayjs(b.from)));
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
  });

  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = currentDate.startOf("month").day();

  // CHANGE 2: Update next month function to check against END_YEAR
  const onNextMonth = () => {
    const nextMonth = currentDate.add(1, 'month');
    if (nextMonth.year() > END_YEAR) return;
    setCurrentDate(nextMonth);
  };

  const onPreviousMonth = () => {
    const previousMonth = currentDate.subtract(1, 'month');
    if (previousMonth.year() < START_YEAR) return;
    setCurrentDate(previousMonth);
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
    <div className="flex justify-center items-center">
      <div className="flex flex-col justify-center w-full md:mx-10 h-full border-[3px] border-border-color rounded-lg shadow-custom p-4">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* CHANGE 3: Update DatePicker to use END_YEAR */}
          <DatePicker
            value={currentDate}
            onChange={(newState): any => {
              if (newState) {
                setCurrentDate(newState);
              }
            }}
            views={["year", "month"]}
            minDate={dayjs(`${START_YEAR}-01-01`)}
            maxDate={dayjs(`${END_YEAR}-12-31`)}
          />
        </LocalizationProvider>
        <div className="flex justify-between items-center my-4 w-3/4 mx-auto">
          <svg
            className={`cursor-pointer ${
              currentDate.year() === START_YEAR && currentDate.month() === 0
                ? 'opacity-50 cursor-not-allowed'
                : ''
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
            {currentDate.format("MMM YYYY")}
          </span>
          {/* CHANGE 4: Update next month button to check against END_YEAR */}
          <svg
            className={`cursor-pointer rotate-180 ${
              currentDate.year() === END_YEAR && currentDate.month() === 11
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
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

        <div className="grid grid-cols-7 gap-[2px]">
          {weekDays.map((eachWeekDay, index) => (
            <div
              key={`days-${index}`}
              className="w-full m-auto text-center text-sm md:text-lg bg-gray-100"
            >
              {eachWeekDay}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div
              key={`empty-${i}`}
              className="flex flex-col items-center h-full w-full bg-gray-100 rounded-md"
            ></div>
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => (
            <EachDay
              key={`day-${i}`}
              i={i + 1}
              hallId={hallId}
              currentDate={currentDate.toDate()}
              HallSessionsArray={HallData}
              selectedMobileDate={selectedMobileDate}
              setSelectedMobileDate={setSelectedMobileDate}
              allBookingData={allBookingData}
            />
          ))}
          {Array.from({ length: trailingDays }, (_, i) => (
            <div
              key={`empty-trail-${i}`}
              className="flex flex-col items-center h-full w-full bg-gray-100 rounded-md"
            ></div>
          ))}
        </div>

        <div className="block lg:hidden mt-10">
          <EachMobileDay
            i={selectedMobileDate}
            hallId={hallId}
            currentDate={currentDate.toDate()}
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