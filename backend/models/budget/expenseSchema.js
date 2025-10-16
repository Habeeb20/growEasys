import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { 
    type: Number, 
    required: true,
    min: [0, 'Amount must be positive'],
  },
  date: { 
    type: Date, 
    required: true,
  },
  receiptUrl: { type: String },
  attachments: [{ type: String }], // For invoices/receipts
  invoiceDetails: { // For upload/review/pay invoices
    invoiceNumber: String,
    dueDate: Date,
    taxAmount: { type: Number, default: 0 },
    totalWithTax: Number,
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'reimbursed', 'paid_to_vendor'], 
    default: 'pending' 
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  rejectionReason: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tenantId: { type: String, required: true },
  budgetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' }, // Auto-set, null = unbudgeted
  description: { type: String, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }, // Link for tracking
  paymentMethod: { type: String, enum: ['cash', 'card', 'bank_transfer', 'invoice'], default: 'card' },
  currency: { type: String, default: 'NGN' },
  tags: [{ type: String }],
  costCenter: { type: String },
  projectCode: { type: String },
  isRecurring: { type: Boolean, default: false },
  recurrencePattern: { type: String, enum: ['monthly', 'quarterly', 'annual'] },
  policyViolation: { type: Boolean, default: false },
  reimbursed: { type: Boolean, default: false }, // Quick reimbursement flag
  reimbursedAt: { type: Date },
  reimbursedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authCodeUsed: { type: String }, // Store the 4-digit code used for this expense (audit)
  auditLog: [{ 
    action: String, 
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    at: { type: Date, default: Date.now }, 
    details: String 
  }],
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
}, { timestamps: true });

// Indexes...

// Pre-save: Auto-link budget (example: match category and active budget)
expenseSchema.pre('save', async function(next) {
  if (this.isNew && !this.budgetId) {
    const Budget = mongoose.model('Budget');
    const matchingBudget = await Budget.findOne({
      tenantId: this.tenantId,
      category: this.category,
      status: 'active',
      remaining: { $gte: this.amount },
    }).sort({ remaining: -1 }); // Largest remaining
    if (matchingBudget) {
      this.budgetId = matchingBudget._id;
    } else {
      this.policyViolation = true; // Unbudgeted
    }
  }
  // Audit
  this.auditLog.push({ action: 'created', by: this.createdBy, details: 'Submitted' });
  next();
});

// Post-save: Update vendor/budget if approved
expenseSchema.post('save', async function(doc) {
  if (doc.status === 'approved') {
    // Update budget
    if (doc.budgetId) {
      const Budget = mongoose.model('Budget');
      await Budget.findByIdAndUpdate(doc.budgetId, { $inc: { spent: doc.amount } });
    }
    // Update vendor
    if (doc.vendorId) {
      const Vendor = mongoose.model('Vendor');
      await Vendor.findByIdAndUpdate(doc.vendorId, { 
        $inc: { totalSpent: doc.amount },
        $push: { expenses: doc._id }
      });
    }
  }
});

export default mongoose.model('Expense', expenseSchema);