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
    <div className="flex justify-between items-center rounded w-full gap-5">
      <h1 className="">Hall Restrictions</h1>
      <input
        name="eventRestrictions"
        value={eventRestrictions}
        onChange={handleChange}
        className="w-full bg-gray-300 p-3 rounded h-auto"
      />
    </div>
  );
}
