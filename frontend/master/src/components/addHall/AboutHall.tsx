import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { EachHallLocationType, EachHallType } from "../../types/Hall.types";

type Props = {
  about: string[];
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function AboutHall({ about, setHallData }: Props) {
  const [newItem, setNewItem] = useState("");
  const [editIndex, setEditIndex] = useState(-1);

  // const toggleModal = () => {
  //   setAboutList(modalData);
  // };

  // const handleFormSubmit = () => {
  //   setModalData(aboutList);
  //   setHallData((prev) => ({
  //     ...prev,
  //     about: aboutList,
  //   }));
  //   toggleModal();
  //   setEditIndex(-1);
  // };

  const handleAddItem = () => {
    if (newItem.trim() !== "") {
      const updatedList = [...about];
      if (editIndex !== -1) {
        updatedList[editIndex] = newItem;
        setHallData((prev) => ({ ...prev, about: updatedList }));
        setEditIndex(-1);
      } else {
        setHallData((prev) => ({ ...prev, about: [...updatedList, newItem] }));
      }
      setNewItem("");
    }
  };

  const handleEditItem = (index: number) => {
    setNewItem(about[index]);
    setEditIndex(index);
  };

  const handleDontEditItem = () => {
    setEditIndex(-1);
    setNewItem("");
  };

  const handleDeleteItem = (index: number) => {
    const updatedList = [...about];
    updatedList.splice(index, 1);
    setHallData((prev) => ({ ...prev, about: updatedList }));
    setEditIndex(-1);
  };

  return (
    <div className="about-hall flex justify-between bg-blue-100 w-full py-5 px-7 rounded-md">
      <div className="flex flex-col w-full gap-3 mb-5">
        <h2 className="font-bold text-xl mb-3 text-center">About</h2>
        <ul className="max-h-80 overflow-scroll">
          {about.map((item, index) => (
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
    </div>
  );
}
