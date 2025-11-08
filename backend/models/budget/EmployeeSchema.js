import mongoose from "mongoose";


const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, required: true },
  token: { type: String },
  twoFASecret: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Employee', EmployeeSchema);