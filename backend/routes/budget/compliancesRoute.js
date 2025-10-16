import { Router } from 'express';

import { authenticateToken, checkBusinessDetails } from '../../utils/resources.js';
import { createCompliance, getCompliance } from '../../controllers/budget/complianceController.js';

const complianceRouter = Router();

complianceRouter.post('/', authenticateToken, checkBusinessDetails, createCompliance);
complianceRouter.get('/', authenticateToken, checkBusinessDetails, getCompliance);

export default complianceRouter;