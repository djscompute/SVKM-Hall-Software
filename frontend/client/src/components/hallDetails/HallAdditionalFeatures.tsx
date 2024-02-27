import {
  EachHallAdditonalFeaturesType,
  EachHallType,
} from "../../types/Hall.types";

type Props = {
  additionalFeatures: EachHallAdditonalFeaturesType[];
};

const HallAdditionalFeatures = ({ additionalFeatures }: Props) => {
  

  return (
    <div className=" flex justify-center items-center my-10">
    <div className="about-hall flex justify-between bg-blue-100 w-3/4 py-5 px-7 rounded-lg">
      <div className="hall-additional-features-info w-11/12">
        <h2 className="font-bold text-xl mb-3">Additional Features</h2>
        <div className="about-hall text-lg">
          {additionalFeatures.map((feature, index) => (
            <div key={index} className="flex flex-col mb-3">
              <p className="font-medium text-lg">{feature.heading}</p>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
    </div>
    </div>
  );
};

export default HallAdditionalFeatures;
