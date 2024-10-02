import { bookingStatusType } from "../../../../../types/global";
import { getSlotColour } from "../../utils/getSlotColour";

const possibleBookingStatus: bookingStatusType[] = [
  "CONFIRMED",
  //"TENTATIVE",
  "ENQUIRY",
];

function Legends() {
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <div className="flex gap-1">
        <div className={`${getSlotColour("CONFIRMED")} h-5 w-5 rounded-sm`} />
        <span className="text-sm">
          CONFIRMED (C) -{" "}
          <span className="text-xs">
            payment completed
          </span>
        </span>
      </div>
      {/*
      <div className="flex gap-1">
        <div className={`${getSlotColour("TENTATIVE")} h-5 w-5 rounded-sm`} />
        <span className="text-sm">
          TENTATIVE (T) -{" "}
          <span className="text-xs">
            partially paid
          </span>
        </span>
      </div>
    */}
      <div className="flex gap-1">
        <div className={`${getSlotColour("ENQUIRY")} h-5 w-5 rounded-sm`} />
        <span className="text-sm">
          ENQUIRY (E) -{" "}
          <span className="text-xs">
            someone has enquired
          </span>
        </span>
      </div>
    </div>
  );
}

export default Legends;
