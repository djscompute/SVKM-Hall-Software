import React, { useState } from "react";

interface DropdownProps {
  timeSlots: string[];
}

const Dropdown: React.FC<DropdownProps> = ({ timeSlots }) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelect = (slot: string) => {
    setSelectedSlot(slot);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="bg-gray-300 text-gray-700 py-2 px-4 rounded inline-flex items-center"
      >
        {selectedSlot || "Select a time slot"}
        <svg
          className="fill-current h-4 w-4 ml-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            d="M7 10l5 5 5-5z"
            fill="#111827"
          />
        </svg>
      </button>
      {isDropdownOpen && (
        <div className="absolute z-10 w-48 mt-1 bg-white border rounded-md shadow-lg">
          {timeSlots.map((slot) => (
            <div
              key={slot}
              onClick={() => handleSelect(slot)}
              className="cursor-pointer p-2 hover:bg-gray-200"
            >
              {slot}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Drop: React.FC = () => {
  const hardcodedTimeSlots = ["10:00 AM", "2:00 PM", "4:30 PM", "7:00 PM"];

  return (
    <div className="flex items-center justify-center h-screen">
      <Dropdown timeSlots={hardcodedTimeSlots} />
    </div>
  );
};

export default Drop;