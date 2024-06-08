import express from "express";
import ViteExpress from "vite-express";
import config from "../config/config.ts";
import mongoose from "mongoose";
import initDatabase from "./startUp/initDatabase.ts";
import startUp from "./startUp/startUp.ts";
import { greenLog, redLog, yellowLog } from "../utils/console/coloredLogs.ts";
import routes from "./routes/index.ts";

const { PORT, MONGO_SERVER } = config;
const app = express();

app.use('/api', routes);

startServer();

async function startServer() {
  try {
    yellowLog('Trying to connect to MongoDB...');
    mongoose.connection.once('open', initDatabase);
    await mongoose.connect(MONGO_SERVER);
    greenLog('Successfully connected to MongoDB!');
    ViteExpress.listen(app, PORT, startUp);
  } catch (error) {
    redLog('Error occured on starting server:');
    redLog(error);
  }
}
