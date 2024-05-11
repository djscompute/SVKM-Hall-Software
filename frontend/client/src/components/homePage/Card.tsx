import { Link } from "react-router-dom";
import { EachHallType } from "../../types/Hall.types";
import markerImage from "../../assets/location-marker-red.svg";
import sparkle from "../../assets/sparkle.svg";

type Props = {
  hallData: EachHallType;
};

export default function Card({ hallData }: Props) {
  console.log(hallData);
  return (
    <Link
      to={`/halls/${hallData._id}`}
      className="flex flex-col justify-between rounded-lg overflow-hidden h-auto w-full lg:w-1/4 m-3 md:m-10 lg:m-2"
    >
      <img
        className="z-0 w-full h-60 min-h-60 rounded-lg"
        src={hallData.images ? hallData.images[0] : "null"}
      />
      {/* TEXT PART */}
      <div className="flex flex-col justify-between h-full pt-2 gap-1 ">
        <div className="flex items-center gap-1">
          <img className="h-4 w-4" src={markerImage} />
          <a
            href={hallData.location.gmapurl}
            className=" text-[#950D0D] underline"
          >
            {hallData.location.desc1}
          </a>
          <span className="text-[#9CA3AF]"> | {hallData.capacity}</span>
        </div>
        <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-0">
          {hallData.additionalFeatures?.map((a) => (
            <div className="flex flex-row items-center gap-1">
              <img src={sparkle} />
              <span className=" text-[#F8A151] font-medium">{a.heading}</span>
            </div>
          ))}
        </div>
        <span className="font-semibold text-base sm:text-xl text-[#5AA7A0]">
          {hallData.name}
        </span>
        <span className=" text-[#9CA3AF] text-sm" >{hallData.about[0]}</span>
        <div className="flex flex-row items-center justify-between w-full">
          <button className="p-2 text-[#5AA7A0] text-sm sm:text-base font-medium rounded-lg border border-[#5AA7A0] hover:bg-[#5AA7A0] hover:text-white">
            Check Availability
          </button>
        </div>
        <div className="mt-3 h-1 w-full bg-[#5AA7A0]"/>
      </div>
    </Link>
  );
}