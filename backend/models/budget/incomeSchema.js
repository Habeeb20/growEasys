import mongoose from "mongoose";

const IncomeSchema = new Schema({
  amount: { type: Number, required: true },
  source: { type: String, required: true },
  tenantId: { type: Schema.Types.ObjectId, required: true },
  currency: { type: String, default: 'USD' },
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.model('Income', IncomeSchema);

