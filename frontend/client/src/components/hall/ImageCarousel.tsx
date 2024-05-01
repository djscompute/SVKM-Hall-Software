import { useState } from "react";
import { EachHallType } from "../../types/Hall.types";

function ImageCarousel({ data }: { data: EachHallType }) {
  const [imageIndex, setImageIndex] = useState(0);

  return (
    <div className="w-full">
      <h2 className=" text-base sm:text-lg md:text-2xl font-medium mb-4">
        Photos
      </h2>
      <div className="flex flex-row gap-3 items-start h-[10em] sm:h-[15em] md:h-[20em] lg:h-[35em]">
        <div
          id="leftImageScroller"
          className="flex flex-col w-1/5 h-[10em] sm:h-[15em] md:h-[20em] lg:h-[35em] overflow-y-auto"
        >
          {data.images.map((eachImg, index) => (
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
        <div id="rightSelectedImage" className="h-full w-4/5 flex flex-col">
          <img
            alt={`Selected Image ${imageIndex + 1}`}
            className="w-full rounded-lg object-cover h-[10em] sm:h-[15em] md:h-[20em] lg:h-[35em]"
            src={data.images[imageIndex]}
          />
        </div>
      </div>
    </div>
  );
}

export default ImageCarousel;
