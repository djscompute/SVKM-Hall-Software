import { EachHallType } from "../types/Hall.types";

const dummyHallData: EachHallType[] = [
  {
    _id: "hall001",
    name: "Grand Conference Center",
    person: "John Doe",
    contactName: "John Doe",  
    contactEmail: "john.doe@example.com",  
    location: {
      desc1: "GCC",
      desc2: "12345 Conference Blvd, Event City, EC 54321",
      gmapurl: "https://maps.google.com/?q=location",
      iframe: "<iframe src='https://maps.google.com/?q=location'></iframe>",
    },
    about: [
      "The Grand Conference Center is ideal for corporate events and large gatherings, featuring state-of-the-art facilities.",
      "Equipped with modern audio-visual technology and comfortable seating."
    ],
    capacity: "Up to 2000 attendees",
    additionalFeatures: [
      {
        _id: "feat001",
        heading: "High-Speed Internet",
        desc: "Wi-Fi access throughout the venue to keep everyone connected.",
        stats: ["1000 Mbps speed", "Unlimited devices"],
        price: 0  // Assuming free Wi-Fi service
      },
      {
        _id: "feat002",
        heading: "Catering Services",
        desc: "Full-service catering available to meet all dietary requirements.",
        price: 50  // Pricing per attendee
      }
    ],
    images: [
      "https://example.com/images/hall1.jpg",
      "https://example.com/images/hall2.jpg"
    ],
    sessions: [
      {
        _id: "sess001",
        active: true,
        name: "Morning Session",
        from: "9:00 AM",
        to: "12:00 PM",
        price: [
          { categoryName: "Standard", price: 100 },
          { categoryName: "VIP", price: 200 }
        ]
      },
      {
        _id: "sess002",
        active: true,
        name: "Afternoon Session",
        from: "1:00 PM",
        to: "5:00 PM",
        price: [
          { categoryName: "Standard", price: 150 },
          { categoryName: "VIP", price: 250 }
        ]
      }
    ],
    eventRestrictions: "No outside food or drink, No pets",
    securityDeposit: 500,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "hall002",
    name: "Urban Art Gallery",
    person: "Jane Smith",
    contactName: "Jane Smith",  
    contactEmail: "jane.smith@example.com",   
    location: {
      desc1: "UAG",
      desc2: "67890 Art St, Culture District, CD 67890",
      gmapurl: "https://maps.google.com/?q=location",
      iframe: "<iframe src='https://maps.google.com/?q=location'></iframe>",
    },
    about: [
      "Our Urban Art Gallery offers a unique setting for events surrounded by contemporary art exhibitions.",
      "Perfect for receptions, workshops, and small concerts."
    ],
    capacity: "500 guests",
    additionalFeatures: [
      {
        _id: "feat003",
        heading: "Audio Equipment",
        desc: "High-quality sound systems for music and speeches.",
        stats: ["PA system", "Microphones"],
        price: 75
      },
      {
        _id: "feat004",
        heading: "Event Planning Services",
        desc: "Professional event planners to assist in organizing your perfect event.",
        price: 200
      }
    ],
    images: [
      "https://example.com/images/gallery1.jpg",
      "https://example.com/images/gallery2.jpg"
    ],
    sessions: [
      {
        _id: "sess003",
        active: false,
        name: "Evening Gathering",
        from: "6:00 PM",
        to: "9:00 PM",
        price: [
          { categoryName: "General", price: 120 },
          { categoryName: "Premium", price: 240 }
        ]
      }
    ],
    eventRestrictions: "No flash photography, No large bags",
    securityDeposit: 300,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export default dummyHallData;
