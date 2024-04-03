import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { EachHallType } from "../../types/Hall.types";

export default function Card(
  props: Pick<
    EachHallType,
    "name" | "_id" | "capacity" | "images" | "location" | "pricing" | "seating"
  >
) {
  console.log(props);
  return (
    <Link
      to={`/halls/${props._id}`}
      className="flex flex-col rounded-lg bg-white w-full lg:w-1/3 m-3 md:m-10 lg:m-0 drop-shadow-2xl pb-4 border-2 border-gray-300 "
    >
      {/* IMAGE PART */}
      <div className="flex justify-center w-full relative">
        <FontAwesomeIcon
          icon={faCircleInfo}
          className="absolute drop-shadow-xl text-white top-5 left-5 z-10 h-6 w-6 shadow-md"
        />
        <div className=" absolute bottom-5 right-5 flex flex-row items-center justify-center rounded-md p-1 px-2 text-white bg-white z-10 ">
          <FontAwesomeIcon icon={faImages} className="text-pink-600" />
          <span className="font-medium text-black">
            &nbsp;{props.images?.length} photos
          </span>
        </div>
        <img
          className=" rounded-md z-0"
          src={props.images ? props.images[0] : "null"}
        />
      </div>
      {/* TEXT PART */}
      <div className="flex flex-col px-5 py-2">
        <span className="font-bold text-center text-base sm:text-xl text-black">
          {props.name}
        </span>
        <span className="font-medium w-full">{props.location.desc1}</span>
        <div className="flex flex-wrap justify-between">
          <span className="text-gray-800">
            seating:
            <span className="text-black">{props.seating}</span>
          </span>
          <span className="text-gray-800">
            capacity:
            <span className="text-black">{props.capacity}</span>
          </span>
        </div>
        <div className="flex flex-row items-center justify-between mt-3">
          <span className="block text-gray-800">
            pricing:{" "}
            <span className="font-medium text-black">₹{props.pricing}/hr</span>
          </span>
          <button className="text-pink-600 border-2 text-sm sm:text-base border-pink-600 hover:bg-pink-600 hover:text-white px-4 py-1 rounded-full">
            Manage Hall
          </button>
        </div>
      </div>
    </Link>
  );
}
