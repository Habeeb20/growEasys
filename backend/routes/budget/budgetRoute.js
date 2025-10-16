import { Router } from 'express';
import { updateBusinessDetails, createAccount, createBudget, getBudgets} from '../../controllers/budget/budgetController.js';
import { authenticateToken, checkBusinessDetails } from '../../utils/resources.js'
import { checkPermission } from '../../utils/resources.js';
const budgetRouter = Router();

budgetRouter.put('/business-details', authenticateToken, updateBusinessDetails);
budgetRouter.post('/create-account', authenticateToken, checkBusinessDetails, createAccount);
// budgetRouter.post('/', authenticateToken, checkBusinessDetails, checkPermission('create_budget'), createBudget)
budgetRouter.post('/', authenticateToken, checkBusinessDetails,  createBudget)
budgetRouter.get('/', authenticateToken, checkBusinessDetails, getBudgets)

export default budgetRouter;


