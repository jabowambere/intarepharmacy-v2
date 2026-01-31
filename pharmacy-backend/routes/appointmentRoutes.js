import express from "express";
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public route - no auth required for booking
router.post("/", createAppointment);
// Remove auth requirement temporarily for testing
router.get("/", getAppointments);
// Update appointment status
router.put("/:id/status", auth, updateAppointmentStatus);

export default router;
