// Email validation and spam prevention

// List of known temporary/disposable email domains
const BLOCKED_EMAIL_DOMAINS = [
  // Temporary email services
  'tempmail.com', 'tempmail.org', 'tempmail.net',
  'guerrillamail.com', 'guerrillamail.net', 'guerrillamailblock.com',
  '10minutemail.com', '10minutemail.net', '10minutemail.org',
  'mailinator.com', 'mailinator.net', 'mailinator.org',
  'throwaway.email', 'disposable.email', 'disposablemail.com',
  'fakeinbox.com', 'fakeinbox.net', 'fakeinbox.org',
  'trashmail.com', 'trashmail.net', 'trashmail.org',
  'temp-mail.org', 'temp-mail.io', 'tempail.com',
  'getnada.com', 'mohmal.com', 'yopmail.com',
  'maildrop.cc', 'sharklasers.com', 'grr.la',
  'getairmail.com', 'mintemail.com', 'spamgourmet.com',
  
  // Common spam patterns
  'email.com', // Generic, often used for spam
  'test.com', 'test.net', 'test.org',
  'example.com', 'example.net', 'example.org',
  
  // Add more as needed
];

// Suspicious email patterns (block these)
const SUSPICIOUS_PATTERNS = [
  /^[a-z0-9]{20,}@/, // Too many random chars before @
  /^\d+@/, // Starts with numbers only
  /@[a-z0-9]{1,3}\.[a-z]{2,3}$/, // Very short domain
  /\.(tk|ml|ga|cf|gq)$/i, // Free domains often used for spam
];

/**
 * Validate email format strictly
 */
export function isValidEmailFormat(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  // Basic email regex (RFC 5322 compliant)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) return false;
  
  // Check length limits
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return false;
  
  if (localPart.length > 64 || domain.length > 255 || email.length > 254) {
    return false;
  }
  
  // Domain must have at least one dot
  if (!domain.includes('.')) return false;
  
  // Check for consecutive dots
  if (email.includes('..')) return false;
  
  // Check for suspicious patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(email)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Check if email domain is blocked (temp/disposable email)
 */
export function isBlockedEmailDomain(email: string): boolean {
  if (!email || typeof email !== 'string') return true;
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return true;
  
  // Check against blocked domains list
  if (BLOCKED_EMAIL_DOMAINS.includes(domain)) {
    return true;
  }
  
  // Check for temp email patterns in domain
  const tempPatterns = ['temp', 'fake', 'throwaway', 'disposable', 'trash', 'spam', 'test', 'example'];
  const domainLower = domain.toLowerCase();
  
  for (const pattern of tempPatterns) {
    if (domainLower.includes(pattern) && domainLower.length < 15) {
      // Short domains with temp keywords are suspicious
      return true;
    }
  }
  
  return false;
}

/**
 * Comprehensive email validation for contact forms
 */
export function validateEmailForContact(email: string): {
  valid: boolean;
  error?: string;
} {
  if (!email || typeof email !== 'string' || !email.trim()) {
    return {
      valid: false,
      error: 'Email không được để trống'
    };
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  
  // Check format
  if (!isValidEmailFormat(trimmedEmail)) {
    return {
      valid: false,
      error: 'Email không đúng định dạng. Vui lòng nhập email hợp lệ.'
    };
  }
  
  // Check blocked domains
  if (isBlockedEmailDomain(trimmedEmail)) {
    return {
      valid: false,
      error: 'Email không hợp lệ. Vui lòng sử dụng email thật để liên hệ.'
    };
  }
  
  // Check for suspicious local part (before @)
  const localPart = trimmedEmail.split('@')[0];
  
  // Too many numbers (likely spam)
  const numberCount = (localPart.match(/\d/g) || []).length;
  if (numberCount > localPart.length * 0.6 && localPart.length > 10) {
    return {
      valid: false,
      error: 'Email không hợp lệ. Vui lòng sử dụng email thật.'
    };
  }
  
  // Random string pattern (many consonants without vowels)
  const consonants = (localPart.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
  const vowels = (localPart.match(/[aeiou]/gi) || []).length;
  if (consonants > vowels * 3 && localPart.length > 8) {
    return {
      valid: false,
      error: 'Email không hợp lệ. Vui lòng sử dụng email thật.'
    };
  }
  
  return { valid: true };
}

/**
 * Check if email looks suspicious (for logging/monitoring)
 */
export function isSuspiciousEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return true;
  
  const trimmedEmail = email.trim().toLowerCase();
  const localPart = trimmedEmail.split('@')[0];
  
  // Check patterns
  if (localPart.length > 30) return true; // Very long username
  if ((localPart.match(/\d/g) || []).length > 10) return true; // Too many numbers
  
  return false;
}

