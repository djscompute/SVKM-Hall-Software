import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { EachHallSessionType, EachHallType } from "../../types/Hall.types";
import ToggleSwitch from "../toggleSwitch/toggleSwitch";
import BasicTimePicker from "./BasicTimePicker";
import { convert_IST_TimeString_To12HourFormat } from "../../utils/convert_IST_TimeString_To12HourFormat";
// convert_IST_TimeString_To12HourFormat
type Props = {
  sessions: EachHallSessionType[];
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

const HallSessions = ({ sessions, setHallData }: Props) => {
  const [modalData, setModalData] = useState<EachHallSessionType[]>(sessions);
  const [modal, setModal] = useState(false);
  const [editedSessions, setEditedSessions] =
    useState<EachHallSessionType[]>(modalData);
  const [newItem, setNewItem] = useState<EachHallSessionType>({
    name: "",
    active: false,
    to: "",
    from: "",
    price: [],
  });
  const [editIndex, setEditIndex] = useState<number>(-1);

  const toggleModal = () => {
    setEditedSessions(modalData);
    setModal(!modal);
  };

  const handleFormSubmit = () => {
    setModalData(editedSessions);
    setHallData((prev) => ({
      ...prev,
      sessions: editedSessions,
    }));
    toggleModal();
    setEditIndex(-1);
  };

  const handleAddItem = () => {
    if (newItem.name.trim() !== "" && newItem.to && newItem.from) {
      if (editIndex !== -1) {
        const updatedList = [...editedSessions];
        updatedList[editIndex] = newItem;
        setEditedSessions(updatedList);
        setEditIndex(-1);
      } else {
        setEditedSessions([...editedSessions, newItem]);
      }
      setNewItem({
        name: "",
        active: false,
        to: "",
        from: "",
        price: [],
      });
    }
  };

  const handleEditItem = (index: number) => {
    setNewItem(editedSessions[index]);
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
    const updatedList = [...editedSessions];
    updatedList.splice(index, 1);
    setEditedSessions(updatedList);
    setEditIndex(-1);
  };

  const handleAddPrice = () => {
    if (newItem.price.length < 5) {
      // Limit the number of prices to add
      setNewItem((prev) => ({
        ...prev,
        price: [...prev.price, { categoryName: "", price: 0 }],
      }));
    }
  };

  const handleEditPrice = (index: number) => {
    // Implement the logic to edit the price at the specified index
    // You can set the edited price to newItem or use a separate state for editing
  };

  const handleDeletePrice = (index: number) => {
    setNewItem((prev) => ({
      ...prev,
      price: prev.price.filter((_, i) => i !== index),
    }));
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;

    setNewItem((prev) => {
      const updatedPrices = [...prev.price];
      if (name == "price") {
        updatedPrices[index] = {
          ...updatedPrices[index],
          [name]: parseInt(value),
        };
      } else {
        updatedPrices[index] = {
          ...updatedPrices[index],
          [name]: value,
        };
      }

      return {
        ...prev,
        price: updatedPrices,
      };
    });
  };

  return (
    <div className="about-hall flex justify-between bg-blue-100 w-full py-5 px-7 rounded-lg">
      <div className="hall-additional-features-info w-11/12">
        <h2 className="font-bold text-xl mb-3">Hall Sessions</h2>
        <div className="about-hall text-lg">
          {sessions.map((eachSession, index) => (
            <div key={index} className="flex flex-col mb-3">
              <p className="font-medium text-lg">{eachSession.name}</p>
              <div className="flex justify-between">
                <div className="flex gap-2 bg-white px-2 rounded-md">
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
                  </span>
                </div>
              </div>
              <div className=" mt-2 mb-3">
                {eachSession.price.map((eachSessionPrice, index) => (
                  <div
                    className="flex justify-evenly w-full"
                    key={index}
                  >
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
            <div className="message bg-white p-6 max-h-screen rounded w-3/5">
              <div className="flex flex-col gap-3 mb-5">
                <h2 className="font-bold text-xl mb-3 text-center">
                  Edit Hall Sessions
                </h2>
                <ul className="max-h-80 overflow-scroll">
                  {editedSessions.map((eachSession, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center w-full mb-3 ${
                        eachSession.active ? " " : "opacity-100"
                      } border-y border-gray-300 px-2 gap-5`}
                    >
                      <div className="flex items-center w-full gap-5">
                        <div className="flex flex-col w-full">
                          <p className="font-medium text-lg">
                            {eachSession.name}
                          </p>
                          <div className="flex justify-between">
                            <div className="flex gap-2 bg-white rounded-md">
                              <span>From:</span>
                              <span className="">
                                {eachSession.from
                                  ? convert_IST_TimeString_To12HourFormat(
                                      eachSession.from
                                    )
                                  : "NAN"}
                              </span>
                            </div>
                            <div className="flex gap-2 bg-white px-2 rounded-md">
                              <span>To:</span>
                              <span className="">
                                {convert_IST_TimeString_To12HourFormat(eachSession.to)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center justify-evenly">
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
                        {eachSession.price.map((eachSessionPrice, index) => (
                          <div
                            className="flex justify-evenly w-full text-sm"
                            key={index}
                          >
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
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                      className="bg-gray-100 text-black px-5 py-3 rounded resize-none flex-grow border border-stone-300"
                      placeholder="Name"
                    />
                    <div className="flex justify-between gap-2">
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
                    <div className="flex flex-col gap-2">
                      {newItem.price.map((priceItem, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            name="categoryName"
                            value={priceItem.categoryName}
                            onChange={(e) => handlePriceChange(e, index)}
                            className="bg-gray-100 text-black px-5 py-3 rounded resize-none flex-grow border border-stone-300"
                            placeholder="Category"
                          />

                          <input
                            type="number"
                            name="price"
                            value={priceItem.price}
                            onChange={(e) => handlePriceChange(e, index)}
                            className="bg-gray-100 text-black px-5 py-3 rounded resize-none flex-grow border border-stone-300"
                            placeholder="Price"
                          />
                          <button
                            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none"
                            onClick={() => handleDeletePrice(index)}
                          >
                            -
                          </button>
                        </div>
                      ))}
                      <button
                        className="bg-green-300 text-white p-2 rounded-md hover:bg-green-400 focus:outline-none"
                        onClick={handleAddPrice}
                      >
                        +
                      </button>
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
                  {editIndex !== -1 && (
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
};

export default HallSessions;