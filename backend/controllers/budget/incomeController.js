import Income from "../../models/budget/incomeSchema";

export const approveWorkflow = async(req, res) => {

}


export const updateWorkflow = async (req, res) => {
  const { status, comments } = req.body;
  const { id } = req.params;

  try {
    const workflow = await Workflow.findById(id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    workflow.status = status;
    workflow.comments = comments;
    workflow.approverId = req.user.id;
    workflow.updatedAt = Date.now();
    await workflow.save();
    res.status(200).json({ message: `Expense ${status}`, workflow });
  } catch (error) {
    res.status(500).json({ error: `Failed to update workflow: ${error.message}` });
  }
};


export const addIncome = async (req, res) => {
  const { amount, source, currency } = req.body;
  const tenantId = req.user.tenantId;

  try {
    const income = new Income({ amount, source, tenantId, currency });
    await income.save();
    res.status(201).json({ message: 'Income recorded', income });
  } catch (error) {
    res.status(500).json({ error: `Failed to record income: ${error.message}` });
  }
};


export const createSavingsGoal = async (req, res) => {
  const { name, targetAmount } = req.body;
  const tenantId = req.user.tenantId;

  try {
    const savingsGoal = new SavingsGoal({ name, targetAmount, tenantId });
    await savingsGoal.save();
    res.status(201).json({ message: 'Savings goal created', savingsGoal });
  } catch (error) {
    res.status(500).json({ error: `Failed to create savings goal: ${error.message}` });
  }
};

export const updateSavingsGoal = async (req, res) => {
  const { currentAmount } = req.body;
  const { id } = req.params;

  try {
    const savingsGoal = await SavingsGoal.findById(id);
    if (!savingsGoal) {
      return res.status(404).json({ error: 'Savings goal not found' });
    }
    savingsGoal.currentAmount = currentAmount;
    await savingsGoal.save();

    if (savingsGoal.currentAmount >= savingsGoal.targetAmount) {
      const achievement = new Achievement({
        name: 'Savings Goal Achieved',
        description: `Completed ${savingsGoal.name}`,
        userId: req.user.id,
        tenantId: savingsGoal.tenantId,
      });
      await achievement.save();
    }

    res.status(200).json({ message: 'Savings goal updated', savingsGoal });
  } catch (error) {
    res.status(500).json({ error: `Failed to update savings goal: ${error.message}` });
  }
};



export const createBillReminder = async (req, res) => {
  const { description, dueDate, amount, currency } = req.body;
  const tenantId = req.user.tenantId;

  try {
    const billReminder = new BillReminder({ description, dueDate, amount, tenantId, currency });
    await billReminder.save();
    res.status(201).json({ message: 'Bill reminder created', billReminder });
  } catch (error) {
    res.status(500).json({ error: `Failed to create bill reminder: ${error.message}` });
  }
};




export const createDebt = async (req, res) => {
  const { name, amount, interestRate, minimumPayment, currency } = req.body;
  const tenantId = req.user.tenantId;

  try {
    const debt = new Debt({ name, amount, interestRate, minimumPayment, tenantId, currency });
    await debt.save();
    res.status(201).json({ message: 'Debt created', debt });
  } catch (error) {
    res.status(500).json({ error: `Failed to create debt: ${error.message}` });
  }
};

export const getDebtPayoffPlan = async (req, res) => {
  const { strategy = 'snowball' } = req.query;
  const tenantId = req.user.tenantId;

  try {
    const debts = await Debt.find({ tenantId });
    let sortedDebts = [...debts];
    if (strategy === 'snowball') {
      sortedDebts.sort((a, b) => a.amount - b.amount);
    } else if (strategy === 'avalanche') {
      sortedDebts.sort((a, b) => b.interestRate - a.interestRate);
    }

    const payoffPlan = sortedDebts.map(debt => ({
      name: debt.name,
      remainingAmount: debt.amount,
      monthlyPayment: debt.minimumPayment,
      estimatedMonths: Math.ceil(debt.amount / debt.minimumPayment),
    }));

    res.status(200).json({ payoffPlan });
  } catch (error) {
    res.status(500).json({ error: `Failed to calculate payoff plan: ${error.message}` });
  }
};


export const getForecast = async (req, res) => {
  const tenantId = req.user.tenantId;
  const { months = 3 } = req.query;

  try {
    const incomes = await Income.find({ tenantId });
    const expenses = await Expense.find({ tenantId });
    const recurringExpenses = expenses.filter(exp => exp.isRecurring);

    const monthlyIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    let monthlyExpenses = expenses.reduce((sum, exp) => sum + (exp.isRecurring ? 0 : exp.amount), 0);
    recurringExpenses.forEach(exp => {
      monthlyExpenses += exp.amount;
    });

    const forecast = [];
    let balance = monthlyIncome - monthlyExpenses;
    for (let i = 1; i <= months; i++) {
      forecast.push({ month: i, balance });
      balance += monthlyIncome - monthlyExpenses;
    }

    res.status(200).json({ forecast });
  } catch (error) {
    res.status(500).json({ error: `Failed to generate forecast: ${error.message}` });
  }
};



export const getAlerts = async (req, res) => {
  const tenantId = req.user.tenantId;

  try {
    const budgets = await Budget.find({ tenantId });
    const expenses = await Expense.find({ tenantId });
    const alerts = [];

    budgets.forEach(budget => {
      const totalSpent = expenses
        .filter(exp => exp.createdAt >= new Date(new Date().setMonth(new Date().getMonth() - 1)))
        .reduce((sum, exp) => sum + exp.amount, 0);
      if (totalSpent > budget.amount * 0.9) {
        alerts.push(`Warning: Budget ${budget.name} is nearing its limit (${totalSpent}/${budget.amount})`);
      }
    });

    res.status(200).json({ alerts });
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch alerts: ${error.message}` });
  }
};



export const getTaxReport = async (req, res) => {
  const tenantId = req.user.tenantId;

  try {
    const taxDeductibleExpenses = await Expense.find({ tenantId, isTaxDeductible: true });
    res.status(200).json({ taxDeductibleExpenses });
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch tax report: ${error.message}` });
  }
};


export const exportData = async (req, res) => {
  const tenantId = req.user.tenantId;

  try {
    const expenses = await Expense.find({ tenantId }).populate('vendorId employeeId');
    const fields = ['amount', 'category', 'description', 'vendorId.name', 'employeeId.name', 'currency', 'isTaxDeductible', 'createdAt'];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(expenses);
    res.header('Content-Type', 'text/csv');
    res.attachment('expenses.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: `Failed to export data: ${error.message}` });
  }
};