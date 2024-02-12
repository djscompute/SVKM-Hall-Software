import React from "react";
import Carousel from "./Carousel";

const images = [
    "https://www.bjp.org/files/photo-gallery/bjp-national-president-shri-amit-shah-addressing-meeting-of-eminent-citizens-and-intellectuals-at-bj-hall-mumbai-5-20170618-1528260118.jpg",
    "https://media.weddingz.in/images/3700f1779bd2f3bfab9d03c76c8f6c48/babubhai-jagjivandas-hall-babubhai-jagjivandas-hall-3.jpg",
    "https://images.venuebookingz.com/22130-1678439447-wm-babubhai-jagjivandas-hall-mumbai-1.jpg",
]

export default function ImageCarousel() {
  return (
    <div className="image-carousel relative overflow-hidden rounded-xl">
        <div className="images-image-carousel h-4/5 w-[calc(100% - 516px)]">
            <Carousel>
                {
                    images.map((image, index) => <img key={index} src={image} className="h-full w-full object-cover rounded-xl" />)
                }
            </Carousel>
        </div>
    </div>
  )
}
