import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { ApiResponse } from '../types';
import { SendOtpInput, VerifyOtpInput } from '../schemas/auth.schema';

export class AuthController {
  async sendOtp(
    req: Request<{}, {}, SendOtpInput>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;

      await authService.sendOtp(email.toLowerCase());

      res.status(200).json({
        success: true,
        data: {
          message: 'OTP sent successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(
    req: Request<{}, {}, VerifyOtpInput>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, otp } = req.body;

      const result = await authService.verifyOtp(email.toLowerCase(), otp);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
