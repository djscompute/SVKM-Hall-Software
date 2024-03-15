import HallLocation from "../components/editHall/HallLocation";
import AboutHall from "../components/editHall/AboutHall";
import HallCapacity from "../components/editHall/HallCapacity";
import HallPricing from "../components/editHall/HallPricing";
import HallAdditionalFeatures from "../components/editHall/HallAdditionalFeatures";
import ImageCarousel from "../components/editHall/ImageCarousel";
import { useState } from "react";
import { EachHallType } from "../types/Hall.types";
import "../styles/hallInfo.css";
import HallSessions from "../components/editHall/HallSessions";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axiosInstance";
import { useParams } from "react-router-dom";
import { queryClient } from "../App";

import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

// const DummyHallInfo: EachHallType = {
//   _id: "1",
//   name: "DJ Hall",
//   location: {
//     _id: "120912309",
//     desc1: "Juhu, Mumbai",
//     desc2:
//       "Babubhai Jagjivandas Hall, 1, N S Rd Number 3, Navpada, JVPD Scheme, Vile Parle West, Mumbai, Maharashtra 400056. Babubhai Jagjivandas Hall, 1, N S Rd Number 3, Navpada, JVPD Scheme, Vile Parle West, Mumbai, Maharashtra 400056",
//     gmapurl: "https://maps.app.goo.gl/8fenAeRK5RJ2LZLc8",
//     iframe: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.006039443071!2d72.83461397510128!3d19.107390982103663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c676018b43%3A0x75f29a4205098f99!2sSVKM&#39;s%20Dwarkadas%20J.%20Sanghvi%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1708336595862!5m2!1sen!2sin`,
//     // `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.006039443071!2d72.83461397510128!3d19.107390982103663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c676018b43%3A0x75f29a4205098f99!2sSVKM&#39;s%20Dwarkadas%20J.%20Sanghvi%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1708336595862!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>`,
//   },
//   about: [
//     "Babubhai Jagjivandas Hall, Juhu, Mumbai is a lovely venue to host your wedding and reception ceremony. It is located near the Prithvi Theatre and a close distance from Vile Parle Station which makes it easily accessible for all to reach there. Babubhai Jagjivandas Mumbai, Maharashtra serves scrumptious pure vegetarian food to their guests.",
//     "The decor team takes care of the decoration for your big day. Babubhai Jagjivandas Hall has a lush green lawn that can accommodate a huge crowd for an open-air outdoor evening reception. It also has a banquet hall for having an indoor wedding or reception ceremony.",
//     "BJ Hall Vile Parle has an inviting ambiance which makes everyone feel welcomed. The elegant décor of the venue makes it an ideal option for a grand wedding. Host your events at BJ Hall Mumbai to make them outstanding. Ticking all the right boxes, this one must certainly be on your cards.",
//   ],
//   capacity: "500 people",
//   seating: "100 seats",
//   pricing: "200 per day",
//   additionalFeatures: [
//     {
//       _id: "asdasdasd212",
//       heading: "Gorgeous Ambience",
//       desc: " We have got a very good ambience",
//     },
//     {
//       _id: "asdasdasdadwerw23",
//       heading: "In-house decorators",
//       desc: "In-house decorators make the venue more stunning",
//     },
//   ],
//   sessions: [
//     {
//       _id: "12390812nlkas",
//       active: true,
//       name: "Morning first session",
//       from: "3:40:00.000Z",
//       to: "20:30:00.000Z",
//       price: [
//         {
//           categoryName: "Student",
//           price: 2000,
//         },
//         {
//           categoryName: "Politician",
//           price: 4000,
//         },
//       ],
//     },
//     {
//       _id: "asdouijlqw918209",
//       active: true,
//       name: "Morning 7 hours",
//       from: "3:40:00.000Z",
//       to: "20:30:00.000Z",
//       price: [
//         {
//           categoryName: "Student",
//           price: 2000,
//         },
//         {
//           categoryName: "Politician",
//           price: 4000,
//         },
//       ],
//     },
//   ],
//   images: [
//     "https://img.weddingbazaar.com/shaadisaga_production/photos/pictures/006/353/648/new_large/ss20230327-3861-13nkp45.jpg",
//     "https://media.weddingz.in/images/3700f1779bd2f3bfab9d03c76c8f6c48/babubhai-jagjivandas-hall-babubhai-jagjivandas-hall-3.jpg",
//     "https://images.venuebookingz.com/22130-1678439447-wm-babubhai-jagjivandas-hall-mumbai-1.jpg",
//   ],
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

