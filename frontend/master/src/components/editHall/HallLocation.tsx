import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { EachHallLocationType, EachHallType } from "../../types/Hall.types";

type props = {
  location: EachHallLocationType;
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function HallLocation({ location, setHallData }: props) {
  const [modalData, setModalData] = useState<EachHallLocationType>(location);
  const [modal, setModal] = useState<boolean>(false);

  const toggleModal = () => setModal(!modal);

  const handleChange = (event: React.ChangeEvent<any>) => {
    const { name, value } = event.target;
    setModalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateLocation = () => {
    setHallData((prev) => ({
      ...prev,
      location: modalData,
    }));
    toggleModal();
  };
  let finalIframeUrl = location.iframe?.replace(/&#39;/g, "'");
  let modalIframeUrl = modalData.iframe?.replace(/&#39;/g, "'");
  return (
    <div className="hall-location flex justify-between w-full rounded-lg">
      <div className="flex flex-col md:flex-row gap-3 w-full">
        <div className="flex flex-col gap-3 h-full w-full md:w-1/3">
          <h1 className="text-base sm:text-lg md:text-2xl font-medium">
            Address
          </h1>
          <span className=" text-gray-600">{location.desc2}</span>
          <a
            href={location.gmapurl}
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
      {/* <EditComponent /> */}
      <div className="h-fit relative">
        <FontAwesomeIcon
          icon={faPenToSquare}
          className="show-on-hover h-6 ml-3 cursor-pointer opacity-50 hover:opacity-100"
          onClick={toggleModal}
        />
        {modal && (
          <div className="fixed top-0 left-0 flex justify-center items-center w-full z-10 backdrop-blur-md h-screen overflow-scroll">
            <div className="flex flex-col rounded w-4/5 h-max gap-2 p-3 my-3 bg-white border-gray-300z border-2 overflow-scroll">
              <p className="w-full text-center text-xl font-semibold">
                Location
              </p>
              <div className="flex gap-3 items-center">
                <h1 className="w-1/3 md:w-1/5 lg:w-1/5 ">Small Address:</h1>{" "}
                <textarea
                  name="desc1"
                  value={modalData.desc1}
                  onChange={handleChange}
                  className="bg-gray-300  px-3 py-1 rounded w-full h-auto"
                />
              </div>
              <div className="flex gap-3 items-center">
                <h1 className="w-1/3 md:w-1/5 lg:w-1/5 ">Full Address:</h1>
                <textarea
                  name="desc2"
                  value={modalData.desc2}
                  onChange={handleChange}
                  className="bg-gray-300  px-3 py-1 rounded w-full h-auto"
                />
              </div>
              <div className=" flex flex-col gap-3">
                <div className="flex gap-3 items-center  ">
                  <h1 className="w-1/3 md:w-1/5 lg:w-1/5 ">
                    Google Map Places Link
                  </h1>{" "}
                  <textarea
                    name="gmapurl"
                    value={modalData.gmapurl}
                    onChange={handleChange}
                    className="bg-gray-300  px-3 py-1 rounded w-full h-auto"
                  />
                </div>
                <p className=" w-full text-center">
                  Example Google map places url :
                  <a
                    className=" text-blue-600 underline "
                    href="https://maps.app.goo.gl/8fenAeRK5RJ2LZLc8"
                  >
                    https://maps.app.goo.gl/8fenAeRK5RJ2LZLc8
                  </a>
                </p>
                <div className="flex flex-col gap-2 items-center sm:flex-row sm:items-center">
                  <p>Test the google map link here 👉🏻</p>
                  <a
                    href={modalData.gmapurl}
                    className="flex items-center bg-blue-200 p-1 rounded-md border-2 border-blue-400"
                    target="_blank"
                  >
                    <FontAwesomeIcon
                      className="text-red-600"
                      icon={faLocationDot}
                    />
                    <span className="ml-1 ">View on map</span>
                  </a>
                </div>
              </div>
              <div className=" flex flex-col gap-3">
                <div className="flex gap-3 items-center  ">
                  <h1 className="w-1/3 md:w-1/5 lg:w-1/5  ">
                    Google Map Embed
                  </h1>{" "}
                  <textarea
                    name="iframe"
                    value={modalData.iframe}
                    onChange={handleChange}
                    className="bg-gray-300  px-3 py-1 rounded w-full h-auto"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <p>Preview of the embed here 👉🏻</p>
                  <iframe
                    src={modalIframeUrl}
                    className="w-full"
                    // @ts-ignore
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
              <div className="buttons flex justify-end gap-3">
                <button
                  className="bg-red-700 p-2 rounded  hover:bg-red-500 transform active:scale-95 transition duration-300"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-sapblue-700 p-2 rounded  hover:bg-sapblue-900 transform active:scale-95 transition duration-300"
                  onClick={updateLocation}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
