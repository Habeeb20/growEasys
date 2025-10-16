import { Router } from 'express';

import { authenticateToken, checkBusinessDetails } from '../../utils/resources.js';
import { createWorkflow, getWorkflows } from '../../controllers/budget/workflowController.js';

const workflowRouter = Router();

workflowRouter.post('/', authenticateToken, checkBusinessDetails, createWorkflow);
workflowRouter.get('/', authenticateToken, checkBusinessDetails, getWorkflows);

export default workflowRouter;