import express from "express";
import {
  addMedicine,
  getAllMedicines,
  updateMedicine,
  deleteMedicine,
} from "../controllers/medicineController.js";

const router = express.Router();

router.post("/", addMedicine);
router.get("/", getAllMedicines);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);

export default router;