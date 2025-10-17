
import Expense from "../../models/budget/expenseSchema.js";
import  Budget from "../../models/budget/budgetSchema.js";
import Vendor from "../../models/budget/vendorScema.js";
import User from "../../models/user/userSchema.js";
import mongoose from "mongoose";
import { generateJwtToken, generate4DigitCode, sendEmailVerificationCode } from "../../utils/resources.js";


export const createExpense = async (req, res) => {
  const { 
    category, amount, date, receiptUrl, attachments, description, vendorName, vendorEmail, 
    paymentMethod, taxAmount, currency, tags, costCenter, projectCode, isRecurring, 
    recurrencePattern, invoiceDetails, authCode 
  } = req.body;

  // Required validation...
  if (!category || !amount || !date || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Security: Verify authCode if role requires (e.g., high amount)
  let approvedStatus = 'pending';
  if (authCode) {
    const owner = await User.findOne({ tenantId: req.user.tenantId, role: 'owner' });
    if (!owner || owner.expenseAuthCode !== authCode) {
      return res.status(403).json({ error: 'Invalid authorization code' });
    }
    approvedStatus = 'approved'; // Auto-approve if code valid
    // Optional: Generate new code after use? Or keep reusable.
  }

  // Auto-create/lookup vendor
  let vendorId = null;
  if (vendorName) {
    let vendor = await Vendor.findOne({ name: vendorName, tenantId: req.user.tenantId });
    if (!vendor) {
      vendor = new Vendor({ name: vendorName, email: vendorEmail, tenantId: req.user.tenantId, createdBy: req.user.id });
      await vendor.save();
    }
    vendorId = vendor._id;
  }

  try {
    const expense = new Expense({
      category, amount, date: new Date(date), receiptUrl, attachments,
      description, vendorId, paymentMethod, taxAmount, currency, tags,
      costCenter, projectCode, isRecurring, recurrencePattern,
      invoiceDetails, status: approvedStatus, authCodeUsed: authCode || null,
      createdBy: req.user.id, tenantId: req.user.tenantId,
    });
    await expense.save();

   
    if (approvedStatus === 'approved' && amount < 500) { // Example rule
      expense.reimbursed = true;
      expense.reimbursedAt = new Date();
      expense.reimbursedBy = req.user.id; // Or owner
      await expense.save();
    }

    return res.status(201).json(expense);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


export const reimburseExpense = async (req, res) => {
  const { id } = req.params;
  const expense = await Expense.findById(id);

  expense.reimbursed = true;
  expense.reimbursedAt = new Date();
  expense.reimbursedBy = req.user.id;
  await expense.save();
  res.json({ message: 'Reimbursed' });
};




export const approveExpense = async (req, res) => {
  const { id } = req.params;
  const { authCode, rejectionReason } = req.body; // authCode required

  const owner = await User.findOne({ tenantId: req.user.tenantId, role: 'owner' });
  if (owner.expenseAuthCode !== authCode) {
    return res.status(403).json({ error: 'Invalid code' });
  }

  const expense = await Expense.findById(id);
  if (!expense || expense.tenantId !== req.user.tenantId) return res.status(404).json({ error: 'Not found' });

  expense.status = 'approved';
  expense.approvedBy = req.user.id;
  expense.approvedAt = new Date();
  expense.authCodeUsed = authCode;
  expense.auditLog.push({ action: 'approved', by: req.user.id, details: 'Approved with code' });
  await expense.save(); // Triggers budget/vendor update

  // Quick reimbursement
  if (expense.createdBy.toString() !== req.user.id) { // Employee submit
    expense.reimbursed = true;
    expense.reimbursedAt = new Date();
    await expense.save();
    // Optional: Integrate payment API (e.g., Paystack)
  }

  res.json(expense);
};



export const payVendorInvoice = async (req, res) => {
  const { expenseId, paymentMethod } = req.body;
  const expense = await Expense.findById(expenseId);
  if (expense.status !== 'approved' || !expense.invoiceDetails) return res.status(400).json({ error: 'Invalid' });

  expense.status = 'paid_to_vendor';
  expense.auditLog.push({ action: 'paid', details: `Paid via ${paymentMethod}` });
  await expense.save();

  // Update vendor payment history
  await Vendor.findByIdAndUpdate(expense.vendorId, {
    $push: { paymentHistory: { date: new Date(), amount: expense.amount, method: paymentMethod } }
  });

  // Integrate real payment gateway here
  res.json({ message: 'Invoice paid' });
};


export const generateOwnerAuthCode = async (req, res) => {
  const owner = await User.findById(req.user.id);
  if (req.user.role !== 'owner') return res.status(403).json({ error: 'Owners only' });

  const code = await owner.generateExpenseAuthCode(); // Sends email
  res.json({ message: 'Code generated and sent' }); // Don't return code!
};


// export const getExpenseSummary = async (req, res) => {
//   const unbudgetedTotal = await Expense.aggregate([
//     { $match: { tenantId: req.user.tenantId, budgetId: null, status: 'approved' } },
//     { $group: { _id: null, total: { $sum: '$amount' } } }
//   ]);
//   const vendorTotals = await Expense.aggregate([
//     { $match: { tenantId: req.user.tenantId, vendorId: { $exists: true } } },
//     { $group: { _id: '$vendorId', total: { $sum: '$amount' } } },
//     { $lookup: { from: 'vendors', localField: '_id', foreignField: '_id', as: 'vendor' } }
//   ]);
//   res.json({ unbudgetedTotal: unbudgetedTotal[0]?.total || 0, vendorTotals });
// };





// GET /api/expenses - Fetch paginated, filtered expenses
export const getExpenses = async (req, res) => {
  console.log('Fetching expenses for tenant:', req.user.tenantId);

  try {
    // Extract query params
    const {
      page = 1,
      limit = 10,
      status,
      category,
      vendorId,
      startDate,
      endDate,
      search,
      isUnbudgeted,
      sortBy = 'date',
      sortOrder = 'desc',
    } = req.query;

    // Build filter object
    const filter = {
      tenantId: req.user.tenantId,
      isDeleted: false,
    };

    if (status) {
      const statuses = status.split(',').map(s => s.trim());
      filter.status = { $in: statuses };
    }
    if (category) filter.category = new RegExp(category, 'i'); // Case-insensitive
    if (vendorId) filter.vendorId = vendorId;
    if (isUnbudgeted === 'true') filter.budgetId = null;
    if (search) {
      filter.$or = [
        { description: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') },
      ];
    }
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Pagination setup
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Aggregate for total count and data
    const [expenses, total] = await Promise.all([
      Expense.find(filter)
        .select('-auditLog -__v') // Exclude sensitive/large fields
        .populate('vendorId', 'name email') // Vendor details
        .populate('budgetId', 'name category') // Budget link
        .populate('createdBy', 'firstName lastName email') // Creator info
        .populate('approvedBy', 'firstName lastName')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(), // Faster, no mongoose docs
      Expense.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    console.log(`Fetched ${expenses.length} expenses (page ${page}/${totalPages})`);
    return res.status(200).json({
      expenses,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Get expenses error, view it here:', error);
    return res.status(500).json({ error: 'Failed to fetch expenses: ' + error.message });
  }
};

// Bonus: GET /api/expenses/summary - For dashboards (unbudgeted total, vendor totals, etc.)
export const getExpenseSummary = async (req, res) => {
  console.log('Fetching expense summary for tenant:', req.user.tenantId);

  try {
    const match = { tenantId: req.user.tenantId, isDeleted: false, status: 'approved' }; // Only approved for spend

    const [unbudgetedRes, vendorTotalsRes, categoryTotalsRes] = await Promise.all([
      // Unbudgeted total
      Expense.aggregate([
        { $match: { ...match, budgetId: null } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      // Vendor spend totals
      Expense.aggregate([
        { $match: { ...match, vendorId: { $exists: true } } },
        { $group: { _id: '$vendorId', total: { $sum: '$amount' } } },
        {
          $lookup: {
            from: 'vendors', // Collection name
            localField: '_id',
            foreignField: '_id',
            as: 'vendor',
          },
        },
        { $unwind: '$vendor' },
        { $project: { vendorName: '$vendor.name', total: 1 } },
      ]),
      // Category breakdown
      Expense.aggregate([
        { $match: match },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
      ]),
    ]);

    const unbudgetedTotal = unbudgetedRes[0]?.total || 0;

    console.log('Expense summary generated');
    return res.status(200).json({
      unbudgetedTotal,
      vendorTotals: vendorTotalsRes,
      categoryTotals: categoryTotalsRes,
      overallTotal: await Expense.aggregate([{ $match: match }, { $group: { _id: null, total: { $sum: '$amount' } } }]).then(res => res[0]?.total || 0),
    });
  } catch (error) {
    console.error('Get summary error:', error);
    return res.status(500).json({ error: 'Failed to fetch summary: ' + error.message });
  }
};