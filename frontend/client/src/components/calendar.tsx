"use client";
import React, { useEffect, useMemo, useState } from "react";

interface TimeSlotsDropdownProps {
  selectedDate: Date;
  onClose: () => void;
  timeSlots: string[];
}

//dropdwon menu
const TimeSlotsDropdown: React.FC<TimeSlotsDropdownProps> = ({
  selectedDate,
  onClose,
  timeSlots,
}) => {
  return (
    <div className="absolute w-[40vh] top-10 right-0 p-2 border border-gray-300 rounded-lg shadow-md bg-white z-10">
      <div className="font-bold mb-2">
        Available Time Slots for {selectedDate.toLocaleDateString()}
      </div>
      {timeSlots.map((slot) => (
        <div key={slot} className="p-2">
          {selectedDate.toLocaleDateString()} - {slot}
        </div>
      ))}
      <button
        onClick={onClose}
        className="mt-2 bg-emerald-600 text-white p-2 rounded-md"
      >
        Close
      </button>
    </div>
  );
};

//calendar
const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

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


  // useEffect(() => {
  //   console.log(currentDate);
  // }, [currentDate]);
  

  
  const fetchTimeSlots = (selectedDate: Date): string[] => {
    //example usage
    return ["10:00 AM-12:00 PM", "2:00 PM-4:00 PM", "5:30 PM-7:30 PM"];
  };



  //for each date icon
  const onDateIconClick = (e: React.MouseEvent<HTMLDivElement>, clickedDate: Date) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({ top: rect.bottom, left: rect.left });
    setShowTimeSlots(!showTimeSlots);
    setCurrentDate(new Date(clickedDate));
  };


  
  //close button
  const onCloseTimeSlots = () => {
    setShowTimeSlots(false);
  };



  

  return (
    <div className=" flex justify-center items-center">
    <div className="flex flex-col justify-center w-[100vh] h-full bg-white border-[1px] border-border-color rounded-lg shadow-custom p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm cursor-pointer">
            {currentDate.toLocaleDateString("default", {
              month: "short",
              year: "numeric",
            })}
          </span>
          <div className="h-1 w-1 rounded-full bg-gray-400" />
          <span className=" text-sm text-gray-400">2,234 w</span>
        </div>
        <div className="flex justify-between gap-4">
          <svg
            className=" cursor-pointer"
            onClick={onPreviousMonth}
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.125 13.25L0.875 7L7.125 0.75"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            className=" cursor-pointer rotate-180"
            onClick={onNextMonth}
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.125 13.25L0.875 7L7.125 0.75"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      {showTimeSlots && (
        <div  className="absolute p-2 border border-gray-300 rounded-lg shadow-md bg-white z-10"
        style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>

        
        <TimeSlotsDropdown
          selectedDate={currentDate}
          onClose={onCloseTimeSlots}
          timeSlots={fetchTimeSlots(currentDate)}
        />
        </div>
      )}
       {/* leading spare days */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div
            key={`empty-${i}`}
            className="h-1 w-1 m-auto bg-gray-200 rounded-full"
          ></div>
        ))}
        
        {/* percentage indicator */}
        {Array.from({ length: daysInMonth }, (_, i) => {
         const percentage = useMemo(() => Math.floor(Math.random() * 101), []);
         const degree = percentage * 3.6;
          if (percentage > 90) {
            return (
              <div
                onClick={(e) => onDateIconClick(e, new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1))}
                key={`day-${i + 1}`}
                className="h-8 w-8 flex justify-center items-center bg-emerald-600 rounded-full relative cursor-pointer"
              >
                <div className="absolute text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  {i + 1}
                </div>
              </div>
            );
          } else if (percentage < 10) {
            return (
              <div
                onClick={(e) => onDateIconClick(e, new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1))}
                key={`day-${i + 1}`}
                className="h-8 w-8 flex justify-center items-center rounded-full relative cursor-pointer"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  {i + 1}
                </div>
              </div>
            );
          } else
            return (
              <div
                onClick={(e) => onDateIconClick(e, new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1))}
                key={`day-${i + 1}`}
                className="h-8 w-8 flex justify-center items-center rounded-full relative cursor-pointer"
                style={{
                  background: `conic-gradient(
                    #059669 ${degree}deg, 
                    #e5e7eb ${degree}deg 360deg)`,
                }}
              >
                <div className=" h-[27px] w-[27px] rounded-full bg-white"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  {i + 1}
                </div>
              </div>
            );
        })}
        {/* trailing spare days */}
        {Array.from({ length: trailingDays }, (_, i) => (
          <div
            key={`empty-trail-${i}`}
            className="h-1 w-1 m-auto bg-gray-200 rounded-full"
          ></div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Calendar;