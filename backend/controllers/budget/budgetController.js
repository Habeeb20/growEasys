
import bcrypt from 'bcrypt';
import User from "../../models/user/userSchema.js"
import shortid from 'shortid';
import { v4 as uuidv4 } from 'uuid';
import { sendEmailVerificationCode } from '../../utils/resources.js';
import Budget from "../../models/budget/budgetSchema.js"

export const updateBusinessDetails = async (req, res) => {
  const { businessName, address, state, lga } = req.body;
  console.log('Updating business details for user:', req.user.id);

  if (!businessName || !address || !state || !lga) {
    return res.status(400).json({ error: 'All business details are required' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    user.businessDetails = { businessName, address, state, lga };
    user.businessDetailsCompleted = true;
    await user.save();

    console.log('Business details updated successfully for user:', req.user.id);
    return res.status(200).json({ message: 'Business details updated successfully', user });
  } catch (error) {
    console.error('Update business details error:', error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

export const createAccount = async (req, res) => {
  console.log('Creating sub-account by owner:', req.user.id);

  if (req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Only owners can create accounts' });
  }

  const { email, role, permissions, firstName, lastName, phone } = req.body;
  if (!['staff', 'client'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already registered:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(shortid.generate(), 10);
    const uniqueUrl = `${process.env.BASE_URL}/login/${shortid.generate()}`;
    const userId = uuidv4();
    const uniqueNumber = await generateUniqueNumber();

    const newUser = new User({
      userId,
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      role,
      permissions: role === 'staff' ? permissions || ['create_reports', 'upload_quotations'] : ['view_reports'],
      createdBy: req.user.id,
      tenantId: req.user.tenantId,
      uniqueUrl,
      uniqueNumber,
      isVerified: true, // Auto-verify sub-accounts
      status: 'active',
    });

    await newUser.save();

    // Send email with unique URL
    await transporter.sendMail({
      to: email,
      subject: 'Your Budget Planner Account',
      html: `Your account has been created. Login here: <a href="${uniqueUrl}">${uniqueUrl}</a>`,
    });

    console.log('Account created successfully for email:', email);
    return res.status(201).json({ message: 'Account created', uniqueUrl });
  } catch (error) {
    console.error('Create account error:', error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

export const createBudget = async (req, res) => {
  const { name, type, amount, forecasts, scenarios, category, description, fiscalYear, tags, alertThreshold } = req.body;
  console.log('Creating budget for tenant:', req.user.tenantId);
  console.log(req.user)

  if (!name || !type || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid input: name, type, and positive amount required' });
  }

  try {
    const budget = new Budget({
      name,
      type,
      amount,
      forecasts,
      scenarios,
      category,
      description,
      fiscalYear,
      tags,
      alertThreshold,
      owner: req.user.id || req.user._id,
      tenantId: req.user.tenantId,
    
    });
    await budget.save();

    console.log('Budget created successfully:', budget._id);
    return res.status(201).json(budget);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Budget name already exists for your business' });
    }
    console.error('Create budget error:', error);
    return res.status(400).json({ error: error.message });
  }
};

export const getBudgets = async (req, res) => {
  console.log('Fetching budgets for tenant:', req.user.tenantId);

  try {
    const budgets = await Budget.find({ tenantId: req.user.tenantId });
    return res.status(200).json(budgets);
  } catch (error) {
    console.error('Get budgets error:', error);
    return res.status(400).json({ error: error.message });
  }
};