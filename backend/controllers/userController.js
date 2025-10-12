import { hashPassword, verifyPassword, generate4DigitCode, sendEmailVerificationCode, 
    validateEmailVerificationInput, generateJwtToken, validateRegisterInput, loginRateLimiter,
     authenticateToken, validationResetPasswordInput, resetPasswordLimiter, generateUniqueNumber } from '../utils/resources.js';
import User from "../models/user/userSchema.js"
import { v4 as uuidv4 } from 'uuid';

// Signup Controller
export const signup = [
  validateRegisterInput,
  async (req, res) => {
    try {
      const { firstName, lastName, phone, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Generate verification code and unique number
      const verificationCode = generate4DigitCode();
      const uniqueNumber = await generateUniqueNumber();
      const userId = uuidv4();

      // Create new user
      const user = new User({
        userId,
     firstName, 
     lastName, 
     phone,
        email,
        password: hashedPassword,
        verificationCode,
        verificationCodeExpiresAt: Date.now() + 3600000, // Code expires in 1 hour
        uniqueNumber,
        isVerified: false,
        status: 'pending', // Set to pending until email verification
      });

      await user.save();

      // Send verification email
      await sendEmailVerificationCode(email, verificationCode);

      res.status(201).json({ message: 'User registered. Please verify your email.' });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Registration failed: ' + error.message });
    }
  }
];

// Login Controller
export const login = [
  loginRateLimiter,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Check if email is verified
      if (user.status !== 'active') {
        return res.status(403).json({ error: 'Please verify your email first' });
      }

      // Generate JWT token
      const token = generateJwtToken(user._id, user.email);

      res.status(200).json({ token, message: 'Login successful' });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed: ' + error.message });
    }
  }
];

// Email Verification Controller
export const verifyEmail = [
  validateEmailVerificationInput,
  async (req, res) => {
    try {
      const { email, code } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check verification code and expiration
      if (user.verificationCode !== code || user.verificationCodeExpiresAt < Date.now()) {
        return res.status(400).json({ error: 'Invalid or expired verification code' });
      }

      // Update user verification status
      user.status = 'active';
      user.verificationCode = null;
      user.verificationCodeExpiresAt = null;
      await user.save();

      // Generate JWT token
      const token = generateJwtToken(user.userId, user.email);

      res.status(200).json({ token, message: 'Email verified successfully' });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ error: 'Email verification failed: ' + error.message });
    }
  }
];

// Resend Email Verification Token Controller
export const resendVerificationCode = [
  resetPasswordLimiter,
  async (req, res) => {
    try {
      const { email } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if already verified
      if (user.status === 'active') {
        return res.status(400).json({ error: 'Email already verified' });
      }

      // Generate new verification code
      const newCode = generate4DigitCode();
      user.verificationCode = newCode;
      user.verificationCodeExpiresAt = Date.now() + 3600000; // Code expires in 1 hour
      await user.save();

      // Send new verification email
      await sendEmailVerificationCode(email, newCode);

      res.status(200).json({ message: 'Verification code resent successfully' });
    } catch (error) {
      console.error('Resend verification code error:', error);
      res.status(500).json({ error: 'Failed to resend verification code: ' + error.message });
    }
  }
];

// Forgot Password Controller
export const forgotPassword = [
  resetPasswordLimiter,
  async (req, res) => {
    try {
      const { email } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Generate reset code
      const resetCode = generate4DigitCode();
      user.resetPasswordCode = resetCode;
      user.resetPasswordExpiresAt = Date.now() + 3600000; // Code expires in 1 hour
      await user.save();

      // Send reset code via email
      await sendEmailVerificationCode(email, resetCode); // Reusing sendEmailVerificationCode for simplicity

      res.status(200).json({ message: 'Password reset code sent to your email' });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Failed to send reset code: ' + error.message });
    }
  }
];

// Reset Password Controller
export const resetPassword = [
  validationResetPasswordInput,
  resetPasswordLimiter,
  async (req, res) => {
    try {
      const { email, code, newPassword } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check reset code and expiration
      if (user.resetPasswordCode !== code || user.resetPasswordExpiresAt < Date.now()) {
        return res.status(400).json({ error: 'Invalid or expired reset code' });
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update user password and clear reset fields
      user.password = hashedPassword;
      user.resetPasswordCode = null;
      user.resetPasswordExpiresAt = null;
      await user.save();

      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Password reset failed: ' + error.message });
    }
  }
];


export const dashboard = async (req, res) => {
  const userId = req.user.id || req.user._id; 
  console.log('User ID from req.user:', userId);

  try {
    // Use findOne with userId field since it's a UUID, not ObjectId
    const user = await User.findById( userId );
    if (!user) {
      console.log('User not found for ID:', userId);
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Welcome on board", user });
  } catch (error) {
    console.error('Dashboard error:', error); // Better logging
    return res.status(500).json({ error: "An error occurred from the server" });
  }
};