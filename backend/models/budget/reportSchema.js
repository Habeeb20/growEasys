import mongoose from "mongoose";
const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'excel'], required: true },
  data: { type: Object, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tenantId: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
