import { EachHallPartyAreaType, EachHallType } from "../types/Hall.types";
import EditComponent from "./EditComponent";
import HallCapacityInfo from "./HallCapacityInfo";

type props = {
  partyArea: EachHallPartyAreaType[];
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function HallCapacity({ partyArea, setHallData }: props) {
  const updateHallCapacity = () => {
    // this function will be used to update the capacity in the hall ka database.
    // then refetch the hall ka info.
    // baadmai likhenge isko.
    // once backend is setup
  };
  return (
    <div className="about-hall flex justify-between bg-SAPBlue-300 w-full py-5 px-7 rounded-lg">
      <div className="hall-capacity w-11/12">
        <h2 className="font-bold text-xl mb-3">Party Areas & Capacity</h2>
        <div className="hall-capacity-info">
          {partyArea.map((eachPartyArea) => (
            <HallCapacityInfo
              name={eachPartyArea.areaName}
              seating={eachPartyArea.seating}
              capacity={eachPartyArea.capacity}
            />
          ))}
        </div>
      </div>
      <EditComponent />
    </div>
  );
}
