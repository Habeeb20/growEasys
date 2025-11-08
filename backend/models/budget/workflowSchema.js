import mongoose from "mongoose";
import { Schema } from "mongoose";
const workflowSchema = new mongoose.Schema({
   expenseId: { type: Schema.Types.ObjectId, ref: 'Expense', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approverId: { type: Schema.Types.ObjectId, ref: 'User' },
  tenantId: { type: Schema.Types.ObjectId, required: true },
  comments: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
}, { timestamps: true });
export default mongoose.model('Workflow', workflowSchema);
