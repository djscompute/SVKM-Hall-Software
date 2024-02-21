import express from "express";
import config from "config";  
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import logger from "./utils/logger";
import connectToDB from "./utils/connect";
import routes from "./routes";
import { rateLimit } from 'express-rate-limit'
import helmet from "helmet";

const app = express();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', 
	legacyHeaders: false, 
})

app.use(limiter)
app.use(helmet());
app.use(express.json()); 
app.use(cookieParser());
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
