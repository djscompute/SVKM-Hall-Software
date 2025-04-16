import dayjs from "dayjs";
import {
  EachHallSessionType,
  EachHallType,
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
  HallSessionsArray: EachHallType;
  allBookingData: HallBookingType[];
  selectedMobileDate: number;
  setSelectedMobileDate: React.Dispatch<React.SetStateAction<number>>;
};
interface OpenEnquireTabEvent extends React.MouseEvent<HTMLDivElement> {
  currentTarget: HTMLDivElement & {
    dataset: {
      hallId: string;
      date: string;
    };
  };
}

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
      /*
      case "TENTATIVE":
        return "bg-orange-200 hover:bg-orange-300";
      */
      default:
        return "bg-white";
    }
  };

  // sort sessions in acsending order
  // HallSessionsArray.sort((a, b) => {
  //   let fromA = a.from.toLowerCase();
  //   let fromB = b.from.toLowerCase();
  //   if (fromA < fromB) return -1;
  //   if (fromA > fromB) return 1;
  //   return 0;
  // });

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

  function openEnquireTab(event: OpenEnquireTabEvent) {
    const hallId = event.currentTarget.dataset.hallId;
    const dateAttribute = event.currentTarget.dataset.date;
    const url = `${hallId}/${dateAttribute}`;
    window.open(url, "_blank");
  }

  function appendEmptySessions() {
    // Create a new array to store the result
    const appendedArray = JSON.parse(JSON.stringify(finalArr));

    // Create a Set of existing sessionIds for quick lookup
    const existingSessionIds = new Set(
      appendedArray.map((item: { sessionId: any }) => item.sessionId)
    );

    // Iterate through HallSessionsArray
    HallSessionsArray.sessions.forEach((session) => {
      // Check if the session is active and its ID doesn't exist in finalArr
      if (session.active && !existingSessionIds.has(session._id)) {
        // Add a new entry with empty subarray
        appendedArray.push({
          sessionId: session._id,
          subarray: [],
        });
      }
    });
    return appendedArray;
  }

  function hasAllSessionsConfirmed() {
    const appendedArray: { sessionId: string; subarray: HallBookingType[] }[] =
      appendEmptySessions();
    return appendedArray.every((session) =>
      session.subarray.some((booking) => booking.status === "CONFIRMED")
    );
  }
  HallSessionsArray.sessions.sort((a,b)=>{
    const getNumber = (name:String) => {
      if (!name) {
        return Infinity; // Or another value to handle undefined or null names
      }
      // Extract numeric prefix before the dot, or return Infinity if no numeric prefix
      const match = name.match(/^(\d+)/);
      return match ? parseInt(match[1], 10) : Infinity;
  }
  return getNumber(a.name) - getNumber(b.name);
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
      {/* {finalArr.length > 0 ? (
        <>
          <div className="hidden lg:flex flex-col items-center justify-start gap-1 w-full">
            {finalArr.map((eachSessionGroup) => (
              <div className="flex flex-col w-full gap-1">
                <span className="overflow-x-auto font-medium pt-2 px-1 text-center bg-gray-300">
                  {
                    HallSessionsArray.find(
                      (obj) => obj._id === eachSessionGroup.sessionId
                    )?.name
                  }
                </span>
                {HallSessionsArray.map((session) =>
                  session.active ? (
                    <span
                      className="overflow-x-auto font-medium pt-2 px-1 text-center bg-gray-300"
                    >
                      {session.name}
                    </span>
                  ) : null
                )}
                {eachSessionGroup.subarray.map((eachBookingInfo) => (
                  <a
                    href={`/booking/${eachBookingInfo._id}`}
                    className={`flex flex-col justify-between items-center w-full ${getSlotColour(
                      eachBookingInfo.status
                    )} px-2 overflow-x-auto cursor-pointer`}
                  >
                    <span className="text-center w-full border-b border-gray-500 truncate">
                      {eachBookingInfo.user.username} -{" "}
                      {eachBookingInfo.user.mobile}
                    </span>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </>
      ) : (
        <span className="my-auto mx-auto">---</span>
      )} */}

      {HallSessionsArray.sessions.map((session) =>
        session.active ? (
          <>
            <span className="overflow-x-auto font-medium pt-2 px-1 text-center bg-gray-300 w-[inherit]">
              {session.name}
            </span>
            {finalArr.map((eachSessionGroup) => (
              <div className="w-[inherit]" key={eachSessionGroup.sessionId}>
                {eachSessionGroup.subarray
                  .filter(
                    (eachBookingInfo) =>
                      session._id === eachSessionGroup.sessionId
                  )
                  .map((eachBookingInfo) => (
                    <a
                      key={eachBookingInfo._id}
                      href={`/booking/${eachBookingInfo._id}`}
                      className={`flex flex-col justify-between items-center w-full ${getSlotColour(
                        eachBookingInfo.status
                      )} px-2 overflow-x-auto cursor-pointer`}
                    >
                      <span className="text-center w-full border-b border-gray-500 truncate ">
                        {eachBookingInfo.user.username} -{" "}
                        {eachBookingInfo.user.mobile}
                      </span>
                    </a>
                  ))}
              </div>
            ))}
          </>
        ) : null
      )}

      {!hasAllSessionsConfirmed() && (
        <div
          className="hidden lg:block bg-blue-700 hover:bg-blue-800 active:bg-blue-300 text-white text-center text-xs p-1 my-2 mx-auto w-fit rounded-md cursor-pointer"
          onClick={openEnquireTab}
          data-hall-id={hallId}
          data-date={dayjs(currentDate)
            .add(i - 1, "day")
            .format("YYYY-MM-DD")}
        >
          New Booking
        </div>
      )}
    </div>
  );
}

export default EachDay;
