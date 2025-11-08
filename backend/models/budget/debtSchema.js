import mongoose from "mongoose";


const DebtSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  interestRate: { type: Number },
  minimumPayment: { type: Number },
  tenantId: { type: Schema.Types.ObjectId, required: true },
  currency: { type: String, default: 'USD' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Debt', DebtSchema);