import express from "express";
import { scanQR } from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/scan", scanQR);

export default router;
