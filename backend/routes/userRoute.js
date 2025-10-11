import express from "express"
import { forgotPassword, login, resendVerificationCode, resetPassword, signup, verifyEmail } from "../controllers/userController.js"


const userRouter =  express.Router()

userRouter.post("/signup", signup)
userRouter.post("/login", login)
userRouter.post("/verifyemail", verifyEmail)
userRouter.post("/resendcode", resendVerificationCode)
userRouter.post("/forgotpassword", forgotPassword)
userRouter.post("/resendpassword", resetPassword)



export default userRouter