import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { EachHallType } from "../../types/Hall.types";

type props = {
  about: string[];
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function AboutHall({ about, setHallData }: props) {
  const [modalData, setModalData] = useState<string[]>(about);
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState(false);

  const toggleReadMore = () => setIsOpen(!isOpen);

  const toggleModal = () => setModal(!modal);

  const handleChange = (event: React.ChangeEvent<any>) => {
    const { name, value } = event.target;
    setModalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateHallAbout = () => {
    setHallData((prev) => ({
      ...prev,
      about: modalData,
    }));
    toggleModal();
  };

  return (
    <div className="about-hall flex justify-between bg-blue-100 w-full py-5 px-7 rounded-md">
      <div className="about-hall-info w-11/12">
        <h2 className="font-bold text-xl mb-3">About this venue</h2>
        <div
          className={`about-hall text-lg ${
            isOpen ? "" : " h-24 overflow-hidden"
          }`}
          //   style={isOpen ? null : paragraphStyles}
        >
          {about.map((eachPara, index) => (
            <p key={index} className="my-2">
              {eachPara}
            </p>
          ))}
        </div>
        {!isOpen ? (
          <button
            onClick={toggleReadMore}
            className="read-more-btn text-gray-700 font-semibold text-lg"
          >
            Read More
          </button>
        ) : (
          <button
            onClick={toggleReadMore}
            className="read-less-btn text-gray-700 font-semibold text-lg"
          >
            Read Less
          </button>
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
              <div className="flex gap-3 mb-5">
                <h1 className="w-20 font-semibold">About:</h1>
                <div className="bg-black text-white px-5 py-2 rounded w-full">
                  {about.map((eachPara, index) => (
                    <p key={index} className="mb-2">
                      {eachPara}
                    </p>
                  ))}
                </div>
              </div>
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
