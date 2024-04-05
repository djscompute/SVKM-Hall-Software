import dayjs from "dayjs";
import {
  EachHallSessionType,
  HallBookingType,
  bookingStatusType,
} from "../../../../../types/global";
import { convert_IST_TimeString_To12HourFormat } from "../../utils/convert_IST_TimeString_To12HourFormat";

import isBetween from "dayjs/plugin/isBetween"; // Import the timezone plugin

dayjs.extend(isBetween);

type Props = {
  i: number;
  hallId: string;
  currentDate: Date;
  HallSessionsArray: EachHallSessionType[];
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
        return "bg-blue-200 hover:bg-blue-300";
      case "CONFIRMED":
        return "bg-red-200 hover:bg-red-300";
      case "TENTATIVE":
        return "bg-orange-200 hover:bg-orange-300";
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

  // create object with grouped slots of each session array
  const groupedBySessionId = allBookingData.reduce((acc: any, obj: any) => {
    if (!acc[obj.session_id]) {
      acc[obj.session_id] = { sessionId: obj.session_id, subarray: [] };
    }
    acc[obj.session_id].subarray.push(obj);
    return acc;
  }, {});

  // const finalArr: any[] = [];
  const finalArr: { sessionId: string; subarray: HallBookingType[] }[] =
    Object.values(groupedBySessionId) || [];
  console.log(i, finalArr);

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
      {finalArr.length > 0 ? (
        <>
          <div className="hidden lg:flex flex-col items-center justify-start gap-1 w-full  ">
            {finalArr.map((eachSessionGroup) => (
              <div className="flex flex-col w-full border border-black">
                <span className="overflow-x-auto font-medium pt-2 px-1 text-center bg-gray-300">
                  {
                    HallSessionsArray.find(
                      (obj) => obj._id === eachSessionGroup.sessionId
                    )?.name
                  }
                </span>
                {eachSessionGroup.subarray.map((eachBookingInfo) => (
                  <a
                    href={`/booking/${eachBookingInfo._id}`}
                    className={`flex flex-col justify-between items-center w-full ${getSlotColour(
                      eachBookingInfo.status
                    )} px-2 overflow-x-auto cursor-pointer`}
                  >
                    <span className="text-center w-full border-b border-gray-500 truncate">
                      {eachBookingInfo.user.username} - {eachBookingInfo.user.mobile}
                    </span>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </>
      ) : (
        <span className="my-auto mx-auto">---</span>
      )}
    </div>
  );
}

export default EachDay;
