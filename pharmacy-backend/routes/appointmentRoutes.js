import express from "express";
import {
  createAppointment,
  getAppointments,
} from "../controllers/appointmentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public route - no auth required for booking
router.post("/", createAppointment);
// Admin only - auth required for viewing appointments
router.get("/", auth, getAppointments);

export default router;
