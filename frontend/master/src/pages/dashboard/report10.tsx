import { useEffect, useState } from "react";
import axiosMasterInstance from "../../config/axiosMasterInstance";
import { toast } from "react-toastify";
import "chart.js/auto";
import { EachHallType } from "../../../../../types/global.ts";
import { useQuery } from "@tanstack/react-query";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { convert_IST_TimeString_To12HourFormat } from "../../utils/convert_IST_TimeString_To12HourFormat.ts";
function Report10() {
  const [hallData, setHallData] = useState<EachHallType[]>([]);

  useQuery({
    queryKey: ["allhalls"],
    queryFn: async () => {
      try {
        const responsePromise = axiosMasterInstance.get("getAllHalls");
        console.log("FETCHING");
        toast.promise(responsePromise, {
          pending: "Fetching halls...",
          error: "Failed to fetch Halls. Please try again.",
        });
        const response = await responsePromise;
        setHallData(response.data);
        return response.data as EachHallType[];
      } catch (error) {
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, 
  });

  const [selectedHall, setSelectedHall] = useState<string>("");

  const downloadPDF = async () => {
    const reportElement = document.getElementById("report");
    if (!reportElement) return;

    const canvas = await html2canvas(reportElement);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save("hall-report.pdf");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 mb-20">
      <span className="text-2xl font-semibold mt-8">Hall Information Report</span>

      {/* SELECT HALL */}
      <div className="my-6 w-full max-w-xl flex items-center gap-4 justify-between">
        <label htmlFor="hall" className="font-medium text-lg">
          Select Hall:
        </label>
        <select
          id="hall"
          className="bg-gray-100 border border-gray-300 shadow-sm px-3 py-2 rounded-md text-center w-full"
          onChange={(e) => setSelectedHall(e.target.value)}
        >
          <option value="">Select a Hall</option>
          {hallData.map((hall) => (
            <option key={hall._id} value={hall._id}>
              {hall.name}
            </option>
          ))}
        </select>
      </div>

      {/* Display Hall Data */}
      {selectedHall && (
        <div className="w-full max-w-2xl mt-8" id="report">
          {hallData
            .filter((hall) => hall._id === selectedHall)
            .map((hall) => (
              <div key={hall._id} className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">
                  {hall.name}
                </h2>
                <div className="">
                  <div>
                    <p className="font-semibold text-lg text-gray-600">
                      Location:
                    </p>
                    {hall.location && typeof hall.location === "object" && (
                      <>
                        <p>{hall.location.desc1}</p>
                        <p>{hall.location.desc2}</p>
                        <p>
                          <a
                            href={hall.location.gmapurl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            View on Google Maps
                          </a>
                        </p>
                      </>
                    )}
                    <p className="font-semibold text-lg mt-4 text-gray-600">
                      About:
                    </p>
                    <p className="md:w-4/5">{hall.about}</p>
                    <p className="font-semibold text-lg mt-4 text-gray-600">
                      Capacity:
                    </p>
                    <p>{hall.capacity}</p>
                    <p className="font-semibold text-lg mt-4 text-gray-600">
                      Security Deposit:
                    </p>
                    <p>{hall.securityDeposit}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-lg text-gray-600">
                      Additional Features:
                    </p>
                    {Array.isArray(hall.additionalFeatures) &&
                    hall.additionalFeatures.length > 0 ? (
                      <ul className="list-none space-y-4">
                        {hall.additionalFeatures.map((feature, index) => (
                          <li key={index} className="border-b pb-2">
                            <h4 className="font-semibold text-lg">
                              {feature.heading}
                            </h4>
                            <p className="text-gray-600 mt-1">{feature.desc}</p>
                            {feature.price && (
                              <p className="text-gray-800 font-medium mt-1">
                                Price: {feature.price}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">
                        No additional features specified.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="font-semibold text-lg text-gray-600">
                    Sessions:
                  </p>
                  {Array.isArray(hall.sessions) && hall.sessions.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-700">
                      {hall.sessions.map((session) => (
                        <li key={session._id}>
                          {session.name}: {convert_IST_TimeString_To12HourFormat(session.from)} - {convert_IST_TimeString_To12HourFormat(session.to)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No sessions specified.</p>
                  )}
                </div>

                <div className="mt-6">
                  <p className="font-semibold text-lg text-gray-600">
                    Event Restrictions:
                  </p>
                  {Array.isArray(hall.eventRestrictions) &&
                  hall.eventRestrictions.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-700">
                      {hall.eventRestrictions.map((restriction, index) => (
                        <li key={index}>{restriction}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      No event restrictions specified.
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <p className="font-semibold text-lg text-gray-600">Images:</p>
                  {Array.isArray(hall.images) && hall.images.length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                      {hall.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Hall image ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-md border"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No images available.</p>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      <button
        onClick={downloadPDF}
        className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600"
      >
        Download PDF
      </button>
    </div>
  );
}

export default Report10;
