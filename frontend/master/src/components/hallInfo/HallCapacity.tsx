import { EachHallType } from "../../types/Hall.types";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

type props = {
  capacity: string;
  seating: string;
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function HallCapacity({
  capacity,
  seating,
  setHallData,
}: props) {
  const updateHallCapacity = () => {
    // this function will be used to update the capacity in the hall ka database.
    // then refetch the hall ka info.
    // baadmai likhenge isko.
    // once backend is setup
  };

  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  return (
    <div className="about-hall flex justify-between bg-blue-100 w-full py-5 px-7 rounded-lg">
      <div className="flex flex-col w-11/12">
        <h2 className="font-bold text-xl mb-3">Capacity and Seating</h2>
        <div className="flex ">
          <p>Capacity : </p>
          <p>{capacity}</p>
        </div>
        <div className="flex ">
          <p>Seating : </p>
          <p>{seating}</p>
        </div>
      </div>
      <div className="hall-info-edit h-fit relative">
        <FontAwesomeIcon
          icon={faPenToSquare}
          className="show-on-hover h-6 cursor-pointer opacity-50 hover:opacity-100"
          onClick={toggleModal}
        />
        {modal && (
          <div className="modal-message fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="message bg-white p-6 rounded w-3/5">
              <div className="flex gap-3 mb-5">
                <h1 className="w-20 font-semibold">
                  Edit Party Areas & Capacity
                </h1>
                <div className="bg-black text-white h-44 overflow-scroll px-5 py-2 rounded w-full "></div>
              </div>
              {/* DO SOMETHING TO BE ABLE TO EDIT HERE */}
              <div className="buttons flex justify-end gap-3 mt-5">
                <button
                  className="bg-red-700 p-2 rounded text-white hover:bg-red-500 transform active:scale-95 transition duration-300"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
                <button className="bg-SAPBlue-700 p-2 rounded text-white hover:bg-SAPBlue-900 transform active:scale-95 transition duration-300">
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}