import express, { json, urlencoded } from "express";
import ViteExpress from "vite-express";
import config from "../config/config.ts";
import mongoose from "mongoose";
import cors from 'cors';
import initDatabase from "./startUp/initDatabase.ts";
import startUp from "./startUp/startUp.ts";
import { greenLog, redLog, yellowLog } from "./utils/console/coloredLogs.ts";
import routes from "./routes/index.ts";
import path from "path";

const { PORT, MONGO_SERVER, IN_PRODUCTION } = config;
const app = express();

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cors());
app.use('/api', routes);

if (IN_PRODUCTION) {
  const buildPath = path.join(import.meta.dirname, 'build');
  const indexPath = path.join(buildPath, 'index.html');

  app.use('/', express.static(buildPath));
  app.get('*', (req, res) => res.sendFile(indexPath));
}

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
