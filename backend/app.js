import express from "express"


import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDb } from "./db/db.js";
import userRouter from "./routes/userRoute.js";
// server/index.js
import compression from 'compression';

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


app.use("/api/user", userRouter)



// Start server
const port = process.env.PORT || 7000;

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

})

