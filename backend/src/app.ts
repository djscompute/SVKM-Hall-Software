import express from "express";
import config from "config";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import logger from "./utils/logger";
import connectToDB from "./utils/connect";
import routes from "./routes";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: [
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

// app.use(errorHandler);

routes(app);

const PORT = config.get<number>("PORT");
const MODE = config.get<string>("MODE");

connectToDB();

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    logger.info(`${MODE} server is up on port ${PORT}`);
  });
});
