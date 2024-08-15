function Dashboard() {
  return (
    <div className="flex flex-col items-center">
      <h1 className=" text-3xl font-semibold my-5">DashBoard</h1>
      <div className="flex flex-wrap justify-around w-full gap-10">
        <a
          href="/dashboard/hall-wise-bookings"
          className=" w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
        >
          Hall Wise Bookings
        </a>
        <a
          href="/dashboard/get-session-wise-bookings"
          className=" w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
        >
          Session Wise Bookings
        </a>
        <a
          href="/dashboard/get-booking-type-counts"
          className=" w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
        >
          Booking Type Counts
        </a>
        <a
          href="/dashboard/get-collection-details"
          className=" w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
        >
          Collection Details
        </a>
        <a
          href="/dashboard/get-monthwise-collection-details"
          className=" w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
        >
          Monthwise Collection Details
        </a>
        <a
          href="/dashboard/total-interaction"
          className=" w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
        >
          Total Interaction
        </a>
        <a
          href="/dashboard/hall-wise-additional-feature-report"
          className=" w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
        >
          Hall Wise Additional Feature Report
        </a>
        <a
          href="/dashboard/booking-information-report"
          className=" w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
        >
          Booking Information Report
        </a>
        <a
          href="/dashboard/booking-confirmation-report"
          className=" w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
        >
          Booking Confirmation Report
        </a>
      </div>
    </div>
  );
}

export default Dashboard;
