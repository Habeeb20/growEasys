import mongoose from "mongoose";

const BillReminderSchema = new Schema({
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  tenantId: { type: Schema.Types.ObjectId, required: true },
  notified: { type: Boolean, default: false },
  currency: { type: String, default: 'USD' },
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.model('BillReminder', BillReminderSchema);