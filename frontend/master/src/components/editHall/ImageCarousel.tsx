import React, { useState } from "react";
import { EachHallType } from "../../types/Hall.types";
import axiosInstance from "../../config/axiosInstance";
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

  const handleImageUpload = async () => {
    if (!newImage) return;
    try {
      const formData = new FormData();
      formData.append("image", newImage);
      const response = await axiosInstance.post(
        "http://localhost:3000/uploadImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // toast.promise(Promise.resolve(response.status === 200), {
      //   pending: "Uploading your image...",
      //   success: "Image uploaded succesfully",
      //   error: "Failed to upload image",
      // });
      const { imageUrl } = response.data;
      setHallData((prev) => ({ ...prev, images: [...prev.images, imageUrl] }));
      // setNewImage(null);
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
                className="w-full bg-red-500 text-xl text-white rounded-bl-xl py-1 border-2 border-black"
                onClick={() => deleteImage(imageSrc)}
              >
                Del
              </button>
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
        {/* Image upload */}
        <div
          className="relative w-1/2 my-2 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center"
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
