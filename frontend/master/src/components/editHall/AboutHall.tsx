import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
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
  const [newItem, setNewItem] = useState("");
  const [editIndex, setEditIndex] = useState(-1);

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

  const handleFormSubmit = () => {
    setModalData(aboutList);
    setHallData((prev) => ({
      ...prev,
      about: aboutList,
    }));
    toggleModal();
    setEditIndex(-1);
  };

  const handleAddItem = () => {
    if (newItem.trim() !== "") {
      if (editIndex !== -1) {
        const updatedList = [...aboutList];
        updatedList[editIndex] = newItem;
        setAboutList(updatedList);
        setEditIndex(-1);
      } else {
        setAboutList([...aboutList, newItem]);
      }
      setNewItem("");
    }
  };

  const handleEditItem = (index: number) => {
    setNewItem(aboutList[index]);
    setEditIndex(index);
  };

  const handleDontEditItem = () => {
    setEditIndex(-1);
    setNewItem("");
  };

  const handleDeleteItem = (index: number) => {
    const updatedList = [...aboutList];
    updatedList.splice(index, 1);
    setAboutList(updatedList);
    setEditIndex(-1);
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
            <div className="flex flex-col message bg-white p-6 rounded w-3/5 gap-2">
              <p className="w-full text-center text-xl font-semibold mb-2">
                About Venue
              </p>
              <div className="flex gap-3 items-center">
                <h1 className="w-1/3 md:w-1/5 lg:w-1/5 self-baseline">
                  About:
                </h1>{" "}
                <div className="flex flex-col w-full gap-3">
                  {modalData.map((about, index) => (
                     <textarea
                     key={index}
                     value={about}
                     onChange={(event) => handleChange(event, index)} 
                     rows={5}
                     className="bg-black text-white px-3 py-1 rounded w-full h-auto"
                   />
                  ))}
                </div>
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

        {/* {modal && (
          <div className="modal-message fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="message bg-white p-6 rounded w-3/5">
              <div className="flex flex-col gap-3 mb-5">
                <h2 className="font-bold text-xl mb-3 text-center">Location</h2>
                <ul className="max-h-80 overflow-scroll">
                  {aboutList.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between  border-b border-gray-300"
                    >
                      <span className="p-4">{item}</span>
                      <div className="flex flex-col gap-3 mb-5 sm:flex-row">
                        <button
                          className="bg-blue-700 p-2 rounded text-white hover:bg-blue-500 transform active:scale-95 transition duration-300"
                          onClick={() => handleEditItem(index)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-700 p-2 rounded text-white hover:bg-red-500 transform active:scale-95 transition duration-300"
                          onClick={() => handleDeleteItem(index)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2">
                  <textarea
                    // type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="bg-gray-300 text-black px-5 py-2 rounded resize-none flex-grow border-x-black"
                  />
                  {editIndex != -1 && (
                    <button
                      className="bg-red-700 p-2 rounded text-white hover:bg-green-500 transform active:scale-95 transition duration-300"
                      onClick={handleDontEditItem}
                    >
                      Dont Edit
                    </button>
                  )}
                  <button
                    className="bg-green-700 p-2 rounded text-white hover:bg-green-500 transform active:scale-95 transition duration-300"
                    onClick={handleAddItem}
                  >
                    {editIndex !== -1 ? "Update" : "Add"}
                  </button>
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
                  onClick={handleFormSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
