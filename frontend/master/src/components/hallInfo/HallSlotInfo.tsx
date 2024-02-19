import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { EachHallTimingType, EachHallType } from "../../types/Hall.types";

type props = {
  timing: EachHallTimingType;
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function HallSlotInfo({ timing, setHallData }: props) {

  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  return (
    <div className="hall-slot flex justify-between bg-blue-100 w-full py-5 px-7 rounded-lg">
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
      <div className="hall-info-edit h-fit relative">
        <FontAwesomeIcon
          icon={faPenToSquare}
          className="show-on-hover h-6 cursor-pointer opacity-50 hover:opacity-100"
          onClick={toggleModal}
        />
        {modal &&
          (<div className="modal-message fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="message bg-white p-6 rounded w-3/5">
              <div className="flex gap-3 mb-5">
                <h1 className="timings-heading w-20 font-semibold">Timings & Slots:</h1>
                <div className="bg-black text-white px-5 py-2 rounded w-full ">
                  <div className="from-time flex mb-2">
                    <p>FROM: </p>
                    <p>{timing.from}</p>
                  </div>
                  <div className="to-time flex ">
                    <p>TO: </p>
                    <p>{timing.to}</p>
                  </div>
                </div>
              </div>
              <div className="buttons flex justify-end gap-3 mt-5">
                <button className="bg-red-700 p-2 rounded text-white hover:bg-red-500 transform active:scale-95 transition duration-300" onClick={toggleModal}>Cancel</button>
                <button className="bg-SAPBlue-700 p-2 rounded text-white hover:bg-SAPBlue-900 transform active:scale-95 transition duration-300">Submit</button>
              </div>
            </div>
          </div>)
        }
      </div>
    </div>
  );
}
