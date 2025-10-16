import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  productId: string;
  productName: string;
  status: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  createdAt: Date;
  paidAt: Date;
  paymentMethod: string;
}

const OrderSchema: Schema = new Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  productId: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'paid'
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paidAt: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'paypal'
  }
});

// Create model if it doesn't exist
const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
