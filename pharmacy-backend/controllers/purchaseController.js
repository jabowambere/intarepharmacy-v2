import Purchase from "../models/Purchase.js";

export const createPurchase = async (req, res) => {
  try {
    const { medicineId, customerName, customerEmail, customerPhone, customerAddress, quantity, prescription } = req.body;
    
    const purchase = new Purchase({
      medicineName: req.body.medicineName || 'Medicine',
      medicineId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      quantity,
      totalPrice: req.body.totalPrice || 0,
      prescription: prescription || ''
    });
    
    await purchase.save();
    res.status(201).json({ message: "Purchase successful", purchase });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePurchaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const purchase = await Purchase.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    
    // Email notification disabled
    
    res.json({ message: "Status updated successfully", purchase });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};