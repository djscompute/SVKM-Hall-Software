import { bookingStatusType } from "../types/Hall.types";

export const getSlotColour = (status: bookingStatusType) => {
  switch (status) {
    case "ENQUIRY":
      return "bg-blue-200";
    case "CONFIRMED":
      return "bg-red-200";
    /*
    case "TENTATIVE":
      return "bg-orange-200";
    */
    default:
      return "bg-white";
  }
};
