import express from "express";
import { createPurchase, getAllPurchases, updatePurchaseStatus } from "../controllers/purchaseController.js";

const router = express.Router();

router.post("/", createPurchase);
router.get("/", getAllPurchases);
router.put("/:id/status", updatePurchaseStatus);

export default router;