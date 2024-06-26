import dayjs from "dayjs";
import { HallBookingType } from "../../../../../types/global";
import { bookingStatusType } from "../../types/Hall.types";
import isBetween from "dayjs/plugin/isBetween"; // Import the timezone plugin
import { convert_IST_DateTimeString_To12HourFormat } from "../../utils/convert_IST_TimeString_To12HourFormat";
import { getSlotAbbreviation } from "../../utils/getSlotAbb";

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
function EachMobileDay({
  i,
  hallId,
  currentDate,
  HallSessionsArray,
  allBookingData,
  selectedMobileDate,
  setSelectedMobileDate,
}: Props) {
  const myDayJSObject = dayjs(currentDate).add(i - 1, "day");

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

  // PRIORITY to show the booked sesison in frontend. if more that one booking with different status exists.
  //const priority = { CONFIRMED: 1, TENTATIVE: 2, ENQUIRY: 3 };
  const priority = { CONFIRMED: 1,ENQUIRY: 2 };

  // sort sessions in priority of status
  allBookingData.sort(
    (a: HallBookingType, b: HallBookingType) =>
      // @ts-ignore
      priority[a.status] - priority[b.status]
  );

  // only keep one booking of a hall session
  const uniqueSessions = [];
  const sessionIds = new Set();
  allBookingData.forEach((session) => {
    if (!sessionIds.has(session.session_id)) {
      uniqueSessions.push(session);
      sessionIds.add(session.session_id);
    }
  });

  // merge bookings and sessions.
  // give priority to booking over session to show in frontend
  const finalArr: any[] = [];
  completeDateSessions.forEach((eachHallSession) => {
    const A_Booking_for_This_Session = allBookingData.find(
      (a) => eachHallSession._id == a.session_id
    );
    if (A_Booking_for_This_Session) {
      finalArr.push(A_Booking_for_This_Session);
    } else {
      finalArr.push(eachHallSession);
    }
  });

  const getSlotColour = (status: bookingStatusType) => {
    switch (status) {
      case "ENQUIRY":
        return "bg-blue-200";
      case "CONFIRMED":
        return "bg-red-200";
      /*
      case "TENTATIVE":
        return "bg-orange-200";
      */
      default:
        return "bg-white";
    }
  };
  return (
    <div
      key={`day-${i}`}
      className={`flex flex-col items-center w-full bg-gray-200  rounded-md py-2`}
    >
      <span className="w-full my-1 text-center text-sm md:text-lg border-b border-gray-300">
        {i}
      </span>
      {/* SLOT INFO */}
      {finalArr && (
        <>
          <div className="flex flex-col items-center justify-start gap-1 w-full  ">
            {finalArr.map((eachSlotInfo, index) => (
              <div
                key={index}
                className={`flex justify-between w-full 
              ${getSlotColour(eachSlotInfo.status)}
              ${eachSlotInfo.status == "EMPTY" && " border-2 border-black"}
              px-2 overflow-x-auto
              `}
              >
                {eachSlotInfo.session_id
                  ? // if booking is found then find the session using session_id and display its name
                    HallSessionsArray?.find(
                      (a) => a._id == eachSlotInfo.session_id
                    )?.name
                  : // no booking is found for this sesison means that this is the session itself. display its name
                    eachSlotInfo.name}
                {eachSlotInfo.initial !== "O" && (
                  <span>{getSlotAbbreviation(eachSlotInfo.status)}</span>
                )}
              </div>
            ))}
          </div>
          <a
            className="bg-blue-700 hover:bg-blue-800 active:bg-blue-300 text-white text-center text-xs p-1 mt-1 rounded-md"
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

export default EachMobileDay;
