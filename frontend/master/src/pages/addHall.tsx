import { useEffect, useState } from "react";
import { EachHallType } from "../types/Hall.types";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../config/axiosInstance";
import HallLocation from "../components/addHall/HallLocation";
import AboutHall from "../components/addHall/AboutHall";
import HallCapacity from "../components/addHall/HallCapacity";
import HallSessions from "../components/addHall/HallSessions";
import HallAdditionalFeatures from "../components/addHall/HallAdditionalFeatures";
import ImageCarousel from "../components/addHall/ImageCarousel";
import { queryClient } from "../App";
import HallRestrictions from "../components/addHall/HallRestrictions";
import HallPricing from "../components/addHall/HallPricing";

function AddHall() {
  const [hallData, setHallData] = useState<EachHallType>({
    name: "HALL NAME",
    person: "Someone",
    location: {
      desc1: "Juhu, Mumbai",
      desc2:
        "Babubhai Jagjivandas Hall, 1, N S Rd Number 3, Navpada, JVPD Scheme, Vile Parle West, Mumbai, Maharashtra 400056. Babubhai Jagjivandas Hall, 1, N S Rd Number 3, Navpada, JVPD Scheme, Vile Parle West, Mumbai, Maharashtra 400056",
      gmapurl: "https://maps.app.goo.gl/8fenAeRK5RJ2LZLc8",
      iframe: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.006039443071!2d72.83461397510128!3d19.107390982103663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c676018b43%3A0x75f29a4205098f99!2sSVKM&#39;s%20Dwarkadas%20J.%20Sanghvi%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1708336595862!5m2!1sen!2sin`,
      // `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.006039443071!2d72.83461397510128!3d19.107390982103663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c676018b43%3A0x75f29a4205098f99!2sSVKM&#39;s%20Dwarkadas%20J.%20Sanghvi%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1708336595862!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>`,
    },
    about: [
      "Babubhai Jagjivandas Hall, Juhu, Mumbai is a lovely venue to host your wedding and reception ceremony. It is located near the Prithvi Theatre and a close distance from Vile Parle Station which makes it easily accessible for all to reach there. Babubhai Jagjivandas Mumbai, Maharashtra serves scrumptious pure vegetarian food to their guests.",
      "The decor team takes care of the decoration for your big day. Babubhai Jagjivandas Hall has a lush green lawn that can accommodate a huge crowd for an open-air outdoor evening reception. It also has a banquet hall for having an indoor wedding or reception ceremony.",
      "BJ Hall Vile Parle has an inviting ambiance which makes everyone feel welcomed. The elegant décor of the venue makes it an ideal option for a grand wedding. Host your events at BJ Hall Mumbai to make them outstanding. Ticking all the right boxes, this one must certainly be on your cards.",
    ],
    capacity: "500 people",
    additionalFeatures: [
      {
        heading: "Dining Area",
        desc: "We have a dinign area with exceptional ambience.",
        price: 0,
      },
    ],
    sessions: [
      {
        active: true,
        name: "Morning First session",
        from: "8:00:00",
        to: "12:00:00",
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
        active: true,
        name: "Afternoon Session",
        from: "13:00:00",
        to: "17:00:00",
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
        active: true,
        name: "Night Session",
        from: "18:00:00",
        to: "22:00:00",
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
    ],
    eventRestrictions: "Sleeping",
  });

  const addHallMutation = useMutation({
    mutationFn: () =>
      axiosInstance
        .post(`/addHall`, hallData)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        }),
    mutationKey: ["addhall"],
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [`allhalls`],
      });
    },
  });

  const createNewHall = () => {
    // send to /edit hall to update the data
    console.log(hallData);
    addHallMutation.mutate();
  };

  return (
    <div className="hall-info-container justify-center grid place-items-center gap-y-12 mx-auto w-auto lg:w-11/12 pt-10 overflow-y-hidden">
      <div className="flex flex-col items-center">
        <p className="text-blue-700 font-semibold">Add New Hall</p>
        <input
          value={hallData.name}
          onChange={(e) =>
            setHallData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="text-3xl md:text-4xl lg:text-5xl text-center border border-gray-400"
        />
      </div>
      <HallLocation location={hallData.location} setHallData={setHallData} />
      <AboutHall about={hallData.about} setHallData={setHallData} />
      <HallCapacity capacity={hallData.capacity} setHallData={setHallData} />
      <HallRestrictions
        eventRestrictions={hallData.eventRestrictions}
        setHallData={setHallData}
      />
      <HallSessions sessions={hallData.sessions} setHallData={setHallData} />
      <HallPricing sessions={hallData.sessions} setHallData={setHallData} />
      {hallData.additionalFeatures && (
        <HallAdditionalFeatures
          additionalFeatures={hallData.additionalFeatures}
          setHallData={setHallData}
        />
      )}
      <ImageCarousel images={hallData.images} setHallData={setHallData} />
      <div className="flex mb-20">
        <button
          className=" bg-blue-400 active:bg-blue-600 px-3 py-2 rounded-md border-2 border-blue-600"
          onClick={createNewHall}
        >
          CREATE
        </button>
      </div>
    </div>
  );
}

export default AddHall;
