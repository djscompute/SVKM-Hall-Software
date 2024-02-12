import React from "react";
import EditComponent from "./EditComponent";

export default function HallPricing() {
  return (
    <div className="about-hall flex justify-between bg-[#8c9ecd] w-full p-3 px-12 rounded-lg">
        <div>
            <h2 className="font-bold text-xl mb-3">Pricing</h2>
        </div>
        <EditComponent />
    </div>
  )
}
