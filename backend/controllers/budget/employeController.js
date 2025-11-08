import Employee from "../../models/budget/EmployeeSchema.js";
import Expense from "../../models/budget/expenseSchema";
import Vendor from "../../models/budget/vendorScema.js";
import Workflow from "../../routes/budget/workflowRoute.js";
import { generate2FASecret, generateJwtToken, verify2FAToken } from "../../utils/resources.js";
import jwt from "jsonwebtoken"

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

export const createEmployee = async(req, res)=> {
    try {
        const {email, name} = req.body;
        const tenantId = req.user.tenantId;

        const twoFASecret = generate2FASecret()
        const token = generateJwtToken(null, email, tenantId)
            const employee = new Employee({ name, email, tenantId, token, twoFASecret: twoFASecret.base32 });
    await employee.save();

    await transporter.sendMail({
        from: `"growEasy" <${EMAIL_USER}>`,
        to: email,
        subject: 'Your Budget App Employee Account',
        html: `<p>Hi ${name},</p><p>Your account has been created. Use this link to log in: <a href="${loginUrl}">${loginUrl}</a></p><p>2FA Code: ${twoFASecret.otpauth_url}</p><p>This link expires in 7 days.</p>`,
    })
       res.status(200).json({ message: 'Employee account created and email sent' });
    } catch (error) {
       res.status(500).json({ error: `Failed to create employee: ${error.message}` });
    }
}

export const verifyEmployee = async(req, res) => {
     const { token, twoFACode } = req.body;
       try {
         const decoded = jwt.verify(token, JWT_SECRET);
         const employee = await Employee.findOne({ email: decoded.email, token });
         if (!employee) {
           return res.status(404).json({ error: 'Employee not found' });
         }
         const is2FAValid = verify2FAToken(employee.twoFASecret, twoFACode);
         if (!is2FAValid) {
           return res.status(401).json({ error: 'Invalid 2FA code' });
         }
         res.status(200).json({ email: employee.email, name: employee.name, tenantId: employee.tenantId });
       } catch (error) {
         res.status(401).json({ error: `Invalid or expired token: ${error.message}` });
       }
}




export const createVendor= async(req, res) => {
      const { name, email, address } = req.body;
       const tenantId = req.user.tenantId;
         try {
    const vendor = new Vendor({ name, email, address, tenantId });
    await vendor.save();
    res.status(201).json({ message: 'Vendor created', vendor });
  } catch (error) {
    res.status(500).json({ error: `Failed to create vendor: ${error.message}` });
  }
}

export const createExpenseByEmployee = async(req, res) => {
     const { amount, category, description, vendorId, isRecurring, recurrenceInterval, currency, isTaxDeductible } = req.body;
  const tenantId = req.user.tenantId;
  const employeeId = req.user.id ? null : (await Employee.findOne({ email: req.user.email }))._id;

      try {
    const expense = new Expense({
      amount,
      category,
      description,
      vendorId,
      employeeId,
      tenantId,
      isRecurring,
      recurrenceInterval,
      currency,
      isTaxDeductible,
    });
    await expense.save();

    if (employeeId) {
      const workflow = new Workflow({ expenseId: expense._id, tenantId, status: 'pending' });
      await workflow.save();
    }

    res.status(201).json({ message: 'Expense submitted', expense });
  } catch (error) {
    res.status(500).json({ error: `Failed to submit expense: ${error.message}` });
  }
}


export const createReportsByEmployee = async (req, res) => {
    const { expenseId, details } = req.body;
  const employee = await Employee.findOne({ email: req.user.email });
  if (!employee) {
    return res.status(403).json({ error: 'Only employees can submit reports' });
  }

  try {
    const report = new Report({ employeeId: employee._id, expenseId, details, tenantId: employee.tenantId });
    await report.save();
    res.status(201).json({ message: 'Report submitted', report });
  } catch (error) {
    res.status(500).json({ error: `Failed to submit report: ${error.message}` });
  }
}