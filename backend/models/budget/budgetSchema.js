// import mongoose from "mongoose";

// const budgetSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   type: { type: String, enum: ['departmental', 'project'], required: true },
//   amount: { type: Number, required: true },
//   allocated: { type: Number, default: 0 },
//   owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   tenantId: { type: String, required: true },
//   forecasts: [{ month: String, amount: Number }],
//   scenarios: [{ name: String, data: Object }],
// }, { timestamps: true });

// export default mongoose.model('Budget', budgetSchema);



import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    // Unique per tenant to prevent duplicates
    unique: [true, 'Budget name must be unique per business'], 
  },
  type: { type: String, enum: ['departmental', 'project'], required: true },
  amount: { 
    type: Number, 
    required: true,
    min: [0, 'Amount must be positive'],
  },
  allocated: { type: Number, default: 0 }, // Pre-allocated sub-budgets**
  spent: { type: Number, default: 0 }, // Actual spent (update via expenses)**
  remaining: { type: Number, default: function() { return this.amount; } }, // Auto-compute**
  utilizationPercentage: { type: Number, default: 0 }, // (spent / amount) * 100**
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Approval tracking**
  tenantId: { type: String, required: true },
  category: { type: String, enum: ['operations', 'marketing', 'rd', 'hr', 'other'], default: 'other' },
  description: { type: String },
  fiscalYear: { type: String, default: new Date().getFullYear().toString() }, // e.g., '2025'**
  tags: [{ type: String }],
  forecasts: [{ 
    period: { type: String, required: true }, // e.g., '2025-01' or 'Q1-2025'**
    projected: { type: Number },
    actual: { type: Number, default: 0 }
  }],
  scenarios: [{ 
    name: String, 
    data: Object,
    isActive: { type: Boolean, default: false }
  }],
  status: { 
    type: String, 
    enum: ['draft', 'pending_approval', 'approved', 'active', 'closed', 'archived'], 
    default: 'draft' 
  },
 approvedAt: { type: Date },
  alertThreshold: { type: Number, default: 80 }, // % for alerts**
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }], // Link expenses**
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  version: { type: Number, default: 1 },
}, { timestamps: true });

// Indexes for fast queries
budgetSchema.index({ tenantId: 1, status: 1 });
budgetSchema.index({ owner: 1 });
budgetSchema.index({ fiscalYear: 1 });

// Pre-save hook: Update remaining/utilization
budgetSchema.pre('save', function(next) {
  this.remaining = this.amount - this.spent;
  this.utilizationPercentage = this.amount > 0 ? (this.spent / this.amount) * 100 : 0;
  if (this.status === 'approved' && !this.approvedAt) {
    this.approvedAt = new Date();
  }
  next();
});

// Virtual for soft-delete queries (exclude deleted in finds)
budgetSchema.pre(/^find/, function() {
  this.where({ isDeleted: false });
});

export default mongoose.model('Budget', budgetSchema);