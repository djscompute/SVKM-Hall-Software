import { Request, Response } from "express";
import { getHallBookingsCount } from "../service/dashboard-service/getHallBookingsCount";
import { getSessionWiseBooking } from "../service/dashboard-service/getSessionWiseBooking";
import { getBookingTypeCounts } from "../service/dashboard-service/getBookingTypeCounts";
import { getCollectionDetails } from "../service/dashboard-service/getCollectionDetails";
import { getInteractionCount } from "../service/dashboard-service/getInteractionCount";
import { getAdditionalFeatureReport } from "../service/dashboard-service/getAdditionalFeatureReport";
import { getBookingInformationReport } from "../service/dashboard-service/getBookingInformationReport";
import { getMonthwiseCollectionDetails } from "../service/dashboard-service/getMonthwiseCollectionDetails";
import { getAllHallNamesAndIds, getSessionsWithCategoriesByHallName } from "../service/getHallConfig";
import { getBookingConfirmationReport } from "../service/dashboard-service/getBookingConfirmationReport";
import { getHallReport } from "../service/dashboard-service/getHallInformationReport";

// Handler for fetching HallName and bookingCount=CONFIRMED within a time frame
export async function getHallBookingsCountHandler(req: Request, res: Response) {
  try {
    const { fromDate, toDate } = req.body;
    const hallSessionsCount = await getHallBookingsCount(fromDate, toDate);
    res.status(200).json(hallSessionsCount);
  } catch (error) {
    console.error("Error fetching hall sessions count:", error);
    res.status(500).json({ error: (error as Error).message || "Internal server error" });
  }
}

// Handler for fetching session-wise booking information for a hall/allHalls within a time frame
export async function getSessionWiseBookingHandler(req: Request, res: Response) {
  try {
    const { fromDate, toDate, hallName } = req.body;
    const sessionWiseBooking = await getSessionWiseBooking(fromDate, toDate, hallName);
    res.status(200).json(sessionWiseBooking);
  } catch (error) {
    console.error("Error fetching session-wise booking information:", error);
    res.status(500).json({ error: (error as Error).message || "Internal server error" });
  }
}

// Handler for fetching bookingType and the count for a hall/allHalls within a time frame
export async function getBookingTypeCountsHandler(req: Request, res: Response) {
  try {
    const { fromDate, toDate, hallName } = req.body;
    const customerCategoryShare = await getBookingTypeCounts(fromDate, toDate, hallName);
    res.status(200).json(customerCategoryShare);
  } catch (error) {
    console.error("Error fetching customer category share:", error);
    res.status(500).json({ error: (error as Error).message || "Internal server error" });
  }
}

// Handler for fetching collection (revenue) for a hall/allHalls within a time frame
export async function getCollectionDetailsHandler(req: Request, res: Response) {
  try {
    const { fromDate, toDate, hallName } = req.body;
    const collectionDetails = await getCollectionDetails(fromDate, toDate, hallName);
    res.status(200).json(collectionDetails);
  } catch (error) {
    console.error("Error fetching collection details:", error);
    res.status(500).json({ error: (error as Error).message || "Internal server error" });
  }
}

// Handler for fetching collection (revenue) for a hall/allHalls within a time frame
export async function getMonthwiseCollectionDetailsHandler(req: Request, res: Response) {
  try {
    const { fromDate, toDate, hallName } = req.body;
    const collectionDetails = await getMonthwiseCollectionDetails(fromDate, toDate, hallName);
    res.status(200).json(collectionDetails);
  } catch (error) {
    console.error("Error fetching collection details:", error);
    res.status(500).json({ error: (error as Error).message || "Internal server error" });
  }
}

// Handler for fetching HallName and interactions (total enquiry + confirmed) within a time frame
export async function getInteractionCountHandler(req: Request, res: Response) {
  try {
    const { fromDate, toDate } = req.body;
    const hallSessionsCount = await getInteractionCount(fromDate, toDate);
    res.status(200).json(hallSessionsCount);
  } catch (error) {
    console.error("Error fetching hall sessions count:", error);
    res.status(500).json({ error: (error as Error).message || "Internal server error" });
  }
}

