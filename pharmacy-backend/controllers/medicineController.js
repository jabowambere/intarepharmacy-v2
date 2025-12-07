import Medicine from "../models/Medicine.js";

export const addMedicine = async (req, res) => {
  try {
    const { name, description, price, stock, category, image } = req.body;
    const medicine = new Medicine({
      name,
      description,
      image,
      price,
      quantity: stock,
      category
    });
    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category, image } = req.body;
    const medicine = await Medicine.findByIdAndUpdate(
      id,
      { name, description, image, price, quantity: stock, category },
      { new: true }
    );
    res.json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};