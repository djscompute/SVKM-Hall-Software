import React, { useState } from "react";
import {
  EachHallAdditonalFeaturesType,
  EachHallType,
} from "../../types/Hall.types";

type Props = {
  additionalFeatures: EachHallAdditonalFeaturesType[];
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

const HallAdditionalFeatures = ({ additionalFeatures, setHallData }: Props) => {
  const [newItem, setNewItem] = useState<EachHallAdditonalFeaturesType>({
    heading: "",
    desc: "",
    price: 0,
  });
  const [editIndex, setEditIndex] = useState<number>(-1);

  const handleAddItem = () => {
    if (newItem.heading.trim() !== "" && newItem.desc.trim() !== "") {
      if (editIndex !== -1) {
        const updatedList = [...additionalFeatures];
        updatedList[editIndex] = newItem;
        setHallData((prev) => ({ ...prev, additionalFeatures: updatedList }));
        setEditIndex(-1);
      } else {
        setHallData((prev) => ({
          ...prev,
          additionalFeatures: [...additionalFeatures, newItem],
        }));
      }
      setNewItem({ _id: "", heading: "", desc: "", price: 0 });
    }
  };

  const handleEditItem = (index: number) => {
    setNewItem(additionalFeatures[index]);
    setEditIndex(index);
  };

  const handleDontEditItem = () => {
    setNewItem({ _id: "", heading: "", desc: "", price: 0 });
    setEditIndex(-1);
  };

  const handleDeleteItem = (index: number) => {
    const updatedList = [...additionalFeatures];
    updatedList.splice(index, 1);
    setHallData((prev) => ({ ...prev, additionalFeatures: updatedList }));
    setEditIndex(-1);
  };

  return (
    <div className="about-hall flex justify-between bg-gray-100 w-[60%] md:w-[90%] lg:w-full py-5 px-7 rounded-lg">
      <div className="flex flex-col gap-3 mb-5 w-full">
        <h2 className="font-semibold text-xl mb-3 text-center">
          Additional Features
        </h2>
        <ul className="max-h-80 overflow-scroll">
          {additionalFeatures.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between mb-1 border-b border-gray-300"
            >
              <div className="flex flex-col w-full gap-1">
                <span className=" font-semibold">{item.heading}</span>
                <span className="">{item.desc}</span>
                <span className="">{item.price}</span>
              </div>
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
        <div className="flex gap-2">
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
            onChange={(e) => setNewItem({ ...newItem, desc: e.target.value })}
            className="bg-gray-300 text-black px-5 py-2 rounded resize-none flex-grow border-x-black"
            placeholder="Description"
          />
          <textarea
            value={newItem.price}
            onChange={(e) =>
              setNewItem({ ...newItem, price: Number(e.target.value) })
            }
            className="bg-gray-300 text-black px-5 py-2 rounded resize-none flex-grow border-x-black"
            placeholder="Heading"
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
};

export default HallAdditionalFeatures;
