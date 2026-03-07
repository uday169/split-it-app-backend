/**
 * Generate a random 6-digit OTP
 */
export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Check if OTP is expired.
 * Handles both JavaScript Date objects and Firestore Timestamp objects
 * (Firestore returns Timestamp from doc.data(), not a plain Date).
 */
export const isOtpExpired = (
  expiresAt: Date | { toDate(): Date } | { seconds: number }
): boolean => {
  let expiryMs: number;

  if (expiresAt instanceof Date) {
    expiryMs = expiresAt.getTime();
  } else if (typeof (expiresAt as any).toDate === 'function') {
    // Firestore Timestamp — use toDate() to get a proper JS Date
    expiryMs = (expiresAt as { toDate(): Date }).toDate().getTime();
  } else if (typeof (expiresAt as any).seconds === 'number') {
    // Plain Firestore Timestamp-like object { seconds, nanoseconds }
    expiryMs = (expiresAt as { seconds: number }).seconds * 1000;
  } else {
    expiryMs = new Date(expiresAt as any).getTime();
  }

  return Date.now() > expiryMs;
};

/**
 * Get OTP expiry time (10 minutes from now)
 */
export const getOtpExpiryTime = (): Date => {
  const now = new Date();
  return new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes
};
