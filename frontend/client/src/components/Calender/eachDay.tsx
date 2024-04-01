import dayjs from "dayjs";
import { HallBookingType } from "../../../../../types/global";
import { bookingStatusType } from "../../types/Hall.types";
import {
  convert_IST_DateTimeString_To12HourFormat,
  convert_IST_TimeString_To12HourFormat,
} from "../../utils/convert_IST_TimeString_To12HourFormat";

import isBetween from "dayjs/plugin/isBetween"; // Import the timezone plugin

dayjs.extend(isBetween);

type Props = {
  i: number;
  hallId: string;
  currentDate: Date;
  HallSessionsArray: any[];
  allBookingData: HallBookingType[];
  selectedMobileDate: number;
  setSelectedMobileDate: React.Dispatch<React.SetStateAction<number>>;
};

// @ts-ignore
function EachDay({
  i,
  hallId,
  currentDate,
  HallSessionsArray,
  allBookingData,
  selectedMobileDate,
  setSelectedMobileDate,
}: Props) {
  const myDayJSObject = dayjs(currentDate).add(i - 1, "day");
  const getSlotColour = (status: bookingStatusType) => {
    switch (status) {
      case "ENQUIRY":
        return "bg-blue-200";
      case "CONFIRMED":
        return "bg-red-200";
      case "TENTATIVE":
        return "bg-orange-200";
      default:
        return "bg-white";
    }
  };

  // sort sessions in acsending order
  HallSessionsArray.sort((a, b) => {
    let fromA = a.from.toLowerCase();
    let fromB = b.from.toLowerCase();
    if (fromA < fromB) return -1;
    if (fromA > fromB) return 1;
    return 0;
  });

  // filter only the bookings of this current Day
  allBookingData = allBookingData?.filter((obj) =>
    dayjs(obj.from).isSame(myDayJSObject, "day")
  );

  // convert "08:00:00" to "${aaj-ka-din}T"08:00:00""
  const completeDateSessions = HallSessionsArray.map((element) => {
    return {
      ...element,
      from: `${myDayJSObject.format("YYYY-MM-DD")}T${element.from}`,
      to: `${myDayJSObject.format("YYYY-MM-DD")}T${element.to}`,
    };
  });

  function areTimeIntervalsOverlapping(interval1: any, interval2: any) {
    const from1 = dayjs(interval1.from);
    const to1 = dayjs(interval1.to);
    const from2 = dayjs(interval2.from);
    const to2 = dayjs(interval2.to);

    return from1.isBefore(to2) && to1.isAfter(from2);
  }

  const finalArr: any[] = [];
  completeDateSessions.forEach((eachSession) => {
    let clashing: boolean = false;
    allBookingData?.forEach((eachBooking) => {
      if (
        areTimeIntervalsOverlapping(eachSession, eachBooking) &&
        !finalArr.includes(eachBooking)
      ) {
        finalArr.push(eachBooking);
        clashing = true;
      }
    });
    if (!clashing && !finalArr.includes(eachSession)) {
      finalArr.push(eachSession);
    }
  });

  return (
    <div
      key={`day-${i}`}
      onClick={() => {
        if (window.innerWidth < 1024) {
          setSelectedMobileDate(i);
        }
      }}
      className={`flex flex-col items-center w-full bg-gray-200 ${
        selectedMobileDate == i && " bg-gray-400 lg:bg-gray-200"
      } cursor-pointer lg:cursor-auto rounded-md py-1`}
    >
      <span className="w-full my-1 text-center text-sm md:text-lg lg:border-b border-gray-300">
        {i}
      </span>
      {/* SLOT INFO */}
      {finalArr && (
        <>
          <div className="hidden lg:flex flex-col items-center justify-start gap-1 w-full  ">
            {finalArr.map((eachSlotInfo) => (
              <div
                className={`flex justify-between w-full 
              ${getSlotColour(eachSlotInfo.status)}
              ${eachSlotInfo.status == "EMPTY" && " border-2 border-black"}
              px-2 overflow-x-auto
              `}
              >
                <span>
                  {convert_IST_DateTimeString_To12HourFormat(eachSlotInfo.from)}
                  -{convert_IST_DateTimeString_To12HourFormat(eachSlotInfo.to)}
                </span>
                {eachSlotInfo.initial !== "O" && (
                  <span>{eachSlotInfo.initial}</span>
                )}
              </div>
            ))}
          </div>
          <a
            className="hidden lg:block bg-blue-700 hover:bg-blue-800 active:bg-blue-300 text-white text-center text-xs p-1 mt-1 rounded-md"
            href={`${hallId}/${dayjs(currentDate)
              .add(i - 1, "day")
              .format("YYYY-MM-DD")}`}
            target="_blank"
          >
            ENQUIRE
          </a>
        </>
      )}
    </div>
  );
}

export default EachDay;
