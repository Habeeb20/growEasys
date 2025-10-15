import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['departmental', 'project'], required: true },
  amount: { type: Number, required: true },
  allocated: { type: Number, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tenantId: { type: String, required: true },
  forecasts: [{ month: String, amount: Number }],
  scenarios: [{ name: String, data: Object }],
}, { timestamps: true });

export default mongoose.model('Budget', budgetSchema);
