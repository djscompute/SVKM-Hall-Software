import EditComponent from "./EditComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { EachHallLocationType, EachHallType } from "../types/Hall.types";

type props = {
  location: EachHallLocationType;
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function HallLocation({ location, setHallData }: props) {

  const updateLocation = () => {
    // this function will be used to update the location in the hall ka database.
    // then refetch the hall ka info.
    // baadmai likhenge isko.
    // once backend is setup
  };
  return (
    <div className="hall-location flex justify-between bg-SAPBlue-300 w-full py-5 px-7 rounded-lg">
      <div className="hall-location-main-info w-11/12">
        <h2 className="font-bold text-xl mb-3">Location</h2>
        <div className="hall-location-map flex items-center gap-5">
          <h2 className="hall-location-small text-lg">{location.desc1}</h2>
          {location.gmapurl && (
            <span className="map-location">
              <FontAwesomeIcon className="text-red-600" icon={faLocationDot} />
              <a
                href={location.gmapurl}
                className="ml-1 text-gray-700"
                target="_blank"
              >
                View on map
              </a>
            </span>
          )}
        </div>
        <h2 className="hall-location-big text-lg">{location.desc2}</h2>
      </div>
      <EditComponent />
    </div>
  );
}
