import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import {
  EachHallAdditonalFeaturesType,
  EachHallType,
} from "../../types/Hall.types";

type props = {
  additionalFeatures: EachHallAdditonalFeaturesType[];
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

const HallAdditionalFeatures = ({ additionalFeatures, setHallData }: props) => {

  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  return (
    <div className="hall-additional-features flex justify-between bg-blue-100 w-full py-5 px-7 rounded-lg">
      <div className="hall-additional-features-info">
        <h2 className="additional-features-text font-bold text-xl mb-3">
          Additional Features
        </h2>
        {additionalFeatures.map((eachFeature) => (
          <div className="flex flex-col">
            <p className=" font-medium text-lg">{eachFeature.heading}</p>
            <p>{eachFeature.desc}</p>
          </div>
        ))}
      </div>
      <div className="hall-additional-features h-fit relative">
        <FontAwesomeIcon
          icon={faPenToSquare}
          className="show-on-hover h-6 cursor-pointer opacity-50 hover:opacity-100"
          onClick={toggleModal}
        />
        {modal &&
          (<div className="modal-message fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="message bg-white p-6 rounded w-3/5">
              <div className="flex gap-3 mb-5">
                <h1 className="w-20 font-semibold">Additional Features:</h1>
                <div className="bg-black text-white px-5 py-2 rounded w-full ">
                  { additionalFeatures.map((eachFeature) => (
                    <div className="flex flex-col">
                      <p className="each-feature-heading font-medium text-lg">{eachFeature.heading}</p>
                      <p className="each-feature-desc">{eachFeature.desc}</p>
                    </div>
                  ))}
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
};
export default HallAdditionalFeatures;
