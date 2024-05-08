function Dashboard() {
  return (
    <div className="flex flex-col items-center">
      <h1 className=" text-3xl font-semibold my-5">DashBoard</h1>
      <div className="flex flex-wrap justify-around w-full gap-10">
        <a
          href="/dashboard/report1"
          className=" w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
        >
          Hall Wise Bookings
        </a>
        <a
          href="/dashboard/report2"
          className=" w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
        >
          Report 2
        </a>
        <a
          href="/dashboard/report3"
          className=" w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
        >
          Report 3
        </a>
        <a
          href="/dashboard/report4"
          className=" w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
        >
          Report 4
        </a>
        <a
          href="/dashboard/report5"
          className=" w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
        >
          Report 5
        </a>
        <a
          href="/dashboard/report6"
          className=" w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
        >
          Report 6
        </a>
        <a
          href="/dashboard/report7"
          className=" w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
        >
          Report 7
        </a>
        <a
          href="/dashboard/report8"
          className=" w-1/4 bg-gray-200 text-center font-medium py-2 rounded-md border border-gray-300 cursor-pointer"
        >
          Report 8
        </a>
      </div>
    </div>
  );
}

export default Dashboard;
