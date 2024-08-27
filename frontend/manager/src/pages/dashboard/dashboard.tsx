import { useState } from "react";

function Dashboard() {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-semibold my-5">DashBoard</h1>
      
  
      <div className="flex flex-wrap justify-around w-full gap-10 my-10">
        <button
          onClick={() => setActiveSection("charts")}
          className="w-1/4 bg-blue-500 text-white text-center font-medium py-2 rounded-md cursor-pointer"
        >
          Charts
        </button>
        <button
          onClick={() => setActiveSection("reports")}
          className="w-1/4 bg-green-500 text-white text-center font-medium py-2 rounded-md cursor-pointer"
        >
          Reports
        </button>
      </div>

      
      {activeSection === "charts" && (
        <div className="flex flex-wrap justify-around w-full gap-10 mt-10">
          <a
            href="/dashboard/hall-wise-bookings"
            className="w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
          >
            Hall Wise Bookings
          </a>
          <a
            href="/dashboard/get-session-wise-bookings"
            className="w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
          >
            Session Wise Bookings
          </a>
          <a
            href="/dashboard/get-booking-type-counts"
            className="w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
          >
            Booking Type Counts
          </a>
          <a
            href="/dashboard/get-collection-details"
            className="w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
          >
            Collection Details
          </a>
          <a
            href="/dashboard/get-monthwise-collection-details"
            className="w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
          >
            Monthwise Collection Details
          </a>
          <a
            href="/dashboard/total-interaction"
            className="w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
          >
            Total Interaction
          </a>
        </div>
      )}

  
      {activeSection === "reports" && (
        <div className="flex flex-wrap justify-around w-full gap-10 mt-10">
          <a
            href="/dashboard/hall-wise-additional-feature-report"
            className="w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
          >
            Hall Wise Additional Feature Report
          </a>
          <a
            href="/dashboard/booking-information-report"
            className="w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
          >
            Event Information Report
          </a>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
