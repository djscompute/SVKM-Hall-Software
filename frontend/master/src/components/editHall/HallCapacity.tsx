import { EachHallType } from "../../types/Hall.types";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import capacityImg from "../../assets/capacity.svg";
import security from "../../assets/security.svg";
import restriction from "../../assets/restriction.svg";
import info from "../../assets/info.svg";
import dialog from "../../assets/dialog.svg";

type props = {
  data: EachHallType;
  capacity: string;
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function HallCapacity({ data, capacity, setHallData }: props) {
  const [modalData, setModalData] = useState({ data });
  const [modal, setModal] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const toggleModal = () => setModal(!modal);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const newValue = name === "securityDeposit" ? parseFloat(value) : value;
    setModalData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [name]: newValue,
      },
    }));
  };

  const updateInfo = () => {
    setHallData((prev) => ({
      ...prev,
      capacity: modalData.data.capacity,
      securityDeposit: modalData.data.securityDeposit,
    }));
    toggleModal();
  };

  function formatNumber(number: number | string) {
    if (typeof number === "string") {
      number = parseFloat(number); // Convert string to number
    }
    return number.toLocaleString("en-IN");
  }

  const handleInfoClick = () => {
    setShowDialog(true);
    setTimeout(() => {
      setShowDialog(false);
    }, 3000);
  };

  return (
    <div className="about-hall w-[80%] md:w-[90%] lg:w-full py-5 px-7 rounded-md">
      <div className="flex justify-between">
        <h1 className="text-base sm:text-lg md:text-2xl font-medium">
          Capacity
        </h1>
        <div className="show-on-hover cursor-pointer opacity-100 hover:opacity-100">
          <FontAwesomeIcon
            icon={faPenToSquare}
            className="show-on-hover h-6 cursor-pointer opacity-50 hover:opacity-100"
            onClick={toggleModal}
          />
        </div>
      </div>

      {/* Capacity Component */}
      <div className="flex flex-col gap-3 w-full">
        <div>
          <div className="bg-[#FDF9C9] text-[#7D501F] font-semibold w-fit p-2 rounded-md">
            <img
              src={capacityImg}
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
          <div
            className={`relative self-center transition-opacity duration-500 ${
              showDialog ? "opacity-100" : "opacity-0"
            }`}
          >
            {showDialog && <img src={dialog} alt="" className="h-14" />}
          </div>
        </div>
      </div>
      {/* Capacity Component */}

      <div className="hall-info-edit h-fit relative">
        {modal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 h-screen overflow-y-auto">
            <div className="flex flex-col message bg-white p-6 rounded w-4/5 md:w-3/5 lg:w-2/5 gap-2">
              <p className="w-full text-center text-xl font-semibold mb-2">
                Capacity
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                <div className="w-1/2 text-center sm:text-right">
                  <h1 className="self-baseline">Capacity:</h1>{" "}
                </div>
                <div className="w-1/2 flex flex-col">
                  <textarea
                    name="capacity"
                    value={modalData.data.capacity}
                    rows={1}
                    onChange={handleChange}
                    className="bg-black text-white px-3 py-1 w-[170px] rounded  h-auto  mx-auto sm:mx-0"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <div className="w-1/2 text-center sm:text-right">
                  <h1 className="self-baseline">Security Deposit:</h1>{" "}
                </div>
                <div className="w-1/2 flex flex-col">
                  <textarea
                    name="securityDeposit"
                    value={modalData.data.securityDeposit}
                    rows={1}
                    onChange={handleChange}
                    className="bg-black text-white px-3 py-1 w-[170px] rounded  h-auto  mx-auto sm:mx-0"
                  />
                </div>
              </div>

              <div className="buttons flex justify-end gap-3 mt-10">
                <button
                  className="bg-red-700 p-2 rounded text-white hover:bg-red-500 transform active:scale-95 transition duration-300"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-sapblue-700 p-2 rounded text-white hover:bg-sapblue-900 transform active:scale-95 transition duration-300"
                  onClick={updateInfo}
                >
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
