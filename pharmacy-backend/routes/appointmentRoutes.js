import express from "express";
import {
  createAppointment,
  getAppointments,
} from "../controllers/appointmentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// user must be logged in
router.post("/", auth, createAppointment);
router.get("/", auth, getAppointments);

export default router;
