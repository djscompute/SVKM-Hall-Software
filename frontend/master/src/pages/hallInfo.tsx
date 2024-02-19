import HallLocation from "../components/hallInfo/HallLocation";
import AboutHall from "../components/hallInfo/AboutHall";
import HallSlotInfo from "../components/hallInfo/HallSlotInfo";
import HallCapacity from "../components/hallInfo/HallCapacity";
import HallPricing from "../components/hallInfo/HallPricing";
import HallAdditionalFeatures from "../components/hallInfo/HallAdditionalFeatures";
import ImageCarousel from "../components/hallInfo/ImageCarousel";
import { useState } from "react";
import { EachHallType } from "../types/Hall.types";
import "../styles/hallInfo.css";

const DummyHallInfo: EachHallType = {
  _id: "1",
  name: "DJ Hall",
  location: {
    desc1: "Juhu, Mumbai",
    desc2:
      "Babubhai Jagjivandas Hall, 1, N S Rd Number 3, Navpada, JVPD Scheme, Vile Parle West, Mumbai, Maharashtra 400056. Babubhai Jagjivandas Hall, 1, N S Rd Number 3, Navpada, JVPD Scheme, Vile Parle West, Mumbai, Maharashtra 400056",
    gmapurl: "https://maps.app.goo.gl/8fenAeRK5RJ2LZLc8",
    iframe: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.006039443071!2d72.83461397510128!3d19.107390982103663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c676018b43%3A0x75f29a4205098f99!2sSVKM&#39;s%20Dwarkadas%20J.%20Sanghvi%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1708336595862!5m2!1sen!2sin`,
    // `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.006039443071!2d72.83461397510128!3d19.107390982103663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c676018b43%3A0x75f29a4205098f99!2sSVKM&#39;s%20Dwarkadas%20J.%20Sanghvi%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1708336595862!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`,
  },
  about: [
    "Babubhai Jagjivandas Hall, Juhu, Mumbai is a lovely venue to host your wedding and reception ceremony. It is located near the Prithvi Theatre and a close distance from Vile Parle Station which makes it easily accessible for all to reach there. Babubhai Jagjivandas Mumbai, Maharashtra serves scrumptious pure vegetarian food to their guests.",
    "The decor team takes care of the decoration for your big day. Babubhai Jagjivandas Hall has a lush green lawn that can accommodate a huge crowd for an open-air outdoor evening reception. It also has a banquet hall for having an indoor wedding or reception ceremony.",
    "BJ Hall Vile Parle has an inviting ambiance which makes everyone feel welcomed. The elegant décor of the venue makes it an ideal option for a grand wedding. Host your events at BJ Hall Mumbai to make them outstanding. Ticking all the right boxes, this one must certainly be on your cards.",
  ],
  timings: {
    from: "11:00 AM",
    to: "11:00 PM",
  },
  capacity: "500",
  seating: "100",
  pricing: 200,
  additionalFeatures: [
    {
      heading: "Gorgeous Ambience",
      desc: " We have got a very good ambience",
    },
    {
      heading: "In-house decorators",
      desc: "In-house decorators make the venue more stunning",
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

export default function hallInfo() {
  // do not update this state.
  // this state is here to maintain the unupdated version of the hall in the database and compare to our local updated version.
  const [databaseHallData, setDatabaseHallData] =
    useState<EachHallType>(DummyHallInfo);
  const [hallData, setHallData] = useState<EachHallType>(DummyHallInfo);

  const updateHallData = () => {
    // send to /edit hall to update the data
  };
  return (
    <div className="hall-info-container grid place-items-center gap-y-12 mx-auto w-11/12 pt-10 overflow-y-hidden">
      <div className="flex flex-col items-center">
        <p className="text-blue-700 font-semibold">Edit</p>
        <h1 className="text-5xl">{hallData.name}</h1>
      </div>
      {databaseHallData != hallData && (
        <div className="flex flex-col items-center gap-3">
          <p>Confirm the changes you just made</p>
          <div className="flex gap-5">
            <button
              className=" bg-green-500 p-1 px-2 rounded-md text-xl font-semibold text-white"
              onClick={updateHallData}
            >
              Confirm
            </button>
            <button
              className=" bg-red-500 p-1 px-2 rounded-md text-xl font-semibold text-white"
              onClick={() => {
                setHallData(databaseHallData);
              }}
            >
              Discard
            </button>
          </div>
        </div>
      )}
      <HallLocation location={hallData.location} setHallData={setHallData} />
      <AboutHall about={hallData.about} setHallData={setHallData} />
      <HallSlotInfo timing={hallData.timings} setHallData={setHallData} />
      <HallCapacity
        capacity={hallData.capacity}
        seating={hallData.seating}
        setHallData={setHallData}
      />
      <HallPricing pricing={hallData.pricing} setHallData={setHallData} />
      <HallAdditionalFeatures
        additionalFeatures={hallData.additionalFeatures}
        setHallData={setHallData}
      />
      <ImageCarousel images={hallData.images} setHallData={setHallData} />
    </div>
  );
}
