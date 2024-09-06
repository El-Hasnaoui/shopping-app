import * as dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import mongoose from "mongoose";
import { errorHandler, JwtPayload } from "@shopp-app-hsn/common";
import { authRouters } from "./auth/auth.routers";

export class AppModule {
  constructor(public app: Application) {
    app.use(
      cors({
        origin: "*",
        optionsSuccessStatus: 200,
      })
    );
    app.set("trust proxy", true);
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(
      cookieSession({
        signed: false,
        secure: false,
      })
    );
    app.use(authRouters);
    app.use(errorHandler);
  }
  async start() {
    if (!process.env.MONGO_URI) throw new Error("Mongo URI must be defined");
    if (!process.env.JWT_KEY) throw new Error("JWT kEY must be defined");
    try {
      await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
      console.log(err);
      throw new Error("database connection err");
    }
    this.app.listen("3030", () => console.log("listening to port: 3030"));
  }
}
