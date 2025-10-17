import mongoose, { Schema, models } from 'mongoose';

export interface IPaymentRequest extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  affiliateCode: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  paymentMethod: 'bank_transfer' | 'paypal';
  bankInfo?: {
    accountNumber: string;
    bankName: string;
    accountHolderName: string;
  };
  paypalEmail?: string;
  adminNotes?: string;
  rejectionReason?: string;
  paymentProof?: string; // URL to payment proof image/document
  processedAt?: Date;
  processedBy?: mongoose.Types.ObjectId; // Admin who processed it
  createdAt: Date;
  updatedAt: Date;
}

const PaymentRequestSchema = new Schema<IPaymentRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    affiliateCode: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [500000, 'Minimum withdrawal amount is 500,000 VND'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'paid'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'paypal'],
      required: true,
    },
    bankInfo: {
      accountNumber: {
        type: String,
        required: function() {
          return this.paymentMethod === 'bank_transfer';
        },
      },
      bankName: {
        type: String,
        required: function() {
          return this.paymentMethod === 'bank_transfer';
        },
      },
      accountHolderName: {
        type: String,
        required: function() {
          return this.paymentMethod === 'bank_transfer';
        },
      },
    },
    paypalEmail: {
      type: String,
      required: function() {
        return this.paymentMethod === 'paypal';
      },
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid PayPal email',
      ],
    },
    adminNotes: {
      type: String,
    },
    rejectionReason: {
      type: String,
    },
    paymentProof: {
      type: String,
    },
    processedAt: {
      type: Date,
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
PaymentRequestSchema.index({ userId: 1, status: 1 });
PaymentRequestSchema.index({ affiliateCode: 1 });
PaymentRequestSchema.index({ createdAt: -1 });

const PaymentRequest = models.PaymentRequest || mongoose.model<IPaymentRequest>('PaymentRequest', PaymentRequestSchema);

export default PaymentRequest;
