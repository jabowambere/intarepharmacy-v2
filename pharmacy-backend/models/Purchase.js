import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    medicineName: {type: String, required: true},
    medicineId: {type: String, required: true},
    customerName: {type: String, required: true},
    customerEmail: {type: String, required: true},
    customerPhone: {type: String, required: true},
    customerAddress: {type: String, required: true},
    quantity: {type: Number, required: true, min: 1},
    totalPrice: {type: Number, required: true},
    status: {type: String, default: 'pending', enum: ['pending', 'confirmed', 'delivered', 'failed']},
    prescription: {type: String, default: ''}
}, {timestamps: true});

const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;