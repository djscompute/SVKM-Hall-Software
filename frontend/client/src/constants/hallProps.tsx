import { EachHallType } from "../types/Hall.types";

const hallProps: EachHallType[] = [
  {
    _id: "123",
    name: "BJ Hall",
    location: {
      desc1: "1, N S Rd Number 3, Navpada, JVPD Scheme",
      desc2: "Vile Parle West, Mumbai, Maharashtra 400056",
      iframe:
        "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15080.001689782257!2d72.8371015!3d19.1076374!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c6505a00af%3A0x13b8ff72726ae189!2sBabubhai%20Jagjivandas%20Hall!5e0!3m2!1sen!2sin!4v1707924301059!5m2!1sen!2sin",
    },
    about: ["Welcome to our hall!"],
    timings: { from: "9am", to: "10pm" },
    partyArea: [
      {
        areaName: "Main Hall",
        capacity: 200,
        seating: 150,
      },
      {
        areaName: "Lounge",
        capacity: 50,
        seating: 30,
      },
    ],
    pricing: undefined,
    additionalFeatures: [
      {
        heading: "Projector",
        desc: "We provide projector for presentations.",
      },
      {
        heading: "Catering",
        desc: "We offer catering services.",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1543325768-b7c960228a24?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGFydHklMjBoYWxsfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1620735692151-26a7e0748429?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1542665952-14513db15293?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
  },
  {
    _id: "456",
    name: "NMIMS Hall",
    location: {
      desc1: "1, N S Rd Number 3, Navpada, JVPD Scheme",
      desc2: "Vile Parle West, Mumbai, Maharashtra 400056",
      iframe:
        "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15080.001689782257!2d72.8371015!3d19.1076374!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c6505a00af%3A0x13b8ff72726ae189!2sBabubhai%20Jagjivandas%20Hall!5e0!3m2!1sen!2sin!4v1707924301059!5m2!1sen!2sin",
    },
    about: ["Welcome to our hall!"],
    timings: { from: "9am", to: "10pm" },
    partyArea: [
      {
        areaName: "Main Hall",
        capacity: 200,
        seating: 150,
      },
      {
        areaName: "Lounge",
        capacity: 50,
        seating: 30,
      },
    ],
    pricing: undefined,
    additionalFeatures: [
      {
        heading: "Projector",
        desc: "We provide projector for presentations.",
      },
      {
        heading: "Catering",
        desc: "We offer catering services.",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1543325768-b7c960228a24?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGFydHklMjBoYWxsfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1620735692151-26a7e0748429?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1542665952-14513db15293?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
  },
];

export default hallProps;
