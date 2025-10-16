import mongoose, { Types } from "mongoose";
import { generate4DigitCode, sendEmailVerificationCode } from "../../utils/resources.js";
import { v4 as uuidv4 } from 'uuid';
const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4, 
  },
 


  firstName:{ type: String, required: true },
   lastName:{ type: String, required: true },
    phone:{ type: String, required: true },

  email: { type: String, required: true, unique: true },
  password: { type: String },
    role: { type: String, enum: ['owner', 'staff', 'client', 'viewer'], default: 'owner' },
    businessDetails: {
      businessName: String,
      address: String,
      state: String,
      lga: String,
    },
      businessDetailsCompleted: { type: Boolean, default: false },  //for one time 
    uniqueUrl: { type: String, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tenantId: { type: String }, // For multi-tenancy
    permissions: [{ type: String, default: "permission" }], 



    status: { type: String, enum: ['active', 'blocked', 'pending'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    registrationDate: { type: Date, default: Date.now },
    uniqueNumber: { type: String, unique: true },
   verificationCode: String,
   verificationCodeExpiresAt: Date,
   verificationCode: String,
  verificationCodeExpiresAt: Date,
 
    isFeatured: {
      type: Boolean,
      default: false, 
    },
expenseAuthCode: { type: String }, // 4-digit PIN for expense approvals
  expenseAuthCodeGeneratedAt: { type: Date },
  }, {timestamps: true})

userSchema.methods.generateExpenseAuthCode = async function() {
  if (!this.expenseAuthCode) {
    this.expenseAuthCode = generate4DigitCode();
    this.expenseAuthCodeGeneratedAt = new Date();
    await this.save();
    await sendEmailVerificationCode(this.email, this.expenseAuthCode); // Reuses your function
    console.log(`Expense auth code sent to ${this.email}: ${this.expenseAuthCode}`); // Dev log only
  }
  return this.expenseAuthCode; // For testing; don't expose in prod responses
};


export default mongoose.model("User", userSchema)






































