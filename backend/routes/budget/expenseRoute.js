// import { Router } from "express";
// import { authenticateToken, checkBusinessDetails, checkPermission } from "../../utils/resources.js";
// import { createExpense, getExpenses } from "../../controllers/budget/expenseController.js";

// const expenseRouter = Router();

// // expenseRouter.post('/', authenticateToken, checkBusinessDetails, checkPermission('upload_quotations'), createExpense);

// expenseRouter.post('/', authenticateToken, checkBusinessDetails, checkPermission('upload_quotations'), createExpense);
// expenseRouter.get('/', authenticateToken, checkBusinessDetails, getExpenses);


// export default expenseRouter



import { Router } from "express";
import { authenticateToken, checkBusinessDetails, checkPermission } from "../../utils/resources.js";
import { 
  createExpense, 
  getExpenses, 
  approveExpense, 
  reimburseExpense, 
  payVendorInvoice, 
  getExpenseSummary,
  generateOwnerAuthCode 
} from "../../controllers/budget/expenseController.js";

const expenseRouter = Router();

// Create a new expense (employee submission or admin with authCode)
expenseRouter.post(
  '/', 
  authenticateToken, 
  checkBusinessDetails, 
  checkPermission('upload_quotations'), 
  createExpense
);

// Get all expenses (filtered by tenant, status, etc.)
expenseRouter.get(
  '/', 
  authenticateToken, 
  checkBusinessDetails, 
  checkPermission('view_reports'), // Or a specific 'view_expenses' permission
  getExpenses
);

// Approve an expense (requires 4-digit authCode; updates status and budget)
expenseRouter.patch(
  '/:id/approve', 
  authenticateToken, 
  checkBusinessDetails, 
  checkPermission('approve_expenses'), // New permission for approvers
  approveExpense
);

// Reimburse an expense (quick payout to employee after approval)
expenseRouter.patch(
  '/:id/reimburse', 
  authenticateToken, 
  checkBusinessDetails, 
  checkPermission('reimburse_expenses'), // Permission for finance team
  reimburseExpense
);

// Pay vendor invoice (marks as paid, updates vendor history)
expenseRouter.patch(
  '/:id/pay-invoice', 
  authenticateToken, 
  checkBusinessDetails, 
  checkPermission('pay_vendors'), // Permission for payments
  payVendorInvoice
);

// Get expense summary (unbudgeted totals, vendor spends, etc.)
expenseRouter.get(
  '/summary', 
  authenticateToken, 
  checkBusinessDetails, 
  checkPermission('view_reports'), 
  getExpenseSummary
);

// Generate and send owner auth code (one-time setup for expense approvals)
expenseRouter.post(
  '/generate-auth-code', 
  authenticateToken, 
  checkBusinessDetails, 
  checkPermission('manage_settings'), // Owner-only, or role check in controller
  generateOwnerAuthCode
);

export default expenseRouter;