export default function EditHall() {
  let { id: HallID } = useParams();

  const [hallData, setHallData] = useState<EachHallType | undefined>(undefined);

  const [toastShown, setToastShown] = useState(false)


  const {
    data: databaseHallData,
    // error,
    // isFetching,
    // status,
  } = useQuery({
    queryKey: [`getHall/${HallID}`],
    queryFn: async () => {
      try{
      console.log("FETCHING");
      const response = await axiosInstance.get(`getHall/${HallID}`);

      const promise = new Promise((resolve) => setTimeout(resolve, 1000)); 
      if(!toastShown) //Toast message to appear only once
      {
        toast.promise(
          promise,
          {
            pending: 'Fetching hall...', 
            success: 'Hall fetched successfully!', 
            error: 'Failed to fetch Hall. Please try again.', 
          }
        );
        setToastShown(true)
        
      }

      setHallData(response.data);
      return response.data as EachHallType;
      }catch(error){
        if(!toastShown){  
          setToastShown(true)
          console.log(toastShown)
          toast.error('Failed to fetch Halls. Please try again.');
          }
          
          throw error;
        
      }
    },
  });

  const editHallMutation = useMutation({
    mutationFn: async () => {
      console.log(hallData);
      const response = await axiosInstance.post(
        `/editHall/${HallID}`,
        hallData
      );
      console.log(response.data);
    },
    onSuccess: async () => {
      console.log("REVALIDATING");
      // do a hot toast here
      await queryClient.refetchQueries({
        queryKey: [`getHall/${HallID}`],
      });
    },
    onError: (error) => {
      console.log(error);
      // show the below line in react hot toast
      // @ts-ignore
      console.log(error.response.data.issues[0].message);
    },
  });

  return (
    <div className="hall-info-container grid place-items-center gap-y-12 mx-auto w-11/12 pt-10 overflow-y-hidden">
 <ToastContainer position="top-right"/>
      {databaseHallData && hallData && (
        <>
          <div className="flex flex-col items-center">
            <p className="text-blue-700 font-semibold">Edit</p>
            <input
              className="text-5xl text-center border border-gray-400"
              value={hallData.name}
              onChange={(e) =>{                
                setHallData((prev) => {
                  if (prev) return { ...prev, name: e.target.value };
                })
                
              }
              }
            />
          </div>
          {JSON.stringify(databaseHallData) !== JSON.stringify(hallData) && (
            <div className="flex flex-col items-center gap-3">
              <p>Confirm the changes you just made</p>
              <div className="flex gap-5">
                <button
                  className=" bg-green-500 p-1 px-2 rounded-md text-xl font-semibold text-white"
                  onClick={() => {editHallMutation.mutate()
                    toast("Changes updated successfully")
                  }}
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
          <HallLocation
            location={hallData.location}
            setHallData={
              setHallData as React.Dispatch<React.SetStateAction<EachHallType>>
            }
          />
          <AboutHall
            about={hallData.about}
            setHallData={
              setHallData as React.Dispatch<React.SetStateAction<EachHallType>>
            }
          />
          <HallCapacity
            capacity={hallData.capacity}
            seating={hallData.seating}
            setHallData={
              setHallData as React.Dispatch<React.SetStateAction<EachHallType>>
            }
          />
          <HallPricing
            pricing={hallData.pricing}
            setHallData={
              setHallData as React.Dispatch<React.SetStateAction<EachHallType>>
            }
          />
          <HallSessions
            sessions={hallData.sessions}
            setHallData={
              setHallData as React.Dispatch<React.SetStateAction<EachHallType>>
            }
          />
          {hallData.additionalFeatures && (
            <HallAdditionalFeatures
              additionalFeatures={hallData.additionalFeatures}
              setHallData={
                setHallData as React.Dispatch<
                  React.SetStateAction<EachHallType>
                >
              }
            />
          )}
          <ImageCarousel
            images={hallData.images}
            setHallData={
              setHallData as React.Dispatch<React.SetStateAction<EachHallType>>
            }
          />
        </>
      )}
    </div>
  );
}
