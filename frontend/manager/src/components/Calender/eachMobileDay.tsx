import dayjs from "dayjs";
import { EachHallSessionType, EachHallType, HallBookingType } from "../../../../../types/global";
import { bookingStatusType } from "../../types/Hall.types";
import isBetween from "dayjs/plugin/isBetween"; // Import the timezone plugin
import { convert_IST_DateTimeString_To12HourFormat } from "../../utils/convert_IST_TimeString_To12HourFormat";
import { useEffect } from "react";

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
	
	

	// filter only the bookings of this current Day
	allBookingData = allBookingData?.filter((obj) => dayjs(obj.from).isSame(myDayJSObject, "day"));

	// convert "08:00:00" to "${aaj-ka-din}T"08:00:00""
	const completeDateSessions = HallSessionsArray.sessions.map((element) => {
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

	const finalArr: (HallBookingType | EachHallSessionType)[] = [];
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
						{/* typescript not picking up props of HallBookingType for some reason */}
						{finalArr.map((eachSlotInfo: any) => (
							<a
								href={!eachSlotInfo.active ? `/booking/${eachSlotInfo._id}` : undefined}
								key={Math.random()}
								className={`flex justify-between w-full 
              
              ${getSlotColour(eachSlotInfo.status)}
              ${eachSlotInfo.status == "EMPTY" && " border-2 border-black"}
              px-2 overflow-x-auto
              `}
							>
								<span>
									{convert_IST_DateTimeString_To12HourFormat(eachSlotInfo.from)}-
									{convert_IST_DateTimeString_To12HourFormat(eachSlotInfo.to)}
								</span>
								{eachSlotInfo.initial !== "O" && (
									<>
										<span>{eachSlotInfo.initial}</span>

										<span>{eachSlotInfo.user?.username}</span>
									</>
								)}
							</a>
						))}
					</div>
				</>
			)}
		</div>
	);
}

export default EachMobileDay;
