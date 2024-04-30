import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare,  faTrash } from "@fortawesome/free-solid-svg-icons"; // Importing faTrash for the delete button
import { EachHallType } from "../../types/Hall.types";

type Props = {
  data: EachHallType;
  about: string[];
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function AboutHall({ data, about, setHallData }: Props) {
  const [modalData, setModalData] = useState<string[]>(about);
  const [modal, setModal] = useState(false);
  const [aboutList, setAboutList] = useState<string[]>(modalData);

  const toggleModal = () => {
    setAboutList(modalData);
    setModal(!modal);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const { value } = event.target;
    const updatedModalData = [...modalData];
    updatedModalData[index] = value;
    setModalData(updatedModalData);
  };

  const updateAbout = () => {
    setHallData((prev) => ({
      ...prev,
      about: modalData,
    }));
    toggleModal();
  };

  const addEmptyArray = () => {
    setModalData([...modalData, ""]); 
  };

  const deleteAbout = (index: number) => {
    const updatedModalData = [...modalData];
    updatedModalData.splice(index, 1); 
    setModalData(updatedModalData);
  };

  return (
    <div className="about-hall w-[80%] md:w-[90%] lg:w-full py-5 px-7 rounded-md">
      <div className="flex justify-between">
        <h1 className="text-base sm:text-lg md:text-2xl font-medium">
          About Venue
        </h1>
        <div className="show-on-hover cursor-pointer opacity-100 hover:opacity-100">
          <FontAwesomeIcon
            icon={faPenToSquare}
            className="show-on-hover h-6 cursor-pointer opacity-50 hover:opacity-100"
            onClick={toggleModal}
          />
        </div>
      </div>
      <div className="ml-8 mt-1">
        <ul className="list-disc text-gray-600">
          {data.about.map((about, index) => (
            <li key={index}>{about}</li>
          ))}
        </ul>
      </div>

      <div className="hall-info-edit h-fit relative">
        {modal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 h-screen overflow-y-auto">
            <div className="flex flex-col message bg-white p-6 rounded w-4/5 md:w-3/5 gap-2">
              <p className="w-full text-center text-xl font-semibold mb-2">
                About Venue
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <h1 className="w-1/3 md:w-1/5 lg:w-1/5 self-baseline">
                  About:
                </h1>{" "}
                <div className="flex flex-col w-full gap-3">
                  {modalData.map((about, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <textarea
                        value={about}
                        onChange={(event) => handleChange(event, index)}
                        rows={5}
                        className="bg-black text-white px-3 py-1 rounded w-full h-auto"
                      />
                      <button
                        onClick={() => deleteAbout(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                  
                </div>
                <button
                    onClick={addEmptyArray}
                    className=" w-fit mx-auto bg-green-500 px-3 py-2 rounded-xl"
                  >
                    Add
                  </button>
              </div>
              <div className="buttons flex justify-end gap-3 mt-20">
                <button
                  className="bg-red-700 p-2 rounded text-white hover:bg-red-500 transform active:scale-95 transition duration-300"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-sapblue-700 p-2 rounded text-white hover:bg-sapblue-900 transform active:scale-95 transition duration-300"
                  onClick={updateAbout}
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
