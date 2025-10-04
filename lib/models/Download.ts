import mongoose, { Schema, models } from 'mongoose';

export interface IDownload extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  fileType: 'ea-demo' | 'indicator' | 'ea-full';
  fileName: string;
  filePath: string;
  downloadedAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

const DownloadSchema = new Schema<IDownload>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileType: {
      type: String,
      enum: ['ea-demo', 'indicator', 'ea-full'],
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    downloadedAt: {
      type: Date,
      default: Date.now,
    },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
DownloadSchema.index({ userId: 1, downloadedAt: -1 });
DownloadSchema.index({ fileType: 1 });

const Download = models.Download || mongoose.model<IDownload>('Download', DownloadSchema);

export default Download;

