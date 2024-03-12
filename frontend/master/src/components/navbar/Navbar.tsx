import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { useGeneralStore } from "../../store/generalStore";

const NavBar = () => {
  const [open, setOpen] = useState(false);

  const [isAuthenticated, logout] = useAuthStore((store) => [
    store.isAuthenticated,
    store.logout,
  ]);

  const [setLoginToastTrue] = useGeneralStore((store)=>[
    store.setLoginToastTrue
  ])

  const logoutHandler = () =>{
    setLoginToastTrue();
    logout();
  }

  return (
    <>
      {/* This example requires Tailwind CSS v2.0+ */}
      <div className="bg-white border-b-2 border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center  py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link to="/">
                <h1 className="text-xl font-semibold">SVKM Halls</h1>
              </Link>
            </div>
            <div className="-mr-2 -my-2 md:hidden">
              <button
                type="button"
                className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={() => setOpen(!open)}
              >
                <span className="sr-only">Open menu</span>
                {/* Heroicon name: outline/menu */}
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
            <nav className="hidden md:flex space-x-10">
              <Link
                to="/"
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                Home
              </Link>
            </nav>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              {isAuthenticated ? (
                <span
                  onClick={logoutHandler}
                  className="whitespace-nowrap text-base font-medium text-red-500 hover:text-red-900 cursor-pointer"
                >
                  Log Out
                </span>
              ) : (
                <Link
                  to="/login"
                  className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
                >
                  Sign in
                </Link>
              )}
              {/* <Link
                to="#"
                className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-SAPBlue-800 hover:bg-SAPBlue-900"
              >
                Sign up
              </Link> */}
            </div>
          </div>
        </div>
        {/*
      Mobile menu, show/hide based on mobile menu state.
  
      Entering: "duration-200 ease-out"
        From: ""
        To: ""
      Leaving: "duration-100 ease-in"
        From: "opacity-100 scale-100"
        To: "opacity-0 scale-95"
    */}

        <div
          className={
            open
              ? "opacity-100 scale-100 ease-out duration-200 absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-40"
              : "opacity-0 scale-95 absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-40"
          }
        >
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    to="/"
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                  >
                    SVKM Halls
                  </Link>
                </div>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    onClick={() => setOpen(!open)}
                  >
                    <span className="sr-only">Close menu</span>
                    {/* Heroicon name: outline/x */}
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="py-6 px-5 space-y-6">
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <Link
                  to="/"
                  className="text-base font-medium text-gray-900 hover:text-gray-700"
                >
                  Home
                </Link>
              </div>
              <div>
                <Link
                  to="#"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-SAPBlue-800 hover:bg-SAPBlue-900"
                >
                  Sign up
                </Link>
                <p className="mt-6 text-center text-base font-medium text-gray-500">
                  Existing customer?
                  <Link
                    to="#"
                    className="text-SAPBlue-800 hover:text-SAPBlue-900"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
