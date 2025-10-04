import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Download from '@/lib/models/Download';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Không có token xác thực' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { message: 'Token không hợp lệ' },
        { status: 401 }
      );
    }

    const { fileType, fileName, filePath } = await request.json();

    // Get user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { message: 'User không tồn tại' },
        { status: 404 }
      );
    }

    // Check download limits
    if (fileType === 'ea-demo' && user.downloadsThisMonth.eaDemo >= 1 && !user.isPaid) {
      return NextResponse.json(
        { message: 'Bạn đã hết lượt download EA Demo. Upgrade để download unlimited!' },
        { status: 403 }
      );
    }

    if (fileType === 'indicator' && user.downloadsThisMonth.indicators >= 3 && !user.isPaid) {
      return NextResponse.json(
        { message: 'Bạn đã hết lượt download Indicator. Upgrade để download unlimited!' },
        { status: 403 }
      );
    }

    // Paid members have unlimited downloads
    if (!user.isPaid) {
      // Increment download counter
      if (fileType === 'ea-demo') {
        user.downloadsThisMonth.eaDemo += 1;
      } else if (fileType === 'indicator') {
        user.downloadsThisMonth.indicators += 1;
      }
      await user.save();
    }

    // Track download
    const download = await Download.create({
      userId: user._id,
      fileType,
      fileName,
      filePath,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json({
      message: 'Download tracked successfully',
      download: {
        id: download._id,
        fileName: download.fileName,
        downloadedAt: download.downloadedAt,
      },
      remainingDownloads: {
        eaDemo: user.isPaid ? 'unlimited' : 1 - user.downloadsThisMonth.eaDemo,
        indicators: user.isPaid ? 'unlimited' : 3 - user.downloadsThisMonth.indicators,
      },
    });
  } catch (error: any) {
    console.error('Track download error:', error);
    return NextResponse.json(
      { message: 'Lỗi server', error: error.message },
      { status: 500 }
    );
  }
}

