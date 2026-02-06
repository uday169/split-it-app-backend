import nodemailer from 'nodemailer';
import config from '../config/config';
import logger from '../config/logger';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    try {
      const mailOptions = {
        from: config.smtp.from,
        to: email,
        subject: 'Your Split It Login Code',
        html: this.getOtpEmailTemplate(otp),
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`OTP email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  }

  async sendExpenseAddedEmail(
    email: string,
    groupName: string,
    expenseDescription: string,
    amount: number
  ): Promise<void> {
    try {
      const mailOptions = {
        from: config.smtp.from,
        to: email,
        subject: `New expense added in ${groupName}`,
        html: this.getExpenseAddedTemplate(groupName, expenseDescription, amount),
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Expense notification sent to ${email}`);
    } catch (error) {
      logger.error('Error sending expense notification:', error);
      // Don't throw - notifications are non-critical
    }
  }

  async sendSettlementRequestEmail(
    email: string,
    fromUser: string,
    amount: number
  ): Promise<void> {
    try {
      const mailOptions = {
        from: config.smtp.from,
        to: email,
        subject: 'Settlement Confirmation Required',
        html: this.getSettlementRequestTemplate(fromUser, amount),
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Settlement confirmation email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending settlement confirmation email:', error);
      // Don't throw - notifications are non-critical
    }
  }

  private getOtpEmailTemplate(otp: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #4F46E5; text-align: center; padding: 20px; background: white; border-radius: 8px; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Split It</h1>
            </div>
            <div class="content">
              <h2>Your Login Code</h2>
              <p>Enter this code to log in to your Split It account:</p>
              <div class="otp-code">${otp}</div>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Split It. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getExpenseAddedTemplate(
    groupName: string,
    expenseDescription: string,
    amount: number
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .expense-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .amount { font-size: 24px; font-weight: bold; color: #10B981; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Split It</h1>
            </div>
            <div class="content">
              <h2>New Expense Added</h2>
              <p>A new expense has been added to <strong>${groupName}</strong>:</p>
              <div class="expense-details">
                <p><strong>Description:</strong> ${expenseDescription}</p>
                <p class="amount">Amount: $${amount.toFixed(2)}</p>
              </div>
              <p>Open the Split It app to see how this affects your balances.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Split It. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getSettlementRequestTemplate(fromUser: string, amount: number): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .settlement-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .amount { font-size: 24px; font-weight: bold; color: #10B981; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Split It</h1>
            </div>
            <div class="content">
              <h2>Settlement Confirmation Required</h2>
              <p><strong>${fromUser}</strong> has recorded a payment to you:</p>
              <div class="settlement-details">
                <p class="amount">Amount: $${amount.toFixed(2)}</p>
              </div>
              <p>Please open the Split It app to confirm this payment.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Split It. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

export default new EmailService();
