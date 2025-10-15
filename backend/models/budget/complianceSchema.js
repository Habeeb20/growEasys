import mongoose from "mongoose";


const complianceSchema = new mongoose.Schema({
  type: { type: String, enum: ['compliance', 'risk', 'esg'], required: true },
  metric: { type: String, required: true },
  value: { type: Number, required: true },
  tenantId: { type: String, required: true },
}, { timestamps: true });

export default  mongoose.model('Compliance', complianceSchema);
