import React from "react";
import EditComponent from "./EditComponent";
import {
  EachHallAdditonalFeaturesType,
  EachHallType,
} from "../types/Hall.types";

type props = {
  additionalFeatures: EachHallAdditonalFeaturesType[];
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

const HallAdditionalFeatures = ({ additionalFeatures, setHallData }: props) => {
  return (
    <div className="hall-additional-features flex justify-between bg-SAPBlue-300 w-full py-5 px-7 rounded-lg">
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
      <EditComponent />
    </div>
  );
};
export default HallAdditionalFeatures;
