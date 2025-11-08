import express from "express"


import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDb } from "./db/db.js";
import userRouter from "./routes/userRoute.js";
// server/index.js
import compression from 'compression';
import budgetRouter from "./routes/budget/budgetRoute.js";
import workflowRouter from "./routes/budget/workflowRoute.js";
import complianceRouter from "./routes/budget/compliancesRoute.js";
import expenseRouter from "./routes/budget/expenseRoute.js";
import reportRouter from "./routes/budget/reportRoute.js";

dotenv.config();

connectDb()
const app = express();


app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(morgan("dev"));






///routes
app.get("/", (req, res) => {
  res.send("growEasy backend is listening on port....");
});


app.use("/api/auth", userRouter)


///budget
app.use("/api/budgets", budgetRouter)
app.use("/api/workflow", workflowRouter)
app.use("/api/compliance", complianceRouter)
app.use("/api/expenses", expenseRouter)
app.use("/api/report", reportRouter)



// Start server
const port = process.env.PORT || 7000;

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

})




































// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import bodyParser from 'body-parser';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cron from 'node-cron';
// import nodemailer from 'nodemailer';
// import routes from './routes.js';
// import { configureHelmet, loginRateLimiter } from './utils.js';
// import User from './models/userSchema.js';
// import BillReminder from './models/billReminderSchema.js';
// import Expense from './models/expenseSchema.js';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;
// const EMAIL_USER = process.env.EMAIL_USER;
// const EMAIL_PASS = process.env.EMAIL_PASS;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// configureHelmet(app);
// app.use(loginRateLimiter);

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected')).catch(err => console.error(err));

// // Nodemailer Setup
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: { user: EMAIL_USER, pass: EMAIL_PASS },
// });

// // Cron Job for Recurring Expenses
// cron.schedule('0 0 1 * *', async () => {
//   try {
//     const recurringExpenses = await Expense.find({ isRecurring: true });
//     for (const exp of recurringExpenses) {
//       const newExpense = new Expense({
//         amount: exp.amount,
//         category: exp.category,
//         description: exp.description,
//         vendorId: exp.vendorId,
//         employeeId: exp.employeeId,
//         tenantId: exp.tenantId,
//         isRecurring: true,
//         recurrenceInterval: exp.recurrenceInterval,
//         currency: exp.currency,
//         isTaxDeductible: exp.isTaxDeductible,
//       });
//       await newExpense.save();
//     }
//   } catch (error) {
//     console.error('Recurring expense cron job failed:', error);
//   }
// });

// // Cron Job for Bill Reminders
// cron.schedule('0 0 * * *', async () => {
//   try {
//     const reminders = await BillReminder.find({ notified: false });
//     for (const reminder of reminders) {
//       if (new Date(reminder.dueDate) <= new Date()) {
//         await transporter.sendMail({
//           from: `"growEasy" <${EMAIL_USER}>`,
//           to: (await User.findById(reminder.tenantId)).email,
//           subject: 'Bill Reminder',
//           html: `<p>Reminder: ${reminder.description} is due on ${new Date(reminder.dueDate).toLocaleDateString()} for ${reminder.amount} ${reminder.currency}</p>`,
//         });
//         reminder.notified = true;
//         await reminder.save();
//       }
//     }
//   } catch (error) {
//     console.error('Bill reminder cron job failed:', error);
//   }
// });

// // Routes
// app.use(routes);

// // Start Server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));