// import EditComponent from "./EditComponent";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { EachHallLocationType, EachHallType } from "../types/Hall.types";

type props = {
  location: EachHallLocationType;
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function HallLocation({ location, setHallData }: props) {

  const [modalData, setModalData] = useState<EachHallLocationType>(location);
  const [ modal, setModal ] = useState<boolean>(false);

  const toggleModal = () => setModal(!modal);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setModalData(( prev ) => ({
      ...prev,
      [ name ]: value
    }));
  };

  const updateLocation = () => {
    setHallData( (prev) => ({
      ...prev,
      location: modalData
    }));
    toggleModal();
  };
  return (
    <div className="hall-location flex justify-between bg-SAPBlue-300 w-full py-5 px-7 rounded-lg">
      <div className="hall-location-main-info w-11/12">
        <h2 className="font-bold text-xl mb-3">Location</h2>
        <div className="hall-location-map flex items-center gap-5">
          <h2 className="hall-location-small text-lg">{location.desc1}</h2>
          {location.gmapurl && (
            <span className="map-location">
              <FontAwesomeIcon className="text-red-600" icon={faLocationDot} />
              <a
                href={location.gmapurl}
                className="ml-1 text-gray-700"
                target="_blank"
              >
                View on map
              </a>
            </span>
          )}
        </div>
        <h2 className="hall-location-big text-lg">{location.desc2}</h2>
      </div>
      {/* <EditComponent /> */}
      <div className="hall-info-edit h-fit relative">
        <FontAwesomeIcon
          icon={faPenToSquare}
          className="show-on-hover h-6 cursor-pointer opacity-50 hover:opacity-100"
          onClick={toggleModal}
        />
        { modal &&
          (<div className="modal-message fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
              <div className="message bg-white p-6 rounded w-3/5">
                <div className="flex gap-3 items-center mb-5">
                  <h1 className="w-20 ">Main:</h1> {" "}
                  <input 
                    type="text"
                    name="desc1"
                    value={modalData.desc1}
                    onChange={handleChange}
                    className="bg-black text-white px-3 py-1 rounded w-full"
                  />
                </div>   
                <div className="flex gap-3 items-center">
                  <h1 className="w-20">Address:</h1> 
                  <input 
                    type="text"
                    name="desc2"
                    value={modalData.desc2}
                    onChange={handleChange}
                    className="bg-black text-white px-3 py-1 rounded w-full"
                  />
                </div>      
                <div className="buttons flex justify-end gap-3 mt-5">
                  <button className="bg-red-700 p-2 rounded text-white hover:bg-red-500 transform active:scale-95 transition duration-300" onClick={toggleModal}>Cancel</button>
                  <button className="bg-SAPBlue-700 p-2 rounded text-white hover:bg-SAPBlue-900 transform active:scale-95 transition duration-300" 
                  onClick={updateLocation}>Submit</button>  
                </div>    
              </div>
          </div>)
        }
      </div>
    </div>
  );
}
