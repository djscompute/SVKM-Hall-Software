import React, { useState } from "react";
// import Carousel from "./Carousel";
import { EachHallType } from "../../types/Hall.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axiosInstance from "../../config/axiosInstance";

type props = {
  images: string[];
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function ImageCarousel({ images, setHallData }: props) {
// ImageHandler

  function updatePosition(str: string, increment: boolean) {
    setHallData((prev) => {
      const index = prev.images.indexOf(str);
      if (index !== -1) {
        const newPosition = increment
          ? Math.min(index + 1, prev.images.length - 1)
          : Math.max(index - 1, 0);
        const newArray = [...prev.images];
        const temp = newArray[index];
        newArray[index] = newArray[newPosition];
        newArray[newPosition] = temp;
        return { ...prev, images: newArray };
      }
      return { ...prev };
    });
  }

  return (
    <div className="flex flex-col items-center w-full rounded-xl">
      <p className=" text-xl font-semibold">IMAGES</p>
      <div className="flex flex-col items-center w-full mb-20">
        {images.map((imageSrc, index) => (
          <div className=" relative w-1/2 my-2">
            <p className="absolute top-0 z-10 bg-gray-600 text-white text-2xl p-1 px-2 rounded-xl">
              {index}
            </p>
            <img
              key={index}
              src={imageSrc}
              className=" h-auto w-full object-cover rounded-t-xl"
            />
            <div className="flex justify-evenly">
            
              <button
                className={`w-full  ${
                  index == 0 ? "bg-gray-400" : "bg-blue-500"
                } text-xl text-white  py-1  border-y-2 border-black`}
                onClick={() => updatePosition(imageSrc, false)}
                disabled={index == 0}
              >
                Up
              </button>
              <button
                className={`w-full  ${
                  index == images.length - 1 ? "bg-gray-400" : "bg-blue-500"
                } text-xl text-white  py-1 rounded-br-xl border-2 border-black`}
                onClick={() => updatePosition(imageSrc, true)}
                disabled={index == images.length - 1}
              >
                Down
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
