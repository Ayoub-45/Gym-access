import express from "express";
import { createMember, renewMembership, getMemberStatus } from "../controllers/memberController.js";

const router = express.Router();

router.post("/", createMember);
router.post("/:id/renew", renewMembership);
router.get("/:id", getMemberStatus);

export default router;
