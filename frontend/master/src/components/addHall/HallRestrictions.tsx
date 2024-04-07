import { EachHallType } from "../../types/Hall.types";
import React from "react";

type props = {
  eventRestrictions: string;
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function HallRestrictions({
  eventRestrictions,
  setHallData,
}: props) {
  const handleChange = (event: React.ChangeEvent<any>) => {
    const { name, value } = event.target;
    setHallData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="about-hall flex justify-between bg-blue-100 w-[60%] md:w-[90%] lg:w-full py-5 px-7 rounded-lg">
      <div className="flex flex-col gap-3 mb-5 w-full">
        <h1 className="text-center text-lg font-semibold">
          Hall Event Restrictions
        </h1>
        <div className="flex flex-col px-5 py-2 rounded w-full gap-5">
          <div className="flex items-center justify-between gap-4">
            <h1 className="">Hall Restrictions:</h1>
            <input
              name="eventRestrictions"
              value={eventRestrictions}
              onChange={handleChange}
              className="w-3/4 bg-gray-100 border border-gray-300 p-3 rounded h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
