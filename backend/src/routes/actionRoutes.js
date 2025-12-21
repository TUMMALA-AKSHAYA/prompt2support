import express from 'express';

import {
  getPendingActions,
  executeAction
} from '../controllers/actionController.js';

const router = express.Router();

// Fetch pending actions for MSME owner approval
router.get('/pending', getPendingActions);

// Execute approved action
router.post('/execute', executeAction);

export default router;
