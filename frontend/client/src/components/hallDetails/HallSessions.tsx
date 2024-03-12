import { EachHallSessionType, EachHallType } from "../../types/Hall.types";
import { convert_IST_TimeString_To12HourFormat } from "../../utils/convert_IST_TimeString_To12HourFormat";

type Props = {
  sessions: EachHallSessionType[];
};

const HallSessions = ({ sessions}: Props) => {


  return (
    <div className=" flex justify-center items-center my-10">
    <div className="about-hall flex justify-between bg-blue-100 w-3/4 py-5 px-7 rounded-lg">
      <div className="hall-additional-features-info w-11/12">
        <h2 className="font-bold text-xl mb-3">Hall Sessions</h2>
        <div className="about-hall text-lg">
          {sessions.map((eachSession, index) => (
            <div key={index} className="flex flex-col mb-3">
              <p className="font-medium text-lg">{eachSession.name}</p>
              <div className="flex justify-between">
                <div className="flex gap-2 bg-white px-2 rounded-md">
                  <span>From:</span>
                  <span className="">
                    {eachSession.from
                      ? convert_IST_TimeString_To12HourFormat(eachSession.from)
                      : "NAN"}
                  </span>
                </div>
                <div className="flex gap-2 bg-white px-2 rounded-md">
                  <span>To:</span>
                  <span className="">
                    {convert_IST_TimeString_To12HourFormat(eachSession.to)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
    </div>
  );
};

export default HallSessions;
