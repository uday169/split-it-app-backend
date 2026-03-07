import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import authController from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validation';
import { sendOtpSchema, verifyOtpSchema } from '../schemas/auth.schema';

const router = Router();

// Rate limiting for OTP endpoints
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: 'Too many OTP requests from this IP, please try again later',
});

router.post('/send-otp', otpLimiter, validateRequest(sendOtpSchema), authController.sendOtp);
router.post('/verify-otp', validateRequest(verifyOtpSchema), authController.verifyOtp);

export default router;
