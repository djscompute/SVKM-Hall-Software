import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import hall from "../../assets/hall.png";

export default function Card(props: any) {
  return (
    <Link to={`/halls/${props.id}`}>
      <div className="bg-slate-100 rounded-lg m-4 w-[400px] aspect-[4/3] drop-shadow-2xl h-[380px] border-2 border-slate-300">
        <div className="bg-SAPBlue-500 text-center h-[35px] pt-[6px] text-[15px] font-semibold text-white font-sans rounded-se-lg rounded-ss-lg">
          {props.tagline}
        </div>
        <div className="w-full">
          <FontAwesomeIcon
            icon={faCircleInfo}
            className="fixed drop-shadow-xl text-white m-[10px] text-2xl top-8 z-5"
          />
          <div className="flex flex-row w-[110px] justify-center rounded-full drop-shadow-xl p-1 fixed text-white m-[10px] text-2xl mt-8 z-5 bg-white left-2/3 top-[155px]">
            <FontAwesomeIcon
              icon={faImages}
              className="text-pink-600 text-xl "
            />
            <span className="font-medium text-sm text-slate-900">
              &nbsp;{props.numPhotos} photos
            </span>
          </div>
          <img
            className="top-0 w-[400px] h-[200px] rounded-ee-lg rounded-es-lg z-0"
            src={props.img}
          />
        </div>
        <div className="px-4 pt-2 block font-bold text-black">{props.name}</div>
        <div className="px-4 block font-semibold text-slate-600">
          {props.place}
        </div>
        <div className="flex flex-row justify-between">
          <div className="px-4 block font-semibold text-slate-600">
            <FontAwesomeIcon icon={faPeopleGroup} className="mr-2" />
            {props.minCapacity}-{props.maxCapacity}
          </div>
          <div className="px-4 block font-semibold font-6 text-slate-900">
            ₹ {props.price}{" "}
            <span className="font-medium text-slate-600">/ Person</span>
          </div>
        </div>
        <div className="flex flex-row justify-end">
          <button className="block font-semibold text-pink-600 border-2 border-pink-600 hover:bg-pink-600 hover:text-white mx-4 mt-2 px-5 py-2 rounded-full">
            Check Availability
          </button>
        </div>
      </div>
    </Link>
  );
}

Card.defaultProps = {
  id: "0",
  img: hall,
  tagline: "Hall's tagline",
  name: "Hall's Name",
  place: "Hall's Location",
  numPhotos: 10,
  minCapacity: 30,
  maxCapacity: 100,
  price: 900,
};
