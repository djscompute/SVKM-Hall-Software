import { bookingStatusType } from "../types/Hall.types";

export const getSlotAbbreviation = (status: bookingStatusType) => {
  switch (status) {
    case "ENQUIRY":
      return "(E)";
    case "CONFIRMED":
      return "(C)";
    /*
    case "TENTATIVE":
      return "(T)";
    */
    default:
      return "";
  }
};
