/**
 * Payment Methods Configuration
 * 
 * Cấu hình bật/tắt các phương thức thanh toán
 * Chỉ cần thay đổi true/false để bật/tắt
 */

export const PAYMENT_METHODS = {
  stripe: {
    enabled: false, // Đặt false để tắt Stripe
    label: 'Mua qua Stripe (Card)',
    labelEn: 'Buy with Stripe (Card)',
    color: 'blue',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  },
  paypal: {
    enabled: true, // Đặt false để tắt PayPal
    label: 'Mua qua PayPal (Sandbox)',
    labelEn: 'Buy with PayPal (Sandbox)',
    color: 'yellow',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  },
  bank: {
    enabled: false, // Đặt false để tắt Chuyển khoản Ngân hàng
    label: 'Chuyển khoản Ngân hàng',
    labelEn: 'Bank Transfer',
    color: 'green',
    disabledMessage: 'Tạm thời không khả dụng',
    disabledMessageEn: 'Temporarily unavailable'
  }
} as const;

export type PaymentMethodType = keyof typeof PAYMENT_METHODS;

/**
 * Kiểm tra phương thức thanh toán có được bật không
 */
export function isPaymentMethodEnabled(method: PaymentMethodType): boolean {
  return PAYMENT_METHODS[method].enabled;
}

/**
 * Lấy danh sách các phương thức thanh toán đang được bật
 */
export function getEnabledPaymentMethods(): PaymentMethodType[] {
  return Object.entries(PAYMENT_METHODS)
    .filter(([_, config]) => config.enabled)
    .map(([method]) => method as PaymentMethodType);
}

/**
 * Lấy thông tin phương thức thanh toán
 */
export function getPaymentMethodInfo(method: PaymentMethodType) {
  return PAYMENT_METHODS[method];
}
