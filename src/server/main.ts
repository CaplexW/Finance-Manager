import express from "express";
import ViteExpress from "vite-express";
import config from "../config/config.ts";
import mongoose from "mongoose";
import initDatabase from "./startUp/initDatabase.ts";
import startUp from "./startUp/startUp.ts";

const { PORT, MONGO_SERVER } = config;
const app = express();

startServer();

async function startServer():Promise<void> {
  try {
    console.log('Trying to connect to MongoDB...');
    mongoose.connection.once('open', initDatabase);
    await mongoose.connect(MONGO_SERVER);
    console.log('Successfully connected to MongoDB!');
    ViteExpress.listen(app, PORT, startUp);
  } catch (error) {
    console.log('Error occured on starting server:');
    console.log(error);
  }
}
