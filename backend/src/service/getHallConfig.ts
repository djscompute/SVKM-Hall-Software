import { Request, Response } from "express";
import { EachHallType, EachHallSessionType } from "../../../types/global";
import { HallModel } from "../models/hall.model";


interface HallInfo {
    hallName: string;
    hallID: string;
}
interface SessionInfo {
    sessionName: string;
    sessionId: string;
}

interface CategoryInfo {
    categoryName: string;
}
export async function getAllHallNamesAndIds(): Promise<HallInfo[]> {
    try {
        const halls = await HallModel.find({})
        const hallNamesAndIds: HallInfo[] = halls.map((hall) => ({
            hallName: hall.name,
            hallID: hall._id ? hall._id.toString() : "",
        }));

        return hallNamesAndIds;
    } catch (error) {
        throw new Error("Error fetching hall names and IDs: " + (error as Error).message);
    }
}

export async function getSessionsWithCategoriesByHallName(hallName: string): Promise<{ sessions: SessionInfo[], categories: CategoryInfo[] }> {
    try {
        const hall: EachHallType | null = await HallModel.findOne({ name: hallName });

        if (!hall) {
            throw new Error(`Hall with name ${hallName} not found.`);
        }
        const sessions: EachHallSessionType[] = hall.sessions;
        const sessionInfo: SessionInfo[] = sessions.map((session) => ({
            sessionName: session.name,
            sessionId: session._id ? session._id.toString() : "",
        }));
        const categoriesSet: Set<string> = new Set();
        sessions.forEach((session) => {
            session.price.forEach((price) => {
                categoriesSet.add(price.categoryName);
            });
        });
        const categoriesInfo: CategoryInfo[] = Array.from(categoriesSet).map((categoryName) => ({
            categoryName: categoryName,
        }));

        return { sessions: sessionInfo, categories: categoriesInfo };
    } catch (error) {
        throw new Error("Error fetching sessions with categories by hall name: " + (error as Error).message);
    }
}