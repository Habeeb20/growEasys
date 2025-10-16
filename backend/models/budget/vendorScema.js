import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  address: String,
  tenantId: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalSpent: { type: Number, default: 0 }, // Auto-update from expenses
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
  paymentHistory: [{ date: Date, amount: Number, method: String }],
}, { timestamps: true });

vendorSchema.index({ tenantId: 1, name: 1 });

export default mongoose.model('Vendor', vendorSchema);