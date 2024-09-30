import React, { useState } from "react";
import { EachHallType } from "../../types/Hall.types";
import axiosMasterInstance from "../../config/axiosMasterInstance";
import { toast } from "react-toastify";

type props = {
  images: string[];
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

export default function ImageCarousel({ images, setHallData }: props) {
  const deleteImage = (imgSrc: string) => {
    setHallData((prev) => {
      return {
        ...prev,
        images: prev.images.filter((eachSrc) => eachSrc != imgSrc),
      };
    });
  };

  // ImageHandler
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  const handleImageUpload = async () => {
    if (!newImage) return;
    try {
      const formData = new FormData();
      formData.append("image", newImage);
      const responsePromise = axiosMasterInstance.post(
        "http://localhost:3000/uploadImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.promise(responsePromise, {
        pending: "Uploading your image...",
        success: "Image uploaded succesfully",
        error: "Failed to upload image",
      });
      const response = await responsePromise;
      const { imageUrl } = response.data;
      setHallData((prev) => ({ ...prev, images: [...prev.images, imageUrl] }));
      setNewImage(null);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setNewImage(file || null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setNewImage(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

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
      <div className="flex flex-col justify-center items-center w-full mb-20 gap-5 ">
        {/* Image Display */}
        <div className="w-full">
          <h2 className=" text-base sm:text-lg md:text-2xl font-medium mb-4">
            Photos
          </h2>
          <div className="flex flex-row gap-3 items-start h-[10em] sm:h-[15em] md:h-[20em] lg:h-[35em]">
            <div
              id="leftImageScroller"
              className="flex flex-col w-1/5 h-[10em] sm:h-[15em] md:h-[20em] lg:h-[35em] overflow-y-auto"
            >
              {images.map((eachImg, index) => (
                <img
                  key={index}
                  alt={`Hall Image ${index + 1}`}
                  className={`mb-2 h-auto rounded-lg object-cover ${
                    imageIndex != index && "opacity-50"
                  }`}
                  src={eachImg}
                  onClick={() => setImageIndex(index)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
            <div className="flex flex-col relative rounded-lg object-cover w-4/5 h-[10em] sm:h-[15em] md:h-[20em] lg:h-[35em]">
              <p className="absolute top-0 z-10 bg-gray-600 text-white text-2xl p-1 px-2 rounded-xl ">
                {imageIndex + 1}
              </p>
              <img
                key={imageIndex}
                src={images[imageIndex]}
                className="h-full object-cover rounded-t-xl"
              />
              <div className="flex justify-evenly">
                <button
                  className="w-full bg-red-500 text-xl text-white rounded-bl-xl py-1 border-2 border-black"
                  onClick={() => deleteImage(images[imageIndex])}
                >
                  Del
                </button>
                <button
                  className={`w-full  ${
                    imageIndex == 0 ? "bg-gray-400" : "bg-blue-500"
                  } text-xl text-white  py-1  border-y-2 border-black`}
                  onClick={() => updatePosition(images[imageIndex], false)}
                  disabled={imageIndex == 0}
                >
                  Up
                </button>
                <button
                  className={`w-full  ${
                    imageIndex == images.length - 1
                      ? "bg-gray-400"
                      : "bg-blue-500"
                  } text-xl text-white  py-1 rounded-br-xl border-2 border-black`}
                  onClick={() => updatePosition(images[imageIndex], true)}
                  disabled={imageIndex == images.length - 1}
                >
                  Down
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Image upload */}
        <div
          className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-400 rounded-lg z-20"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <label
            htmlFor="fileInput"
            className="cursor-pointer w-full h-full text-center p-6"
          >
            <span className="border-2 p-3 block w-3/4 mx-auto my-5">
              Choose or drag image here
            </span>
            {/* Display the path of the uploaded image */}
            {newImage && (
              <p className="text-sm text-gray-600 my-4 mt-[-15px] ">
                {newImage.name}
              </p>
            )}
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              className={`px-4 py-2  text-white rounded  focus:outline-none ${
                !newImage ? "bg-gray-400" : ""
              }  ${newImage ? "bg-sapblue-800 hover:bg-sapblue-900" : ""}`}
              onClick={handleImageUpload}
              disabled={!newImage}
            >
              Upload
            </button>
          </label>
        </div>
        {!images && <p>NO IMAGES</p>}
      </div>
    </div>
  );
}
