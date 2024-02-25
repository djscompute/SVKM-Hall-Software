import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { EachHallType } from "../../types/Hall.types";

type props = {
  pricing: string | undefined;
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function HallPricing({ pricing, setHallData }: props) {
  const [modalData, setModalData] = useState<string | undefined>(pricing);
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setModalData(value);
  };

  const updateHallPricing = () => {
    if (modalData !== undefined) {
      setHallData((prev) => ({
        ...prev,
        pricing: modalData,
      }));
      toggleModal();
    }
  };

  return (
    <div className="about-hall flex justify-between bg-blue-100 w-full py-5 px-7 rounded-lg">
      <div className="flex flex-col w-full">
        <h2 className="font-bold text-xl mb-3">Pricing</h2>
        {pricing ? (
          <p className="text-lg">{pricing}</p>
        ) : (
          <p>No pricing set for this hall. Edit to set the Price</p>
        )}
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
              <div className="flex items-center gap-3 mb-5">
                <h1 className="w-20 font-semibold">Pricing:</h1>
                <input
                  type="number"
                  name="pricing"
                  value={modalData || ""}
                  onChange={handleChange}
                  className=" bg-gray-100 border border-gray-300 px-3 py-1 rounded-md w-full h-auto"
                />
              </div>
              <div className="buttons flex justify-end gap-3 mt-5">
                <button
                  className="bg-red-700 p-2 rounded text-white hover:bg-red-500 transform active:scale-95 transition duration-300"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-SAPBlue-700 p-2 rounded text-white hover:bg-SAPBlue-900 transform active:scale-95 transition duration-300"
                  onClick={updateHallPricing}
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
