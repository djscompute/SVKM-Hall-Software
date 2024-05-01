import { EachHallType } from "../../types/Hall.types";
import arrowList from "../../assets/arrowList.svg";

function HallAdditionalFeatures({ data }: { data: EachHallType }) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <h1 className="text-base sm:text-lg md:text-2xl font-medium">
        Additional Features
      </h1>
      <div className="ml-8 mt-1">
        <ul className="list-disc text-gray-600">
          {data.additionalFeatures?.map((feature, index) => (
            <div key={index}>
              <div className="flex">
                <img
                  src={arrowList}
                  alt="arrow"
                  className="self-baseline translate-y-[40%] mr-2"
                />
                <div className="">
                  <span className="font-bold text-black">
                    {feature.heading}:{" "}
                  </span>
                  {feature.desc}
                  <br />
                  <span className="text-[#5AA7A0] font-semibold">
                    Price: ₹{feature.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HallAdditionalFeatures;
