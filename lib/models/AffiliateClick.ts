import mongoose, { Schema, Document } from 'mongoose';

export interface IAffiliateClick extends Document {
  affiliateCode: string;
  clickedAt: Date;
  ipAddress: string;
  userAgent?: string;
  referrer?: string;
  convertedAt?: Date;
  orderId?: string;
  commissionAmount?: number;
  productId?: string;
  productName?: string;
  customerEmail?: string;
  customerName?: string;
  status: 'clicked' | 'converted' | 'paid';
  createdAt: Date;
  updatedAt: Date;
}

const AffiliateClickSchema = new Schema<IAffiliateClick>(
  {
    affiliateCode: {
      type: String,
      required: true,
    },
    clickedAt: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
    },
    referrer: {
      type: String,
    },
    convertedAt: {
      type: Date,
    },
    orderId: {
      type: String,
    },
    commissionAmount: {
      type: Number,
      default: 0,
    },
    productId: {
      type: String,
    },
    productName: {
      type: String,
    },
    customerEmail: {
      type: String,
    },
    customerName: {
      type: String,
    },
    status: {
      type: String,
      enum: ['clicked', 'converted', 'paid'],
      default: 'clicked',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
AffiliateClickSchema.index({ affiliateCode: 1, clickedAt: -1 });
AffiliateClickSchema.index({ orderId: 1 });
AffiliateClickSchema.index({ status: 1 });

const AffiliateClick = mongoose.models.AffiliateClick || mongoose.model<IAffiliateClick>('AffiliateClick', AffiliateClickSchema);

export default AffiliateClick;
