import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import {
  EachHallAdditonalFeaturesType,
  EachHallType,
} from "../../types/Hall.types";

type Props = {
  additionalFeatures: EachHallAdditonalFeaturesType[];
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

const HallAdditionalFeatures = ({ additionalFeatures, setHallData }: Props) => {
  const [modalData, setModalData] =
    useState<EachHallAdditonalFeaturesType[]>(additionalFeatures);
  const [modal, setModal] = useState(false);
  const [editedFeatures, setEditedFeatures] =
    useState<EachHallAdditonalFeaturesType[]>(modalData);
  const [newItem, setNewItem] = useState<EachHallAdditonalFeaturesType>({
    heading: "",
    desc: "",
    price: 0,
  });
  const [editIndex, setEditIndex] = useState<number>(-1);

  const toggleModal = () => {
    setEditedFeatures(modalData);
    setModal(!modal);
  };

  const handleFormSubmit = () => {
    setModalData(editedFeatures);
    setHallData((prev) => ({
      ...prev,
      additionalFeatures: editedFeatures,
    }));
    toggleModal();
    setEditIndex(-1);
  };

  const handleAddItem = () => {
    if (
      newItem.heading.trim() !== "" &&
      newItem.desc.trim() !== "" &&
      newItem.price >= 0
    ) {
      if (editIndex !== -1) {
        const updatedList = [...editedFeatures];
        updatedList[editIndex] = newItem;
        setEditedFeatures(updatedList);
        setEditIndex(-1);
      } else {
        setEditedFeatures([...editedFeatures, newItem]);
      }
      setNewItem({ heading: "", desc: "", price: 0 });
    }
  };

  const handleEditItem = (index: number) => {
    setNewItem(editedFeatures[index]);
    setEditIndex(index);
  };

  const handleDontEditItem = () => {
    setNewItem({ heading: "", desc: "", price: 0 });
    setEditIndex(-1);
  };

  const handleDeleteItem = (index: number) => {
    const updatedList = [...editedFeatures];
    updatedList.splice(index, 1);
    setEditedFeatures(updatedList);
    setEditIndex(-1);
  };

  return (
    <div className="about-hall flex justify-between bg-blue-100 w-[80%] md:w-[90%] lg:w-full py-5 px-7 rounded-lg">
      <div className="hall-additional-features-info w-11/12">
        <h2 className="font-bold text-xl mb-3">Additional Features</h2>
        <div className="about-hall text-lg">
          {additionalFeatures.map((feature, index) => (
            <div key={index} className="flex flex-col mb-3">
              <p className="font-medium text-lg">{feature.heading}</p>
              <p>{feature.desc}</p>
              <p>Rs. {feature.price}</p>
            </div>
          ))}
        </div>
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
                <h2 className="font-bold text-xl mb-3 text-center">
                  Additional Features
                </h2>
                <ul className="max-h-80 overflow-scroll">
                  {editedFeatures.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between mb-1 border-b border-gray-300"
                    >
                      <div className="flex flex-col w-full gap-1 sm:flex-row">
                        <span className=" font-semibold">{item.heading}</span>
                        <span className="">{item.desc}</span>
                        <span className="">Rs. {item.price}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
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
                <div className="flex flex-col gap-2 sm:flex-row">
                  <textarea
                    value={newItem.heading}
                    onChange={(e) =>
                      setNewItem({ ...newItem, heading: e.target.value })
                    }
                    className="bg-gray-300 text-black px-5 py-2 rounded resize-none flex-grow border-x-black"
                    placeholder="Heading"
                  />
                  <textarea
                    value={newItem.desc}
                    onChange={(e) =>
                      setNewItem({ ...newItem, desc: e.target.value })
                    }
                    className="bg-gray-300 text-black px-5 py-2 rounded resize-none flex-grow border-x-black"
                    placeholder="Description"
                  />
                  <textarea
                    required
                    value={newItem.price}
                    onChange={(e) =>
                      setNewItem({ ...newItem, price: Number(e.target.value) })
                    }
                    className="bg-gray-300 text-black px-5 py-2 rounded resize-none flex-grow border-x-black"
                    placeholder="Price"
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
        )}
      </div>
    </div>
  );
};

export default HallAdditionalFeatures;
