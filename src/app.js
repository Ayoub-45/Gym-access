import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import memberRoutes from "./routes/memberRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/members", memberRoutes);
app.use("/attendance", attendanceRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Gym Membership API Running ✅");
});

export { app, prisma };
