import { useState } from 'react';
import { EachHallType } from "../../types/Hall.types";
import capacity from "../../assets/capacity.svg";
import security from "../../assets/security.svg";
import restriction from "../../assets/restriction.svg";
import info from "../../assets/info.svg";
import dialog from "../../assets/dialog.svg";

function formatNumber(number: number) {
  return number.toLocaleString("en-IN");
}

function HallCapacity({ data }: { data: EachHallType }) {
  const [showDialog, setShowDialog] = useState(false);

  const handleInfoClick = () => {
    setShowDialog(true);
    setTimeout(() => {
      setShowDialog(false);
    }, 3000); 
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div>
        <div className="bg-[#FDF9C9] text-[#7D501F] font-semibold w-fit p-2 rounded-md">
          <img
            src={capacity}
            alt="capacity"
            className="inline-block mr-2 align-middle"
          />
          {data.capacity} Capacity
        </div>
      </div>

      <div>
        <div className="bg-[#DEEAFC] text-[#1D4ED8] font-semibold w-fit p-2 rounded-md">
          <img
            src={security}
            alt="capacity"
            className="inline-block mr-2 align-middle"
          />
          ₹{formatNumber(data.securityDeposit)} Security Deposit
        </div>
      </div>

      <div className="flex gap-2 h-14">
        <div className="bg-[#F9E3E3] text-[#8C2822] font-semibold w-fit p-2 rounded-md h-fit self-center">
          <img
            src={restriction}
            alt="capacity"
            className="inline-block mr-2 align-middle"
          />
          {data.eventRestrictions} Restriction
        </div>

        <button onClick={handleInfoClick}>
          <img src={info} alt="info" />
        </button>
        <div className={`relative self-center transition-opacity duration-500 ${showDialog ? 'opacity-100' : 'opacity-0'}`}>
          {showDialog && (
            <img src={dialog} alt="" className="h-14"/>
          )}
        </div>
      </div>
    </div>
  );
}

export default HallCapacity;