// Handler for generating the booking information report 
export async function getBookingInformationReportHandler(req: Request, res: Response) {
  try {
    const { displayPeriod, fromDate, toDate, displayHall, displayCustomerCategory, displaySession, displayHallCharges,displayTransactionType,displayBookingStatus}: {
      displayPeriod: string;
      fromDate?: string;
      toDate?: string;
      displayHall: string;
      displayCustomerCategory: string;
      displaySession: string;
      displayHallCharges: boolean;
      displayTransactionType: string;
      displayBookingStatus:string;
    } = req.body;

    const reportRows = await getBookingInformationReport({ displayPeriod, fromDate, toDate, displayHall, displayCustomerCategory, displaySession, displayHallCharges,displayTransactionType,displayBookingStatus });
    res.status(200).json(reportRows);
  } catch (error) {
    console.log("Error fetching report data !!", error);
    res.status(500).json({ error: (error as Error).message || "Internal server error" });
  }
}
export async function getBookingConfirmationReportHandler(req: Request, res: Response) {
  try {
    const {displayPeriod, fromDate, toDate, displayHall, displayCustomerCategory, displaySession, displayHallCharges }: {
      displayPeriod: string;
      fromDate?: string;
      toDate?: string;
      displayHall: string;
      displayCustomerCategory: string;
      displaySession: string;
      displayHallCharges: boolean;
    } = req.body;

    const reportRows = await getBookingConfirmationReport({ displayPeriod, fromDate, toDate, displayHall, displayCustomerCategory, displaySession, displayHallCharges });
    res.status(200).json(reportRows);
  } catch (error) {
    console.log("Error fetching report data !!", error);
    res.status(500).json({ error: (error as Error).message || "Internal server error" });
  }
}

// Handler for generating the additional features report 
export async function getAdditionalFeatureReportHandler(req: Request, res: Response) {
  try {
    const { fromDate, toDate, hallName, additionalFeatures } = req.body;
    const reportRow = await getAdditionalFeatureReport(fromDate, toDate, hallName, additionalFeatures);
    res.status(200).json(reportRow);
  } catch (error) {
    console.log("Error fetching report data !!", error)
    res.status(500).json({ error: (error as Error).message || "Internal server error" });
  }
}

//Handler for generating the hall information report
export async function getHallInformationReportHandler(req: Request, res: Response) {
  try {
    const {
      fromDate,
      toDate,
      hallName,
      includeBookings = false,
      includeSessions = false,
      includeAdditionalFeatures = true,
    }: {
      fromDate?: string;
      toDate?: string;
      hallName: string;
      includeBookings?: boolean;
      includeSessions?: boolean;
      includeAdditionalFeatures?: boolean;
    } = req.body;

    const from = fromDate ? new Date(fromDate) : undefined;
    const to = toDate ? new Date(toDate) : undefined;

    const hallInfoReport = await getHallReport(from || new Date(), to || new Date(), hallName);

    res.status(200).json(hallInfoReport);
  } catch (error) {
    console.error("Error fetching hall information report:", error);
    res.status(500).json({ error: (error as Error).message || "Internal server error" });
  }
}

{/* Helper Handler Functions to get hall configs */ }
export async function getAllHallNamesAndIdsHandler(req: Request, res: Response) {
  try {
    const halls = await getAllHallNamesAndIds();
    res.status(200).json(halls);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: (error as Error).message || "Internal server error" });
  }
}

export async function getSessionsWithCategoriesByHallNameHandler(req: Request, res: Response) {
  const hallName: string | undefined = req.query.hallName as string;

  try {
      if (!hallName) {
          throw new Error("Hall name parameter is required.");
      }

      const sessions = await getSessionsWithCategoriesByHallName(hallName);
      res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message || "Internal server error" });
  }
}
