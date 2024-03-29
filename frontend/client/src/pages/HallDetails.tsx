import React, { useState } from "react";
import HallLocation from "../components/hallDetails/HallLocation";
import { EachHallLocationType, EachHallType } from "../../../../types/global";
import AboutHall from "../components/hallDetails/AboutHall";
import HallCapacity from "../components/hallDetails/HallCapacity";
import HallPricing from "../components/hallDetails/HallPricing";
import HallSessions from "../components/hallDetails/HallSessions";
import HallAdditionalFeatures from "../components/hallDetails/HallAdditionalFeatures";
import ImageCarousel from "../components/hallDetails/ImageCarousel";

// Dummy Hall data
const DummyHallInfo: EachHallType = {
  _id: "1",
  name: "DJ Hall",
  location: {
    _id: "120912309",
    desc1: "Juhu, Mumbai",
    desc2:
      "Babubhai Jagjivandas Hall, 1, N S Rd Number 3, Navpada, JVPD Scheme, Vile Parle West, Mumbai, Maharashtra 400056. Babubhai Jagjivandas Hall, 1, N S Rd Number 3, Navpada, JVPD Scheme, Vile Parle West, Mumbai, Maharashtra 400056",
    gmapurl: "https://maps.app.goo.gl/8fenAeRK5RJ2LZLc8",
    iframe: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.006039443071!2d72.83461397510128!3d19.107390982103663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c676018b43%3A0x75f29a4205098f99!2sSVKM&#39;s%20Dwarkadas%20J.%20Sanghvi%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1708336595862!5m2!1sen!2sin`,
  },
  about: [
    "Babubhai Jagjivandas Hall, Juhu, Mumbai is a lovely venue to host your wedding and reception ceremony. It is located near the Prithvi Theatre and a close distance from Vile Parle Station which makes it easily accessible for all to reach there. Babubhai Jagjivandas Mumbai, Maharashtra serves scrumptious pure vegetarian food to their guests.",
    "The decor team takes care of the decoration for your big day. Babubhai Jagjivandas Hall has a lush green lawn that can accommodate a huge crowd for an open-air outdoor evening reception. It also has a banquet hall for having an indoor wedding or reception ceremony.",
    "BJ Hall Vile Parle has an inviting ambiance which makes everyone feel welcomed. The elegant décor of the venue makes it an ideal option for a grand wedding. Host your events at BJ Hall Mumbai to make them outstanding. Ticking all the right boxes, this one must certainly be on your cards.",
  ],
  capacity: "500 people",
  seating: "100 seats",
  pricing: "200 per day",
  additionalFeatures: [
    {
      _id: "asdasdasd212",
      heading: "Gorgeous Ambience",
      desc: " We have got a very good ambience",
    },
    {
      _id: "asdasdasdadwerw23",
      heading: "In-house decorators",
      desc: "In-house decorators make the venue more stunning",
    },
  ],
  sessions: [
    {
      _id: "12390812nlkas",
      active: true,
      name: "Morning first session",
      from: "3:40:00.000Z",
      to: "20:30:00.000Z",
      price: [
        {
          categoryName: "Student",
          price: 2000,
        },
        {
          categoryName: "Politician",
          price: 4000,
        },
      ],
    },
    {
      _id: "asdouijlqw918209",
      active: true,
      name: "Morning 7 hours",
      from: "3:40:00.000Z",
      to: "20:30:00.000Z",
      price: [
        {
          categoryName: "Student",
          price: 2000,
        },
        {
          categoryName: "Politician",
          price: 4000,
        },
      ],
    },
  ],
  images: [
    "https://img.weddingbazaar.com/shaadisaga_production/photos/pictures/006/353/648/new_large/ss20230327-3861-13nkp45.jpg",
    "https://media.weddingz.in/images/3700f1779bd2f3bfab9d03c76c8f6c48/babubhai-jagjivandas-hall-babubhai-jagjivandas-hall-3.jpg",
    "https://images.venuebookingz.com/22130-1678439447-wm-babubhai-jagjivandas-hall-mumbai-1.jpg",
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

type ParentComponentProps = {
  // Define any props needed for the parent component
};

const ParentComponent: React.FC<ParentComponentProps> = () => {
  
  const [hallData, setHallData] = useState<EachHallType>(DummyHallInfo);

//   const updateHallData = (newData: EachHallType) => {
//     setHallData(newData);
//   };

  
type props = {
    images: string[];
    setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

return (
    <div>
        <p className=" flex justify-center text-6xl text-red-500 font-bold">WELCOME TO SCAM</p>
        <HallLocation location={hallData.location} />
        <AboutHall about={hallData.about} />
        <HallCapacity capacity={hallData.capacity} seating={hallData.seating} />
        <HallPricing pricing={hallData.pricing} />
        <HallSessions sessions={hallData.sessions} />
        <HallAdditionalFeatures additionalFeatures={hallData.additionalFeatures || []} />
        <ImageCarousel images={hallData.images} setHallData={setHallData} />
    </div>
);
};

export default ParentComponent;
