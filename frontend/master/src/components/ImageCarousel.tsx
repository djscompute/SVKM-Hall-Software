import React from "react";
// import Carousel from "./Carousel";
import { EachHallType } from "../types/Hall.types";

type props = {
  images: string[];
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function ImageCarousel({ images }: props) {
  return (
    <div className="flex flex-col items-center w-full rounded-xl">
      {/* <Carousel>
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              className="h-full w-full object-cover rounded-xl"
            />
          ))}
        </Carousel> */}
      <p className=" text-xl font-semibold">IMAGES</p>
      <div className="flex flex-col items-center w-full mb-20">
        {images.map((image, index) => (
          <div className=" relative w-1/2">
            <img
              key={index}
              src={image}
              className=" h-auto w-full m-1 object-cover rounded-xl"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
