import { EachHallType } from "../../types/Hall.types";
import React from "react";

type props = {
  capacity: string;
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function HallCapacity({ capacity, setHallData }: props) {
  const handleChange = (event: React.ChangeEvent<any>) => {
    const { name, value } = event.target;
    setHallData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex justify-between items-center rounded w-full gap-5">
      <h1 className="">Capacity:</h1>
      <input
        name="capacity"
        value={capacity}
        onChange={handleChange}
        className="w-full bg-gray-300 p-3 rounded h-auto"
      />
    </div>
  );
}
