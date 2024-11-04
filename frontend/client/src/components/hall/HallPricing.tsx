import { EachHallType } from "../../types/Hall.types";
import { convertTo12Hour } from "../../utils/convert_IST_TimeString_To12HourFormat";

function HallPricing({ data }: { data: EachHallType}) {

  console.log("value is", data.sessions);
  const dataWithActiveSessions = data.sessions.filter((data) => data.active === true);
  console.log("updated value ", dataWithActiveSessions);

  return (
    <div className="flex flex-col gap-3 w-full">
      <h1 className="text-base sm:text-lg md:text-2xl font-medium">
        Pricing 
      </h1>
      {dataWithActiveSessions.map((session, index) => (
        <div className="flex flex-col text-lg my-2" key={index}>
          <div className="flex my-2">
            <span className="font-semibold w-[220px]">{session.name}</span>
            <span className="w-[200px]">From: {convertTo12Hour(session.from)}</span>
            <span className="w-[200px]">To: {convertTo12Hour(session.to)}</span>
          </div>
          <div className="flex flex-col w-full">
            <div className="w-full justify-evenly text-center hidden lg:flex">
              <span className="w-1/2 border border-gray-400 font-semibold py-1">Customer Category</span>
              <span className="w-1/2 border border-gray-400 font-semibold py-1">Price</span>
            </div>
            {session.price.map((record, index) => (
              <div className="w-full flex justify-evenly text-center flex-col lg:flex-row" key={index}>
                <span className="lg:w-1/2 border border-gray-400 py-1 font-semibold lg:font-normal">{record.categoryName}</span>
                <span className="lg:w-1/2 border border-gray-400 py-1">₹{record.price}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HallPricing;
