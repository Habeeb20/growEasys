import mongoose from "mongoose";

const workflowSchema = new mongoose.Schema({
  type: { type: String, enum: ['approval', 'comment'], required: true },
  budgetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' },
  expenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense' },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tenantId: { type: String, required: true },
}, { timestamps: true });
export default mongoose.model('Workflow', workflowSchema);
