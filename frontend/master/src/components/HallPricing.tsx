import React from "react";
import EditComponent from "./EditComponent";
import { EachHallType } from "../types/Hall.types";

type props = {
  pricing: number | undefined;
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function HallPricing({ pricing, setHallData }: props) {
  return (
    <div className="about-hall flex justify-between bg-SAPBlue-300 w-full py-5 px-7 rounded-lg">
      <div className="flex flex-col w-full">
        <h2 className="font-bold text-xl mb-3">Pricing</h2>
        {pricing ? (
          <p className="text-lg">{pricing}</p>
        ) : (
          <p>No pricing set for this hall. Edit to set the Price</p>
        )}
      </div>
      <EditComponent />
    </div>
  );
}
