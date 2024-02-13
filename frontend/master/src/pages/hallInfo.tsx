import HallLocation from "../components/HallLocation";
import AboutHall from "../components/AboutHall";
import HallSlotInfo from "../components/HallSlotInfo";
import HallCapacity from "../components/HallCapacity";
import HallPricing from "../components/HallPricing";
import HallAdditionalFeatures from "../components/HallAdditionalFeatures";
import ImageCarousel from "../components/ImageCarousel";
import { useState } from "react";
import { EachHallType } from "../types/Hall.types";

const DummyHallInfo: EachHallType = {
  location: {
    desc1: "Juhu, Mumbai",
    desc2:
      "Babubhai Jagjivandas Hall, 1, N S Rd Number 3, Navpada, JVPD Scheme, Vile Parle West, Mumbai, Maharashtra 400056",
    gmapurl:
      "https://www.google.com/maps/place/Babubhai+Jagjivandas+Hall/@19.1076374,72.8345266,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7c9c6505a00af:0x13b8ff72726ae189!8m2!3d19.1076374!4d72.8371015!16s%2Fg%2F1hc20xyks?entry=ttu",
    iframe: "iframe gmap component here",
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
  partyArea: [
    {
      areaName: "Hall1",
      capacity: 750,
      seating: 500,
    },
    {
      areaName: "Hall2",
      capacity: 1000,
      seating: 750,
    },
  ],
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
};

export default function hallInfo() {
  const [hallData, setHallData] = useState<EachHallType>(DummyHallInfo);
  return (
    <div className="hall-info-container grid place-items-center gap-y-12 mx-auto w-11/12 pt-10 overflow-y-hidden">
      <h1 className="text-5xl">Babubhai Jagjivandas Hall</h1>
      <HallLocation location={hallData.location} setHallData={setHallData} />
      <AboutHall about={hallData.about} setHallData={setHallData} />
      <HallSlotInfo timing={hallData.timings} setHallData={setHallData} />
      <HallCapacity partyArea={hallData.partyArea} setHallData={setHallData} />
      <HallPricing pricing={hallData.pricing} setHallData={setHallData} />
      <HallAdditionalFeatures
        additionalFeatures={hallData.additionalFeatures}
        setHallData={setHallData}
      />
      <ImageCarousel images={hallData.images} setHallData={setHallData} />
    </div>
  );
}
