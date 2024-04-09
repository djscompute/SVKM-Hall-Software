import React from 'react';

interface AddHalltoManagerProps {
  selectedHallIds: string[];
  onHallSelect: (id: string) => void;
  onClearSelectedHalls: () => void;
  onAddedHallsChange: (addedItems: string[]) => void; // Callback function to update added items
}

const AddHalltoManager: React.FC<AddHalltoManagerProps> = ({
  selectedHallIds,
  onHallSelect,
  onClearSelectedHalls,
  onAddedHallsChange,
}) => {
    
  const dummyItems = [
    {
      "_id": "65f0b5f8d07e42db1abb8cb4",
      "name": "Bhagubhai Hall",
      "location": {
        "desc1": "Vile Parle West , Mumbai - 400056",
        "desc2": "Babubhai Jagjivandas Hall, 1, N S Rd Number 3, Navpada, JVPD Scheme, Vile Parle West, Mumbai, Maharashtra 400056. Babubhai Jagjivandas Hall, 1, N S Rd Number 3, Navpada, JVPD Scheme, Vile Parle West, Mumbai, Maharashtra 400056",
        "gmapurl": "https://maps.app.goo.gl/8fenAeRK5RJ2LZLc8",
        "iframe": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.006039443071!2d72.83461397510128!3d19.107390982103663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c676018b43%3A0x75f29a4205098f99!2sSVKM&#39;s%20Dwarkadas%20J.%20Sanghvi%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1708336595862!5m2!1sen!2sin",
        "_id": "65f0b5f8d07e42db1abb8cb5"
      },
      "about": [
        "Babubhai Jagjivandas Hall, Juhu, Mumbai is a lovely venue to host your wedding and reception ceremony. It is located near the Prithvi Theatre and a close distance from Vile Parle Station which makes it easily accessible for all to reach there. Babubhai Jagjivandas Mumbai, Maharashtra serves scrumptious pure vegetarian food to their guests.",
        "The decor team takes care of the decoration for your big day. Babubhai Jagjivandas Hall has a lush green lawn that can accommodate a huge crowd for an open-air outdoor evening reception. It also has a banquet hall for having an indoor wedding or reception ceremony.",
        "BJ Hall Vile Parle has an inviting ambiance which makes everyone feel welcomed. The elegant décor of the venue makes it an ideal option for a grand wedding. Host your events at BJ Hall Mumbai to make them outstanding. Ticking all the right boxes, this one must certainly be on your cards."
      ],
      "capacity": "1000",
      "seating": "2000",
      "pricing": "10000",
      "additionalFeatures": [
        {
          "heading": "Full Hall with dining area",
          "desc": " We have got a very good ambience",
          "stats": [],
          "price": 10000,
          "_id": "65f0b5f8d07e42db1abb8cb6"
        },
        {
          "heading": "Half Hall",
          "desc": "dining area will not be provided",
          "stats": [],
          "price": 5000,
          "_id": "65f0b5f8d07e42db1abb8cb7"
        }
      ],
      "images": [
        "http://res.cloudinary.com/dltkrwiau/image/upload/v1711732511/v1xh2powlnpjt0oc7egx.jpg",
        "http://res.cloudinary.com/dltkrwiau/image/upload/v1712562788/xe4vstfdr0rzgqc8l7uk.jpg",
        "http://res.cloudinary.com/dltkrwiau/image/upload/v1712588314/z5wd3xxgw7kw1b86syps.jpg"
      ],
      "sessions": [
        {
          "active": true,
          "name": "Morning First session",
          "from": "07:00:00",
          "to": "14:00:00",
          "price": [
            {
              "categoryName": "InterInstitute",
              "price": 200000,
              "_id": "65f0b5f8d07e42db1abb8cb9"
            },
            {
              "categoryName": "specialrate",
              "price": 25000,
              "_id": "65f0b5f8d07e42db1abb8cba"
            }
          ],
          "_id": "65f0b5f8d07e42db1abb8cb8"
        },
        {
          "active": true,
          "name": "Evening Session",
          "from": "16:00:00",
          "to": "23:00:00",
          "price": [
            {
              "categoryName": "InterInstitute",
              "price": 200000,
              "_id": "65f0b5f8d07e42db1abb8cbc"
            },
            {
              "categoryName": "specialrate",
              "price": 25000,
              "_id": "65f0b5f8d07e42db1abb8cbd"
            }
          ],
          "_id": "65f0b5f8d07e42db1abb8cbb"
        },
        {
          "active": true,
          "name": "FULL Day",
          "from": "07:00:00",
          "to": "23:00:00",
          "price": [
            {
              "categoryName": "InterInstitute",
              "price": 200000,
              "_id": "660e332afd137be22bdaf09f"
            },
            {
              "categoryName": "specialrate",
              "price": 25000,
              "_id": "660e332afd137be22bdaf0a0"
            }
          ],
          "_id": "660e332afd137be22bdaf09e"
        }
      ],
      "createdAt": "2024-03-12T20:07:20.708Z",
      "updatedAt": "2024-04-09T07:46:03.635Z",
      "__v": 0,
      "eventRestrictions": "Birthdays",
      "securityDeposit": 500
    },
    {
      "_id": "65f0b61ad07e42db1abb8cce",
      "name": "DJ Seminar Hall",
      "location": {
        "desc1": "JVPD Ground, Mumbai - 400056",
        "desc2": "Babubhai Jagjivandas Hall, 1, N S Rd Number 3, Navpada, JVPD Scheme, Vile Parle West, Mumbai, Maharashtra 400056. Babubhai Jagjivandas Hall, 1, N S Rd Number 3, Navpada, JVPD Scheme, Vile Parle West, Mumbai, Maharashtra 400056",
        "gmapurl": "https://maps.app.goo.gl/8fenAeRK5RJ2LZLc8",
        "iframe": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.006039443071!2d72.83461397510128!3d19.107390982103663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c676018b43%3A0x75f29a4205098f99!2sSVKM&#39;s%20Dwarkadas%20J.%20Sanghvi%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1708336595862!5m2!1sen!2sin",
        "_id": "65f0b61ad07e42db1abb8ccf"
      },
      "about": [
        "Babubhai Jagjivandas Hall, Juhu, Mumbai is a lovely venue to host your wedding and reception ceremony. It is located near the Prithvi Theatre and a close distance from Vile Parle Station which makes it easily accessible for all to reach there. Babubhai Jagjivandas Mumbai, Maharashtra serves scrumptious pure vegetarian food to their guests.",
        "The decor team takes care of the decoration for your big day. Babubhai Jagjivandas Hall has a lush green lawn that can accommodate a huge crowd for an open-air outdoor evening reception. It also has a banquet hall for having an indoor wedding or reception ceremony.",
        "BJ Hall Vile Parle has an inviting ambiance which makes everyone feel welcomed. The elegant décor of the venue makes it an ideal option for a grand wedding. Host your events at BJ Hall Mumbai to make them outstanding. Ticking all the right boxes, this one must certainly be on your cards."
      ],
      "capacity": "500",
      "seating": "100",
      "pricing": "20000",
      "additionalFeatures": [
        {
          "heading": "Gorgeous Ambience",
          "desc": " We have got a very good ambience",
          "stats": [],
          "price": 1000,
          "_id": "65f0b61ad07e42db1abb8cd0"
        },
        {
          "heading": "In-house decorators",
          "desc": "In-house decorators make the venue more stunning",
          "stats": [],
          "price": 3000,
          "_id": "65f0b61ad07e42db1abb8cd1"
        }
      ],
      "images": [
        "http://res.cloudinary.com/dltkrwiau/image/upload/v1711732551/yty0rdhahifjcuq0ehws.jpg",
        "http://res.cloudinary.com/dltkrwiau/image/upload/v1712508629/f2aq5avzlpl1htckeee2.jpg"
      ],
      "sessions": [
        {
          "active": true,
          "name": "Morning First session",
          "from": "8:00:00",
          "to": "12:00:00",
          "price": [
            {
              "categoryName": "Student",
              "price": 2000,
              "_id": "65f0b61ad07e42db1abb8cd3"
            },
            {
              "categoryName": "Politician",
              "price": 4000,
              "_id": "65f0b61ad07e42db1abb8cd4"
            }
          ],
          "_id": "65f0b61ad07e42db1abb8cd2"
        },
        {
          "active": true,
          "name": "Afternoon Session",
          "from": "13:00:00",
          "to": "17:00:00",
          "price": [
            {
              "categoryName": "Student",
              "price": 2000,
              "_id": "65f0b61ad07e42db1abb8cd6"
            },
            {
              "categoryName": "Politician",
              "price": 4000,
              "_id": "65f0b61ad07e42db1abb8cd7"
            }
          ],
          "_id": "65f0b61ad07e42db1abb8cd5"
        },
        {
          "active": true,
          "name": "Night Session",
          "from": "19:00:00",
          "to": "22:00:00",
          "price": [
            {
              "categoryName": "Student",
              "price": 2000,
              "_id": "65f0b61ad07e42db1abb8cd9"
            },
            {
              "categoryName": "Politician",
              "price": 4000,
              "_id": "65f0b61ad07e42db1abb8cda"
            },
            {
              "categoryName": "Non Student",
              "price": 8000,
              "_id": "660b9eefa1c7c7fb77dabb4d"
            }
          ],
          "_id": "65f0b61ad07e42db1abb8cd8"
        },
        {
          "active": false,
          "name": "Full Day Session",
          "from": "08:00:00",
          "to": "22:00:00",
          "price": [
            {
              "categoryName": "Person",
              "price": 500,
              "_id": "660b9eefa1c7c7fb77dabb4f"
            }
          ],
          "_id": "660b9eefa1c7c7fb77dabb4e"
        }
      ],
      "createdAt": "2024-03-12T20:07:54.349Z",
      "updatedAt": "2024-04-07T17:04:01.549Z",
      "__v": 0,
      "eventRestrictions": "Mourning"
    }
  ]

  const handleAddHall = (id: string) => {
    onHallSelect(id);
  };

  const handleRemoveHall = (id: string) => {
    // Perform remove action
    const updatedSelectedHallIds = selectedHallIds.filter((hallId) => hallId !== id);
    onAddedHallsChange(updatedSelectedHallIds); // Update added items
  };

  return (
    <div className="max-w-full mx-auto mt-8 p-4 bg-white rounded shadow-md mb-20 overflow-x-auto">
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Capacity</th>
            <th className="px-4 py-2">Location</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dummyItems.map((hall: any) => (
            <tr key={hall._id}  className={selectedHallIds.includes(hall._id) ? 'bg-blue-200' : ''}>
              <td className="border px-4 py-2">{hall.name}</td>
              <td className="border px-4 py-2">{hall.capacity}</td>
              <td className="border px-4 py-2">{hall.location.desc1}</td>
              <td className="border px-4 py-2">
                {selectedHallIds.includes(hall._id) ? (
                  <button type="button" onClick={() => handleRemoveHall(hall._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Remove</button>
                ) : (
                  <button type="button" onClick={() => handleAddHall(hall._id)} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1 rounded">Add</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <button type='button' onClick={onClearSelectedHalls} className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">Clear Selected Halls</button>
  </div>
  );
};

export default AddHalltoManager;
