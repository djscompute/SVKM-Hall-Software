import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import arrowList from "../../assets/arrowList.svg";

import {
  EachHallAdditonalFeaturesType,
  EachHallType,
} from "../../types/Hall.types";

type Props = {
  data: EachHallType;
  additionalFeatures: EachHallAdditonalFeaturesType[];
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

const HallAdditionalFeatures = ({
  data,
  additionalFeatures,
  setHallData,
}: Props) => {
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

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = event.target;
    const updatedFeatures = editedFeatures.map((feature, i) => {
      if (i === index) {
        return {
          ...feature,
          [name]: value,
        };
      }
      return feature;
    });
    setEditedFeatures(updatedFeatures);
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
    <div className="about-hall w-[80%] md:w-[90%] lg:w-full py-5 px-7 rounded-md">
      <div className="flex justify-between">
        <h1 className="text-base sm:text-lg md:text-2xl font-medium">
          Additional Features
        </h1>
        <div className="show-on-hover cursor-pointer opacity-100 hover:opacity-100">
          <FontAwesomeIcon
            icon={faPenToSquare}
            className="show-on-hover h-6 cursor-pointer opacity-50 hover:opacity-100"
            onClick={toggleModal}
          />
        </div>
      </div>

      {/* Additional Features */}
      <div className="flex flex-col gap-3 w-full">
        <div className="ml-8 mt-1">
          <ul className="list-disc text-gray-600">
            {data.additionalFeatures?.map((feature, index) => (
              <div key={index}>
                <div className="flex">
                  <img
                    src={arrowList}
                    alt="arrow"
                    className="self-baseline translate-y-[40%] mr-2"
                  />
                  <div className="">
                    {feature.desc}
                    <br />
                    <span className="text-[#5AA7A0] font-semibold">
                      Price: ₹{feature.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
      {/* Additional Features */}

      <div className="hall-info-edit h-fit relative">
        {modal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 h-screen overflow-y-auto">
            <div className="flex flex-col message bg-white p-6 rounded w-4/5 md:w-3/5 lg:w-2/5 gap-2">
              <p className="w-full text-center text-xl font-semibold mb-2">
                Additional Features
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                {additionalFeatures.map((feature, index) => (
                  <div className="flex flex-col gap-2 w-full" key={index}>
                    <h1 className="w-full text-center">
                      Additional Feature {index + 1}
                    </h1>
                    <div className="flex gap-2">
                      <div className="w-[150px]">
                        <h1 className="self-baseline">Heading:</h1>{" "}
                      </div>
                      <textarea
                        name="heading"
                        value={feature.heading}
                        rows={1}
                        onChange={(e) => handleChange(e, index)}
                        className="bg-black text-white px-3 py-1 w-[400px] rounded  h-auto  mx-auto sm:mx-0"
                      />
                    </div>

                    <div className="flex gap-2">
                      <div className="w-[150px] ">
                        <h1 className="self-baseline">Description:</h1>{" "}
                      </div>
                      <textarea
                        name="desc"
                        value={feature.desc}
                        rows={6}
                        onChange={(e) => handleChange(e, index)}
                        className="bg-black text-white px-3 py-1 w-[400px] rounded  h-auto  mx-auto sm:mx-0"
                      />
                    </div>

                    <div className="flex gap-2">
                      <div className="w-[150px] ">
                        <h1 className="self-baseline">Price:</h1>{" "}
                      </div>
                      <textarea
                        name="price"
                        value={feature.price}
                        rows={1}
                        onChange={(e) => handleChange(e, index)}
                        className="bg-black text-white px-3 py-1 w-[400px] rounded  h-auto  mx-auto sm:mx-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="buttons flex justify-end gap-3 mt-10">
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
