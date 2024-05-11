import { EachHallType } from "../../types/Hall.types";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

type props = {
  securityDeposit: number;  
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

function HallDeposit({ securityDeposit, setHallData }: props) {
  const [modalData, setModalData] = useState({ securityDeposit });
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  const handleChange = (event: React.ChangeEvent<any>) => {
    const { name, value } = event.target;
    setModalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateDepositInfo = () => {
    setHallData((prev) => ({
      ...prev,
      securityDeposit: modalData.securityDeposit,
    }));
    toggleModal();
  };

  return (
    <div className="about-hall flex justify-between bg-blue-100 w-[80%] md:w-[90%] lg:w-full py-5 px-7 rounded-lg">
      <div className="flex flex-col w-11/12">
        <h2 className="font-bold text-xl mb-3">Security Deposit</h2>
        <div className="flex ">
          <p>Security Deposit Amount (in Rs.) : </p>
          <p>{securityDeposit}</p>
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
              <div className="flex flex-col gap-3 mb-5">
                <h1 className="text-center text-lg font-semibold">
                  Edit Security Deposit Amount (in Rs.)
                </h1>
                <div className="flex flex-col px-5 py-2 rounded w-full gap-5">
                  <div className="flex items-center justify-between gap-4">
                    <h1 className="">Security Deposit:</h1>
                    <input
                      name="securityDeposit"
                      value={modalData.securityDeposit}
                      onChange={handleChange}
                      className="w-3/4 bg-gray-100 border border-gray-300 p-3 rounded h-auto"
                    />
                  </div>
                </div>
              </div>
              {/* DO SOMETHING TO BE ABLE TO EDIT HERE */}
              <div className="buttons flex justify-end gap-3 mt-5">
                <button
                  className="bg-red-700 p-2 rounded text-white hover:bg-red-500 transform active:scale-95 transition duration-300"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-sapblue-700 p-2 rounded text-white hover:bg-sapblue-900 transform active:scale-95 transition duration-300"
                  onClick={updateDepositInfo}
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

export default HallDeposit;
