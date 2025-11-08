import mongoose from "mongoose";

const SavingsGoalSchema = new Schema({
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  tenantId: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.model('SavingsGoal', SavingsGoalSchema);