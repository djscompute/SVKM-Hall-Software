import { EachHallType } from "../../types/Hall.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

function HallLocation({ data }: { data: EachHallType }) {
  let finalIframeUrl = data?.location.iframe?.replace(/&#39;/g, "'");
  return (
    <div className="flex flex-col md:flex-row gap-3 w-full">
      <div className="flex flex-col gap-3 h-full w-full md:w-1/3">
        <h1 className="text-base sm:text-lg md:text-2xl font-medium">
          Address
        </h1>
        <span className=" text-gray-600">{data.location.desc2}</span>
        <a
          href={data.location.gmapurl}
          className="flex items-center justify-center p-1 px-3 rounded-md border-[2px] border-[#5AA7A0]"
          target="_blank"
        >
          <FontAwesomeIcon className="text-[#5AA7A0]" icon={faLocationDot} />
          <span className="ml-2 text-[#5AA7A0]">View on map</span>
        </a>
      </div>
      <div className="flex w-full md:w-2/3">
        {finalIframeUrl && (
          <iframe
            src={finalIframeUrl}
            className="w-full md:h-56"
            loading="lazy"
            // @ts-ignore
            allowFullScreen=""
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>
    </div>
  );
}

export default HallLocation;
