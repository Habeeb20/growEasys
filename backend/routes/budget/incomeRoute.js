import { Router } from 'express';
import { updateWorkflow } from './controllers/workflowController.js';
import { addIncome } from './controllers/incomeController.js';
import { createSavingsGoal, updateSavingsGoal } from './controllers/savingsGoalController.js';
import { createCategory } from './controllers/categoryController.js';
import { createBillReminder } from './controllers/billReminderController.js';
import { createDebt, getDebtPayoffPlan } from './controllers/debtController.js';
import { createBudget } from './controllers/budgetController.js';
import { getForecast } from './controllers/forecastController.js';
import { getAlerts } from './controllers/alertController.js';
import { exportData } from './controllers/exportController.js';
import { getTaxReport } from './controllers/taxReportController.js';
import { getReportsInsights } from './controllers/reportController.js';
import { authenticateToken, checkBusinessDetails, checkPermission, validateTransactionInput } from './utils.js';

const router = Router();

router.put('/api/workflows/:id', authenticateToken, checkPermission('approve_expenses'), updateWorkflow);
router.post('/api/incomes', authenticateToken, checkBusinessDetails, validateTransactionInput, addIncome);
router.post('/api/savings-goals', authenticateToken, checkBusinessDetails, createSavingsGoal);
router.put('/api/savings-goals/:id', authenticateToken, checkBusinessDetails, updateSavingsGoal);
router.post('/api/categories', authenticateToken, checkBusinessDetails, createCategory);
router.post('/api/bill-reminders', authenticateToken, checkBusinessDetails, createBillReminder);
router.post('/api/debts', authenticateToken, checkBusinessDetails, validateTransactionInput, createDebt);
router.get('/api/debts/payoff', authenticateToken, checkBusinessDetails, getDebtPayoffPlan);
router.post('/api/budgets', authenticateToken, checkBusinessDetails, createBudget);
router.get('/api/forecast', authenticateToken, checkBusinessDetails, getForecast);
router.get('/api/alerts', authenticateToken, checkBusinessDetails, getAlerts);
router.get('/api/export', authenticateToken, checkBusinessDetails, exportData);
router.get('/api/tax-report', authenticateToken, checkBusinessDetails, getTaxReport);
router.get('/api/reports-insights', authenticateToken, checkPermission('view_reports'), getReportsInsights);

export default router;