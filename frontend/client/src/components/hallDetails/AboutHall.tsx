import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { EachHallLocationType, EachHallType } from "../../types/Hall.types";

type Props = {
  about: string[];
};

export default function AboutHall({ about }: Props) {
//   const [modalData, setModalData] = useState<string[]>(about);
  const [isOpen, setIsOpen] = useState(false);
//   const [modal, setModal] = useState(false);
//   const [aboutList, setAboutList] = useState<string[]>(modalData);
//   const [newItem, setNewItem] = useState("");

  const toggleReadMore = () => setIsOpen(!isOpen);



  return (
    <div className=" flex justify-center items-center my-10">
    <div className="about-hall flex justify-between bg-blue-100 w-3/4 py-5 px-7 rounded-md">
      <div className="about-hall-info w-11/12">
        <h2 className=" font-bold text-xl mb-3">About this venue</h2>
        <div
          className={`flex flex-col text-lg ${
            isOpen ? "" : " h-24 overflow-hidden"
          }`}
        >
          {about.map((eachPara, index) => (
            <span key={index} className="my-2">
              {eachPara}
            </span>
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
      
    </div>
    </div>
  );
}
