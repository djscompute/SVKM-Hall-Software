import { bookingStatusType } from "../../types/Hall.types";

// @ts-ignore
function EachMobileDay({ dummySlotData, i }) {
  const getSlotColour = (status: bookingStatusType) => {
    switch (status) {
      case "ENQUIRY":
        return "bg-blue-200";
      case "CONFIRMED":
        return "bg-red-200";
      case "TENTATIVE":
        return "bg-orange-200";
      default:
        return "bg-white";
    }
  };
  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  }
  return (
    <div
      key={`day-${i}`}
      className={`flex flex-col items-center w-full bg-gray-200  rounded-md py-2`}
    >
      <span className="w-full my-1 text-center text-sm md:text-lg border-b border-gray-300">
        {i}
      </span>
      {/* SLOT INFO */}
      {dummySlotData && (
        <>
          <div className="flex flex-col items-center justify-start gap-1 w-full  ">
            {shuffleArray(dummySlotData).map((eachSlotInfo) => (
              <div
                className={`flex justify-between w-full 
              ${getSlotColour(eachSlotInfo.status)}
              ${eachSlotInfo.status == "EMPTY" && " border-2 border-black"}
              px-2 overflow-x-auto
              `}
              >
                <span>
                  {eachSlotInfo.from}-{eachSlotInfo.to}
                </span>
                {eachSlotInfo.initial !== "O" && (
                  <span>{eachSlotInfo.initial}</span>
                )}
              </div>
            ))}
          </div>
          <button className="bg-blue-700 hover:bg-blue-800 active:bg-blue-300 text-white text-center text-xs p-1 mt-1 rounded-md">
            ENQUIRE
          </button>
        </>
      )}
    </div>
  );
}

export default EachMobileDay;