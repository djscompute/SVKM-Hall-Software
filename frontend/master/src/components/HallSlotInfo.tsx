import React from 'react';
import EditComponent from './EditComponent';

export default function HallSlotInfo() {
  return (
    <div className="hall-slot flex justify-between bg-[#8c9ecd] w-full p-3 px-12 rounded-lg">
        <div className="hall-slot-info w-11/12">
            <h2 className="font-bold text-xl mb-3">Timings & Slots</h2>
            <h4 className="text-lg font-semibold">Morning</h4>
            <p className="text-sm mb-2">11:00 AM - 3:00 PM</p>
            <h4 className="text-lg font-semibold">Evening</h4>
            <p className="text-sm mb-2">4:00 PM - 11:00 PM</p>
        </div>
        <EditComponent />
    </div>
  )
}
