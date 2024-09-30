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
            you cant enquire for a slot which is confirmed
          </span>
        </span>
      </div>
      {/*
      <div className="flex gap-1">
        <div className={`${getSlotColour("TENTATIVE")} h-5 w-5 rounded-sm`} />
        <span className="text-sm">
          TENTATIVE (T) -{" "}
          <span className="text-xs">
            someone has partially paid for this slot. you can book this slot
            with full payment.
          </span>
        </span>
      </div>
      */}
      <div className="flex gap-1">
        <div className={`${getSlotColour("ENQUIRY")} h-5 w-5 rounded-sm`} />
        <span className="text-sm">
          ENQUIRY (E) -{" "}
          <span className="text-xs">
            someone has raised an enquiry to book this slot. you can enquire for
            this.
          </span>
        </span>
      </div>
    </div>
  );
}

export default Legends;
