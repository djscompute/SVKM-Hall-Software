import React from "react";
import EditComponent from "./EditComponent";
import { EachHallTimingType, EachHallType } from "../types/Hall.types";

type props = {
  timing: EachHallTimingType;
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function HallSlotInfo({ timing, setHallData }: props) {
  return (
    <div className="hall-slot flex justify-between bg-SAPBlue-300 w-full py-5 px-7 rounded-lg">
      <div className="hall-slot-info w-full">
        <h2 className="font-bold text-xl mb-3">Timings & Slots</h2>
        <div className="flex w-full justify-evenly font-normal text-lg">
          <div className="flex ">
            <p>from : </p>
            <p>{timing.from}</p>
          </div>
          <div className="flex ">
            <p>to : </p>
            <p>{timing.to}</p>
          </div>
        </div>
      </div>
      <EditComponent />
    </div>
  );
}
