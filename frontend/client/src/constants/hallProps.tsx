import { EachHallType } from "../types/Hall.types";

const hallProps: EachHallType = {
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
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2620&q=80",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
    "https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2672&q=80",
    "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2253&q=80",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80",
  ],
};

export default hallProps;
