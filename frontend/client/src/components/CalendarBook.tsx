import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import { useState } from "react";

const BookCalendar = () => {
  //Calendar:
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const [flipped, setFlipped] = useState(false);
  const flip = () => {
    const card = document.getElementById(`encloserDiv`);
    if (card) {
      card.style.transform = "rotateY(180deg)";
      setFlipped(true);
      if (flipped) {
        card.style.transform = "rotateY(0deg)";
        setFlipped(false);
      }
    }
  };
  return (
    <>
      <div
        className="group card-holder border-[4px] rounded-xl border-SAPBlue-300 shadow-2xl shadow-black w-full h-[393.2px] min-w-[465px] max-w-[570px] transition-all  md:mt-3 mx-auto"
        id="mainDiv"
        style={{ fontSize: "50px" }}
      >
        <div
          id={`encloserDiv`}
          className="relative  h-full w-full [transform-style:preserve-3d] transition-all duration-500 "
        >
          {/* Front */}
          <div
            className="absolute h-full w-full card rounded-xl hover:cursor-pointer"
            onClick={flip}
          >
            <div className="text-SAPBlue-900 text-center mx-auto my-auto h-full flex items-center">
              <span className="mx-auto">
                Click here to book <br />
                OR
                <br />
                Check dates
              </span>
            </div>
          </div>
          {/* Front */}

          <div className="relative h-full w-full card card-back [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-xl ">
            {/* Back */}
            <div className="w-full h-full ">
              <DateRangePicker
                className=" p-1 border-black w-full h-full absolute"
                onChange={(item) => {
                  if (item.selection.startDate && item.selection.endDate) {
                    setRange([
                      {
                        startDate: item.selection.startDate,
                        endDate: item.selection.endDate,
                        key: "selection", // or any other appropriate key
                      },
                    ]);
                  }
                }}
                moveRangeOnFirstSelection={false}
                months={1}
                ranges={range}
                direction="horizontal"
              />
            </div>
          </div>
          {/* Back */}
        </div>
      </div>
    </>
  );
};

export default BookCalendar;
