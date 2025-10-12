import express from "express"
import { dashboard, forgotPassword, login, resendVerificationCode, resetPassword, signup, verifyEmail } from "../controllers/userController.js"
import { authenticateToken } from "../utils/resources.js"


const userRouter =  express.Router()

userRouter.post("/signup", signup)
userRouter.post("/login", login)
userRouter.post("/verify-email", verifyEmail)
userRouter.post("/resendcode", resendVerificationCode)
userRouter.post("/forgotpassword", forgotPassword)
userRouter.post("/resendpassword", resetPassword)
userRouter.get("/dashboard", authenticateToken, dashboard)


export default userRouter