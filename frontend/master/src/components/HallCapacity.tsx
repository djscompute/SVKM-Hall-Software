import React from 'react';
import EditComponent from './EditComponent';
import HallCapacityInfo from './HallCapacityInfo';

export default function HallCapacity() {
  return (
    <div className="about-hall flex justify-between bg-[#8c9ecd] w-full p-3 px-12 rounded-lg">
        <div className="hall-capacity w-11/12">
            <h2 className="font-bold text-xl mb-3">Party Areas & Capacity</h2>
            <div className="hall-capacity-info">
                <HallCapacityInfo 
                    name = {"Hall1"}
                    seating = {500}
                    capacity = {750}
                />
                <HallCapacityInfo 
                    name = {"Hall2"}
                    seating = {300}
                    capacity = {450}
                />
                <HallCapacityInfo 
                    name = {"Lawn"}
                    seating = {1000}
                    capacity = {1500}
                />
            </div>
        </div>
        <EditComponent />
    </div>
  )
}
