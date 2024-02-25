import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { EachHallLocationType, EachHallType } from "../../types/Hall.types";

type Props = {
  about: string[];
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function AboutHall({ about, setHallData }: Props) {
  const [modalData, setModalData] = useState<string[]>(about);
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [aboutList, setAboutList] = useState<string[]>(modalData);
  const [newItem, setNewItem] = useState("");
  const [editIndex, setEditIndex] = useState(-1);

  const toggleReadMore = () => setIsOpen(!isOpen);

  const toggleModal = () => {
    setAboutList(modalData);
    setModal(!modal);
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
    <div className="about-hall flex justify-between bg-blue-100 w-full py-5 px-7 rounded-md">
      <div className="about-hall-info w-11/12">
        <h2 className=" font-bold text-xl mb-3">About this venue</h2>
        <div
          className={`flex flex-col text-lg ${
            isOpen ? "" : " h-24 overflow-hidden"
          }`}
        >
          {about.map((eachPara, index) => (
            <span key={index} className="my-2">
              {eachPara}
            </span>
          ))}
        </div>
        {!isOpen ? (
          <button
            onClick={toggleReadMore}
            className="read-more-btn text-gray-700 font-semibold text-lg"
          >
            Read More
          </button>
        ) : (
          <button
            onClick={toggleReadMore}
            className="read-less-btn text-gray-700 font-semibold text-lg"
          >
            Read Less
          </button>
        )}
      </div>
      <div className="hall-info-edit h-fit relative">
        <div className="show-on-hover cursor-pointer opacity-100 hover:opacity-100">
          <FontAwesomeIcon
            icon={faPenToSquare}
            className="show-on-hover h-6 cursor-pointer opacity-50 hover:opacity-100"
            onClick={toggleModal}
          />
        </div>
        {modal && (
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
                      <div className="flex gap-2">
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
                  className="bg-SAPBlue-700 p-2 rounded text-white hover:bg-SAPBlue-900 transform active:scale-95 transition duration-300"
                  onClick={handleFormSubmit}
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
