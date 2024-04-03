import React, { useState } from "react";
import { EachHallSessionType, EachHallType } from "../../types/Hall.types";
import ToggleSwitch from "../toggleSwitch/toggleSwitch";
import BasicTimePicker from "./BasicTimePicker";
import { convert_IST_TimeString_To12HourFormat } from "../../utils/convert_IST_TimeString_To12HourFormat";

type Props = {
  sessions: EachHallSessionType[];
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

const HallSessions = ({ sessions, setHallData }: Props) => {
  const [newItem, setNewItem] = useState<EachHallSessionType>({
    name: "",
    active: false,
    to: "",
    from: "",
    price: [],
  });
  const [editIndex, setEditIndex] = useState<number>(-1);

  const handleAddItem = () => {
    console.log(newItem);
    if (newItem.name.trim() !== "" && newItem.to && newItem.from) {
      if (editIndex !== -1) {
        const updatedList = [...sessions];
        updatedList[editIndex] = newItem;
        setHallData((prev) => ({ ...prev, sessions: updatedList }));
        setEditIndex(-1);
      } else {
        setHallData((prev) => ({ ...prev, sessions: [...sessions, newItem] }));
      }
      setNewItem({
        name: "",
        _id: "random id here",
        active: false,
        to: "",
        from: "",
        price: [],
      });
    }
  };

  const handleEditItem = (index: number) => {
    setNewItem(sessions[index]);
    setEditIndex(index);
  };

  const handleDontEditItem = () => {
    setNewItem({
      name: "",
      active: false,
      to: "",
      from: "",
      price: [],
    });
    setEditIndex(-1);
  };

  const handleDeleteItem = (index: number) => {
    const updatedList = [...sessions];
    updatedList.splice(index, 1);
    setHallData((prev) => ({ ...prev, sessions: updatedList }));
    setEditIndex(-1);
  };

  return (
    <div className="about-hall flex justify-between bg-blue-100 w-[60%] md:w-[90%] lg:w-full py-5 px-7 rounded-lg">
      <div className="flex flex-col gap-3 mb-5 w-full">
        <h2 className="font-bold text-xl mb-3 text-center">
          Edit Hall Sessions
        </h2>
        <ul className="max-h-80 overflow-scroll">
          {sessions.map((eachSession, index) => (
            <div
              key={index}
              className={`flex flex-col items-center w-full mb-3 ${
                eachSession.active ? " " : "opacity-30"
              } border-y border-gray-300 px-2 gap-5`}
            >
              <div className={`flex items-center w-full gap-5`}>
                <div className="flex flex-col w-full">
                  {/* <div className="flex">
                            <span className=" text-xs">session id:</span>
                            <span className=" text-xs">{eachSession._id}</span>
                        </div> */}
                  <p className="font-medium text-lg">{eachSession.name}</p>
                  <div className="flex justify-between">
                    <div className="flex gap-2 bg-white rounded-md">
                      <span>From:</span>
                      <span className="">
                        {eachSession.from
                          ? convert_IST_TimeString_To12HourFormat(eachSession.from)
                          : "NAN"}
                      </span>
                    </div>
                    <div className="flex gap-2 bg-white px-2 rounded-md">
                      <span>To:</span>
                      <span className="">
                        {convert_IST_TimeString_To12HourFormat(eachSession.to)}
                        {/* {eachSession.to} asdasd */}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center sm:flex-row w-full gap-5">
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
              </div>
              <div className="flex flex-col items-center justify-center w-full">
                <div className="flex justify-evenly w-full text-sm font-semibold">
                  <span className="border border-gray-600 border-r-0 w-full text-center">
                    Category
                  </span>
                  <span className="border border-gray-600 w-full text-center">
                    Price
                  </span>
                </div>
                {eachSession.price.map((eachSessionPrice) => (
                  <div className="flex justify-evenly w-full text-sm">
                    <span className="border border-gray-600 border-r-0  w-full text-center">
                      {eachSessionPrice.categoryName}
                    </span>
                    <span className="border border-gray-600 w-full text-center">
                      {eachSessionPrice.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </ul>
        <div className="flex justify-between gap-2">
          <div className="flex flex-col w-full gap-2">
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="bg-gray-100 text-black px-5 py-3 rounded resize-none flex-grow border border-stone-300"
              placeholder="Name"
            />
            <div className="flex flex-col gap-2 justify-between sm:flex-row sm:gap-2">
              <BasicTimePicker
                timePickerName="From"
                timeModifier={(newTimeString) =>
                  setNewItem((prev) => ({
                    ...prev,
                    from: newTimeString,
                  }))
                }
              />
              <BasicTimePicker
                timePickerName="To"
                timeModifier={(newTimeString) =>
                  setNewItem((prev) => ({
                    ...prev,
                    to: newTimeString,
                  }))
                }
              />
            </div>
            <div className="flex gap-2">
              <span>is Active</span>
              <ToggleSwitch
                isToggled={newItem.active}
                toggle={() => {
                  setNewItem((prev) => ({
                    ...prev,
                    active: !prev.active,
                  }));
                }}
              />
            </div>
          </div>
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

export default HallSessions;
