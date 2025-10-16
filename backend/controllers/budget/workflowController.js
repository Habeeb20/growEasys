
import Workflow from "../../models/budget/workflowSchema.js"
export const createWorkflow = async (req, res) => {
  const { type, budgetId, expenseId, description } = req.body;
  console.log('Creating workflow for tenant:', req.user.tenantId);

  try {
    const workflow = new Workflow({
      type,
      budgetId,
      expenseId,
      description,
      createdBy: req.user.id,
      tenantId: req.user.tenantId,
    });
    await workflow.save();

    console.log('Workflow created successfully:', workflow._id);
    return res.status(201).json(workflow);
  } catch (error) {
    console.error('Create workflow error:', error);
    return res.status(400).json({ error: error.message });
  }
};

export const getWorkflows = async (req, res) => {
  console.log('Fetching workflows for tenant:', req.user.tenantId);

  try {
    const workflows = await Workflow.find({ tenantId: req.user.tenantId });
    return res.status(200).json(workflows);
  } catch (error) {
    console.error('Get workflows error:', error);
    return res.status(400).json({ error: error.message });
  }
};