/**
 * Payment Methods Configuration - EXAMPLE FILE
 * 
 * Đây là file ví dụ cho các trường hợp sử dụng phổ biến
 * Copy và paste vào paymentMethods.ts để sử dụng
 */

// ============================================
// TRƯỜNG HỢP 1: CHỈ BẬT PAYPAL
// ============================================
export const ONLY_PAYPAL = {
  stripe: {
    enabled: false, // ❌ TẮT
    label: 'Mua qua Stripe (Card)',
    labelEn: 'Buy with Stripe (Card)',
    color: 'blue',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  },
  paypal: {
    enabled: true,  // ✅ BẬT
    label: 'Mua qua PayPal (Sandbox)',
    labelEn: 'Buy with PayPal (Sandbox)',
    color: 'yellow',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  },
  bank: {
    enabled: false, // ❌ TẮT
    label: 'Chuyển khoản Ngân hàng',
    labelEn: 'Bank Transfer',
    color: 'green',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  }
};

// ============================================
// TRƯỜNG HỢP 2: CHỈ BẬT BANK TRANSFER
// ============================================
export const ONLY_BANK = {
  stripe: {
    enabled: false, // ❌ TẮT
    label: 'Mua qua Stripe (Card)',
    labelEn: 'Buy with Stripe (Card)',
    color: 'blue',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  },
  paypal: {
    enabled: false, // ❌ TẮT
    label: 'Mua qua PayPal (Sandbox)',
    labelEn: 'Buy with PayPal (Sandbox)',
    color: 'yellow',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  },
  bank: {
    enabled: true,  // ✅ BẬT
    label: 'Chuyển khoản Ngân hàng',
    labelEn: 'Bank Transfer',
    color: 'green',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  }
};

// ============================================
// TRƯỜNG HỢP 3: BẬT TẤT CẢ
// ============================================
export const ALL_ENABLED = {
  stripe: {
    enabled: true,  // ✅ BẬT
    label: 'Mua qua Stripe (Card)',
    labelEn: 'Buy with Stripe (Card)',
    color: 'blue',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  },
  paypal: {
    enabled: true,  // ✅ BẬT
    label: 'Mua qua PayPal (Sandbox)',
    labelEn: 'Buy with PayPal (Sandbox)',
    color: 'yellow',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  },
  bank: {
    enabled: true,  // ✅ BẬT
    label: 'Chuyển khoản Ngân hàng',
    labelEn: 'Bank Transfer',
    color: 'green',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  }
};

// ============================================
// TRƯỜNG HỢP 4: TẮT TẤT CẢ (MAINTENANCE MODE)
// ============================================
export const ALL_DISABLED = {
  stripe: {
    enabled: false, // ❌ TẮT
    label: 'Mua qua Stripe (Card)',
    labelEn: 'Buy with Stripe (Card)',
    color: 'blue',
    disabledMessage: 'Hệ thống đang bảo trì',
    disabledMessageEn: 'System under maintenance'
  },
  paypal: {
    enabled: false, // ❌ TẮT
    label: 'Mua qua PayPal (Sandbox)',
    labelEn: 'Buy with PayPal (Sandbox)',
    color: 'yellow',
    disabledMessage: 'Hệ thống đang bảo trì',
    disabledMessageEn: 'System under maintenance'
  },
  bank: {
    enabled: false, // ❌ TẮT
    label: 'Chuyển khoản Ngân hàng',
    labelEn: 'Bank Transfer',
    color: 'green',
    disabledMessage: 'Hệ thống đang bảo trì',
    disabledMessageEn: 'System under maintenance'
  }
};

// ============================================
// TRƯỜNG HỢP 5: CHỈ BẬT STRIPE VÀ PAYPAL
// ============================================
export const STRIPE_AND_PAYPAL = {
  stripe: {
    enabled: true,  // ✅ BẬT
    label: 'Mua qua Stripe (Card)',
    labelEn: 'Buy with Stripe (Card)',
    color: 'blue',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  },
  paypal: {
    enabled: true,  // ✅ BẬT
    label: 'Mua qua PayPal (Sandbox)',
    labelEn: 'Buy with PayPal (Sandbox)',
    color: 'yellow',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  },
  bank: {
    enabled: false, // ❌ TẮT
    label: 'Chuyển khoản Ngân hàng',
    labelEn: 'Bank Transfer',
    color: 'green',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  }
};

// ============================================
// HƯỚNG DẪN SỬ DỤNG
// ============================================
/*

1. Chọn một trong các cấu hình trên (ví dụ: ONLY_PAYPAL)
2. Copy toàn bộ object
3. Mở file paymentMethods.ts
4. Paste vào export const PAYMENT_METHODS = { ... }
5. Lưu file

Ví dụ:

// Trong paymentMethods.ts
export const PAYMENT_METHODS = {
  stripe: {
    enabled: false,
    label: 'Mua qua Stripe (Card)',
    labelEn: 'Buy with Stripe (Card)',
    color: 'blue',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  },
  paypal: {
    enabled: true,
    label: 'Mua qua PayPal (Sandbox)',
    labelEn: 'Buy with PayPal (Sandbox)',
    color: 'yellow',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  },
  bank: {
    enabled: false,
    label: 'Chuyển khoản Ngân hàng',
    labelEn: 'Bank Transfer',
    color: 'green',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  }
} as const;

*/
