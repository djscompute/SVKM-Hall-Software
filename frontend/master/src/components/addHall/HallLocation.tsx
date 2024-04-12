import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { EachHallLocationType, EachHallType } from "../../types/Hall.types";

type props = {
  location: EachHallLocationType;
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function HallLocation({ location, setHallData }: props) {
  let finalIframeUrl = location.iframe?.replace(/&#39;/g, "'");
  return (
    <div className="hall-location flex flex-col gap-3 justify-between bg-blue-100 w-[60%] md:w-[90%] lg:w-full py-5 px-7 rounded-lg">
      <p className="w-full text-center text-xl font-semibold mb-2">Location</p>
      <div className="flex gap-3 items-center">
        <h1 className="w-1/5 ">Small Address:</h1>{" "}
        <textarea
          name="desc1"
          value={location.desc1}
          onChange={(e) =>
            setHallData((prev) => ({
              ...prev,
              location: { ...prev.location, desc1: e.target.value },
            }))
          }
          className="bg-black text-white px-3 py-1 rounded w-full h-auto"
        />
      </div>
      <div className="flex gap-3 items-center">
        <h1 className="w-1/5 ">Full Address:</h1>
        <textarea
          name="desc2"
          value={location.desc2}
          onChange={(e) =>
            setHallData((prev) => ({
              ...prev,
              location: { ...prev.location, desc2: e.target.value },
            }))
          }
          className="bg-black text-white px-3 py-1 rounded w-full h-auto"
        />
      </div>
      <div className=" flex flex-col">
        <div className="flex gap-3 items-center  ">
          <h1 className="w-1/5 ">Google Map Places Link</h1>{" "}
          <textarea
            name="gmapurl"
            value={location.gmapurl}
            onChange={(e) =>
              setHallData((prev) => ({
                ...prev,
                location: { ...prev.location, gmapurl: e.target.value },
              }))
            }
            className="bg-black text-white px-3 py-1 rounded w-full h-auto"
          />
        </div>
        <p className=" w-full text-center mt-1">
          Example Google map places url :
          <a
            className=" text-blue-600 underline"
            href="https://maps.app.goo.gl/8fenAeRK5RJ2LZLc8"
          >
            https://maps.app.goo.gl/8fenAeRK5RJ2LZLc8
          </a>
        </p>
        <div className=" flex gap-2 items-center mt-1">
          <p>Test the google map link here 👉🏻</p>
          <a
            href={location.gmapurl}
            className="flex items-center bg-blue-200 p-1 rounded-md border-2 border-blue-400"
            target="_blank"
          >
            <FontAwesomeIcon className="text-red-600" icon={faLocationDot} />
            <span className="ml-1 ">View on map</span>
          </a>
        </div>
      </div>
      <div className=" flex flex-col">
        <div className="flex gap-3 items-center  ">
          <h1 className="w-1/5 ">Google Map Embed</h1>{" "}
          <textarea
            name="iframe"
            value={location.iframe}
            onChange={(e) =>
              setHallData((prev) => ({
                ...prev,
                location: { ...prev.location, iframe: e.target.value },
              }))
            }
            className="bg-black text-white px-3 py-1 rounded w-full h-auto"
          />
        </div>
        <div className="flex flex-col gap-2 items-center mt-2 sm:flex-row sm:items-center">
          <p>Preview of the embed here 👉🏻</p>
          <iframe
            src={finalIframeUrl}
            className="w-[250px] h-[250px] lg:w-[450px] lg:h-[300px]"
            //width="400"
            //height="200"
            // @ts-ignore
            allowFullScreen=""
            // @ts-ignore
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
