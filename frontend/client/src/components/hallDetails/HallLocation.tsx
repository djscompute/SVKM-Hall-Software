import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { EachHallLocationType, EachHallType } from "../../types/Hall.types";

type props = {
  location: EachHallLocationType;
};

export default function HallLocation({ location }: props) {
  let finalIframeUrl = location.iframe?.replace(/&#39;/g, "'");
  return (
    <div className=" flex justify-center items-center my-10">
    <div className="hall-location flex justify-between bg-blue-100 w-3/4 py-5 px-7 rounded-lg">
      <div className="hall-location-main-info w-11/12">
        <h2 className="font-bold text-xl mb-3">Location</h2>
        <div className="hall-location-map flex flex-col items-start gap-5">
          <h2 className="hall-location-small text-lg">{location.desc1}</h2>
          <h2 className="hall-location-big text-lg">{location.desc2}</h2>
          {location.gmapurl && (
            <a
              href={location.gmapurl}
              className="flex items-center bg-blue-300 p-1 rounded-md border-2 border-blue-400"
              target="_blank"
            >
              <FontAwesomeIcon className="text-red-600" icon={faLocationDot} />
              <span className="ml-1 ">View on map</span>
            </a>
          )}
          {location.iframe && (
            <iframe
              src={finalIframeUrl}
              width="400"
              height="200"
              loading="lazy"
              // @ts-ignore
              allowFullScreen=""
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
