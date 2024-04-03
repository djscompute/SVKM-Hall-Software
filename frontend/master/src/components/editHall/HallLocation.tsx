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
    <div className="hall-location flex justify-between bg-blue-100 w-full py-5 px-7 rounded-lg">
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
      {/* <EditComponent /> */}
      <div className="hall-info-edit h-fit relative">
        <FontAwesomeIcon
          icon={faPenToSquare}
          className="show-on-hover h-6 cursor-pointer opacity-50 hover:opacity-100"
          onClick={toggleModal}
        />
        {modal && (
          <div className="modal-message fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="flex flex-col message bg-white p-6 rounded w-3/5 gap-2">
              <p className="w-full text-center text-xl font-semibold mb-2">
                Location
              </p>
              <div className="flex gap-3 items-center">
                <h1 className="w-1/5 ">Small Address:</h1>{" "}
                <textarea
                  name="desc1"
                  value={modalData.desc1}
                  onChange={handleChange}
                  className="bg-black text-white px-3 py-1 rounded w-full h-auto"
                />
              </div>
              <div className="flex gap-3 items-center">
                <h1 className="w-1/5 ">Full Address:</h1>
                <textarea
                  name="desc2"
                  value={modalData.desc2}
                  onChange={handleChange}
                  className="bg-black text-white px-3 py-1 rounded w-full h-auto"
                />
              </div>
              <div className=" flex flex-col">
                <div className="flex gap-3 items-center  ">
                  <h1 className="w-1/5 ">Google Map Places Link</h1>{" "}
                  <textarea
                    name="gmapurl"
                    value={modalData.gmapurl}
                    onChange={handleChange}
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
              <div className=" flex flex-col">
                <div className="flex gap-3 items-center  ">
                  <h1 className="w-1/5 ">Google Map Embed</h1>{" "}
                  <textarea
                    name="iframe"
                    value={modalData.iframe}
                    onChange={handleChange}
                    className="bg-black text-white px-3 py-1 rounded w-full h-auto"
                  />
                </div>
                <div className=" flex gap-2 items-center mt-2">
                  <p>Preview of the embed here 👉🏻</p>
                  {/* <div
                    dangerouslySetInnerHTML={{
                      __html: modalData.iframe as string,
                    }}
                  ></div> */}
                  <iframe
                    src={modalIframeUrl}
                    width="400"
                    height="200"
                    // @ts-ignore
                    allowFullScreen=""
                    // @ts-ignore
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
              <div className="buttons flex justify-end gap-3 mt-5">
                <button
                  className="bg-red-700 p-2 rounded text-white hover:bg-red-500 transform active:scale-95 transition duration-300"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-sapblue-700 p-2 rounded text-white hover:bg-sapblue-900 transform active:scale-95 transition duration-300"
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
