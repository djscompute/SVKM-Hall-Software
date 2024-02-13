import React, { useState } from "react";
import EditComponent from "./EditComponent";
import { EachHallType } from "../types/Hall.types";

type props = {
  about: string[];
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function AboutHall({ about, setHallData }: props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleReadMore = () => setIsOpen(!isOpen);

  const updateHallAbout = () => {
    // this function will be used to update the about in the hall ka database.
    // then refetch the hall ka info.
    // baadmai likhenge isko.
    // once backend is setup
  };

  return (
    <div className="about-hall flex justify-between bg-SAPBlue-300 w-full py-5 px-7 rounded-md">
      <div className="about-hall-info w-11/12">
        <h2 className="font-bold text-xl mb-3">About this venue</h2>
        <div
          className={`about-hall text-lg ${
            isOpen ? "" : " h-24 overflow-hidden"
          }`}
          //   style={isOpen ? null : paragraphStyles}
        >
          {about.map((eachPara) => (
            <p className="my-2">{eachPara}</p>
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
      <EditComponent />
    </div>
  );
}
