import dayjs from "dayjs";
import { EachHallType, HallBookingType } from "../../../../../types/global";
import { bookingStatusType } from "../../types/Hall.types";
import isBetween from "dayjs/plugin/isBetween"; // Import the timezone plugin
import { convert_IST_DateTimeString_To12HourFormat } from "../../utils/convert_IST_TimeString_To12HourFormat";
import { getSlotAbbreviation } from "../../utils/getSlotAbb";
import { useEffect,useState } from "react";

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
  // convert "08:00:00" to "${aaj-ka-din}T"08:00:00""
  const completeDateSessions = HallSessionsArray.sessions.map((element) => {
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
  // allBookingData.sort(
  //   (a: HallBookingType, b: HallBookingType) =>
  //     // @ts-ignore
  //     priority[a.status] - priority[b.status]
  // );

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
  
    // Extract time from "from" and "to" fields
    const fromTime = new Date(eachHallSession.from);
    const toTime = new Date(eachHallSession.to);
    // console.log("time is ",fromTime,toTime);
    const fromHour = fromTime.getHours();
    const fromMinutes = fromTime.getMinutes();
    const toHour = toTime.getHours();
    const toMinutes = toTime.getMinutes();
    
  
    // Determine the session name based on time range
    let sessionName = "";
    if(HallSessionsArray.name=="MPSTME Small Seminar Hall" || 
      HallSessionsArray.name=="MPSTME Big Seminar Hall" || 
      HallSessionsArray.name=="Mukesh Patel Multipurpose Hall" ||
      HallSessionsArray.name=="Juhu Jagruti Seminar Hall"
    
    ){
      if (fromHour === 9 && fromMinutes === 0 && toHour === 14 && toMinutes === 0) {
        sessionName = "1.Morning";
      }
      // Evening session: 4 PM to 10:30 PM
      else if (fromHour === 16 && fromMinutes === 0 && toHour === 22 && toMinutes === 30) {
        sessionName = "2.Evening";
      }
      // Full day session: 9 AM to 10:30 PM
      else if (fromHour === 9 && fromMinutes === 0 && toHour === 22 && toMinutes === 30) {
        sessionName = "3.Full Day";
      }
      else {
        sessionName = "Unknown"; // Handle any unexpected cases
      }


    }
    else if(HallSessionsArray.name=="Mukesh R Patel Auditorium"){
        // Morning session: 10 AM to 1 PM
    if (fromHour === 10 && fromMinutes === 0 && toHour === 13 && toMinutes === 0) {
      sessionName = "1.Morning";
    }
    // Afternoon session: 3 PM to 6 PM
    else if (fromHour === 15 && fromMinutes === 0 && toHour === 18 && toMinutes === 0) {
      sessionName = "2.Afternoon";
    }
    // Evening session: 8:30 PM to 11:30 PM
    else if (fromHour === 20 && fromMinutes === 30 && toHour === 23 && toMinutes === 30) {
      sessionName = "3.Evening";
    }
    // Full day session: 10 AM to 10:30 PM
    else if (fromHour === 10 && fromMinutes === 0 && toHour === 22 && toMinutes === 30) {
      sessionName = "4.Full Day";
    }
    else {
      sessionName = "Unknown"; // Handle any unexpected cases
    }
    }
    else if(HallSessionsArray.name=="Juhu Jagruti Auditorium"){
          if (fromHour === 9 && fromMinutes === 0 && toHour === 14 && toMinutes === 0) {
      sessionName = "1.Morning";
    } else if (fromHour === 16 && fromMinutes === 0 && toHour === 22 && toMinutes === 30) {
      sessionName = "2.Evening";
    } else if (fromHour === 9 && fromMinutes === 0 && toHour === 22 && toMinutes === 30) {
      sessionName = "3.Full Day";
    } else {
      sessionName = "Unknown"; // Handle any unexpected cases
    }
    }
    else if(HallSessionsArray.name=="Babubhai Jagjivandas Hall"){
      if (fromHour === 7 && fromMinutes === 0 && toHour === 14 && toMinutes === 0) {
        sessionName = "1.Morning";
      }
      else if (fromHour === 16 && fromMinutes === 0 && toHour === 23 && toMinutes === 0) {
        sessionName = "2.Evening";
      }
      else if (fromHour === 7 && fromMinutes === 0 && toHour === 23 && toMinutes === 0) {
        sessionName = "3.Full Day";
      }
      else {
        sessionName = "Unknown"; // Handle any unexpected cases
      }

}
 
  
    if (A_Booking_for_This_Session) {
      console.log('Session ID found:', eachHallSession._id);

      finalArr.push({ ...A_Booking_for_This_Session, name: sessionName });
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
  const sortHallByName= HallSessionsArray.sessions.sort((a,b)=>{
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
  const sortedByName = finalArr.sort((a, b) => {
    // Extract the numeric part before the dot (e.g., '1', '2', '3')
    // const getNumber = (name:String) => parseInt(name.split('.')[0], 10);
    const getNumber = (name:String) => {
      if (!name) {
        return Infinity; // Or another value to handle undefined or null names
      }
      // Extract numeric prefix before the dot, or return Infinity if no numeric prefix
      const match = name.match(/^(\d+)/);
      return match ? parseInt(match[1], 10) : Infinity;
    };
  
    return getNumber(a.name) - getNumber(b.name);
  });


  useEffect(()=>{
    console.log("data",allBookingData);
    console.log("data 2",finalArr);
    // sortedByName;
  console.log("here",sortedByName);
  console.log("data by hall session",HallSessionsArray);
  console.log("sorted data by hall session 2",sortHallByName);

    




  },[])




  
  return (
    <div
      key={`day-${i}`}
      className={`flex flex-col items-center w-full bg-gray-200  rounded-md py-2`}
    >
      <span className="w-full my-1 text-center text-sm md:text-lg border-b border-gray-300">
        {i}
      </span>
      {/* SLOT INFO */}
      {sortedByName && (

      // {finalArr && (
        <>
          <div className="flex flex-col items-center justify-start gap-1 w-full  ">
          {sortedByName.map((eachSlotInfo, index) => (

            // {finalArr.map((eachSlotInfo, index) => (
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
                    sortHallByName?.find(
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
