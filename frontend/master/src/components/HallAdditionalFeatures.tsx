import React from "react";
import EditComponent from "./EditComponent";

interface Props {
  additionalFeatures: string[];
}

const MyComponent: React.FC<Props> = ({ additionalFeatures }) => {
  return (
    <div className="hall-additional-features flex justify-between bg-[#8c9ecd] w-full p-3 px-12 rounded-lg">
      <div className="hall-additional-features-info">
        <h2 className="additional-features-text font-bold text-xl mb-3">Additional Features</h2>
        { additionalFeatures.map((feature, index) => (
          <h4 key={index} className="text-lg">{feature}</h4>
        ))}
      </div>
      <EditComponent />
    </div>
  );
};

const HallAdditionalFeatures: React.FC = () => {
    const additionalFeatures = [
        "Gorgeous ambiance", 
        "In-house decorators make the venue more stunning", 
        "In-house caterers serve delicious food",
        "Convenient location"
    ];

    return <MyComponent additionalFeatures = { additionalFeatures } />;
    };

export default HallAdditionalFeatures;
