import React from "react";

type Props = {
  name: string;
  seating: string;
  capacity: string;
};

export default function HallCapacityInfo({ name, seating, capacity }: Props) {
  return (
    <div className="w-12/12 bg-gray-50 bg-opacity-20 border-0 p-2 mb-2 rounded-xl hover:bg-opacity-50 px-10 cursor-pointer">
      <h4 className="text-lg font-semibold">{name}</h4>
      <span className="flex gap-3">
        <h4>Seating: {seating}</h4>
        <h4>Capacity: {capacity}</h4>
      </span>
    </div>
  );
}
