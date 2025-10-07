import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';

// Mock data for now - in production, you'd store this in database
let mockCampaigns = [
  {
    id: '1',
    title: 'Weekly Market Analysis - Week 1',
    subject: 'Phân tích thị trường tuần đầu tháng 1/2025',
    content: 'Nội dung phân tích thị trường...',
    sentAt: new Date('2025-01-05'),
    subscribers: 45,
    openRate: 78,
    clickRate: 23,
    status: 'sent',
    createdAt: new Date('2025-01-04')
  },
  {
    id: '2',
    title: 'Weekly Market Analysis - Week 2',
    subject: 'Phân tích thị trường tuần thứ 2 tháng 1/2025',
    content: 'Nội dung phân tích thị trường...',
    subscribers: 52,
    openRate: 82,
    clickRate: 28,
    status: 'sent',
    createdAt: new Date('2025-01-11')
  },
  {
    id: '3',
    title: 'Weekly Market Analysis - Week 3',
    subject: 'Phân tích thị trường tuần thứ 3 tháng 1/2025',
    content: 'Nội dung phân tích thị trường...',
    status: 'draft',
    subscribers: 0,
    openRate: 0,
    clickRate: 0,
    createdAt: new Date('2025-01-18')
  }
];

export async function GET(request: NextRequest) {
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

    // Check if user is admin
    const adminUser = await User.findById(decoded.userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json(
        { message: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    // Get newsletter campaigns
    // In production, you'd fetch from a NewsletterCampaign collection
    const campaigns = mockCampaigns;

    return NextResponse.json({
      success: true,
      campaigns: campaigns
    });

  } catch (error: any) {
    console.error('Error fetching newsletter campaigns:', error);
    return NextResponse.json(
      { message: 'Lỗi server', error: error.message },
      { status: 500 }
    );
  }
}

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

    // Check if user is admin
    const adminUser = await User.findById(decoded.userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json(
        { message: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    const { title, subject, content, status } = await request.json();

    if (!title || !subject || !content) {
      return NextResponse.json(
        { message: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Create new campaign
    // In production, you'd save to NewsletterCampaign collection
    const newCampaign = {
      id: Date.now().toString(),
      title,
      subject,
      content,
      status: status || 'draft',
      subscribers: 0,
      openRate: 0,
      clickRate: 0,
      createdAt: new Date()
    };

    mockCampaigns.push(newCampaign);

    return NextResponse.json({
      success: true,
      campaign: newCampaign
    });

  } catch (error: any) {
    console.error('Error creating newsletter campaign:', error);
    return NextResponse.json(
      { message: 'Lỗi server', error: error.message },
      { status: 500 }
    );
  }
}
