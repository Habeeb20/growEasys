import { Router } from 'express';

import { authenticateToken, checkBusinessDetails, checkPermission } from '../../utils/resources.js';
import { createReport, getReports } from '../../controllers/budget/reportController.js';

const reportRouter = Router();

reportRouter.post('/', authenticateToken, checkBusinessDetails, checkPermission('create_reports'), createReport);
reportRouter.get('/', authenticateToken, checkBusinessDetails, checkPermission('view_reports'), getReports);

export default reportRouter;