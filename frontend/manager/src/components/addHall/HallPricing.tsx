import React from "react";
import { EachHallType } from "../../types/Hall.types";

type props = {
  pricing: string | undefined;
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function HallPricing({ pricing, setHallData }: props) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setHallData((prev) => ({ ...prev, pricing: value }));
  };

  return (
    <div className="about-hall flex justify-between bg-blue-100 w-full py-5 px-7 rounded-lg">
      <div className="flex items-center gap-3 mb-5 w-full">
        <h1 className="w-20 font-semibold">Pricing:</h1>
        <input
          type="number"
          name="pricing"
          value={pricing || ""}
          onChange={handleChange}
          className=" bg-gray-100 border border-gray-300 px-3 py-1 rounded-md w-full h-auto"
        />
      </div>
    </div>
  );
}
