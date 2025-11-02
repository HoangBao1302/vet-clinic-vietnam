import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { sendEmail } from "@/lib/email";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const { productId, productName, amount, customerInfo, affiliateCode, transferProof } = await request.json();

    // Validate input
    if (!productId || !productName || !amount || !customerInfo || !transferProof) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate transfer proof is base64 image
    if (!transferProof.startsWith('data:image/')) {
      return NextResponse.json(
        { success: false, error: "Invalid image format. Please upload a valid image." },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Generate unique order ID
    const orderId = `BANK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Save transfer proof image
    // Option 1: Try to save to file system (for local development)
    let transferProofPath = '';
    try {
      const base64Data = transferProof.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Determine file extension from base64 header
      const fileExtension = transferProof.split(';')[0].split('/')[1];
      const fileName = `${orderId}.${fileExtension}`;
      
      // Create directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'transfers');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      
      const filePath = path.join(uploadsDir, fileName);
      await writeFile(filePath, buffer);
      transferProofPath = `/uploads/transfers/${fileName}`;
    } catch (fileError: any) {
      // If file system write fails (e.g., on Vercel serverless), store base64 in DB instead
      console.warn('Could not write file to filesystem, storing in DB:', fileError.message);
      transferProofPath = transferProof; // Store base64 directly
    }

    // Create order record
    const orderData = {
      orderId,
      productId,
      productName,
      status: 'pending',
      customerEmail: customerInfo.email,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone || '',
      amount: Math.round(amount * 100), // Convert VND to cents for consistency with Stripe/PayPal
      paymentMethod: 'bank_transfer',
      createdAt: new Date(),
      paidAt: new Date(), // Will be updated when approved
      broker: customerInfo.broker || '',
      accountId: customerInfo.accountId || '',
      server: customerInfo.server || '',
      transferProof: transferProofPath,
      transferProofApproved: false,
      emailSent: false
    };

    const order = new Order(orderData);
    await order.save();

    // Send confirmation email to customer
    const confirmationEmailSubject = `⏳ Đơn hàng đang chờ xác nhận - ${productName}`;
    const confirmationEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">⏳ Đang chờ xác nhận</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
          <p style="font-size: 16px; color: #1f2937;">Xin chào <strong>${customerInfo.name}</strong>,</p>
          
          <p style="font-size: 16px; color: #1f2937;">
            Cảm ơn bạn đã đặt hàng! Chúng tôi đã nhận được đơn hàng của bạn và đang xem xét.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; color: #1f2937;"><strong>Mã đơn hàng:</strong> ${orderId}</p>
            <p style="margin: 0; color: #1f2937;"><strong>Sản phẩm:</strong> ${productName}</p>
            <p style="margin: 0; color: #1f2937;"><strong>Số tiền:</strong> ${(amount).toLocaleString('vi-VN')}đ</p>
            <p style="margin: 0; color: #1f2937;"><strong>Phương thức:</strong> Chuyển khoản ngân hàng</p>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="color: #92400e; margin: 0;">
              <strong>⏰ Thời gian xác nhận:</strong> Chúng tôi sẽ xem xét đơn hàng của bạn trong vòng 1-2 giờ làm việc.
            </p>
          </div>

          <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">📧 Liên hệ hỗ trợ:</h3>
            <p style="color: #1e293b; margin: 5px 0;">
              📧 Email: support@thebenchmarktrader.com
            </p>
            <p style="color: #1e293b; margin: 5px 0;">
              📱 Telegram Group: t.me/+0ETUdIuYUzdhZWQ1
            </p>
            <p style="color: #1e293b; margin: 5px 0;">
              📞 Hotline: +84 765 452 515
            </p>
          </div>

          <p style="color: #1f2937;">Bạn sẽ nhận được email thông báo ngay khi đơn hàng được duyệt!</p>
        </div>
        
        <div style="background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
          <p style="margin: 5px 0;">Cảm ơn bạn đã tin tưởng ThebenchmarkTrader</p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: customerInfo.email,
        subject: confirmationEmailSubject,
        html: confirmationEmailHtml
      });
      console.log("✅ Confirmation email sent to:", customerInfo.email);
    } catch (emailError) {
      console.error("⚠️ Error sending confirmation email:", emailError);
    }

    // Handle affiliate tracking
    if (affiliateCode) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/affiliate/track-conversion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            affiliateCode,
            orderId,
            productId,
            amount,
            paymentMethod: 'bank_transfer'
          })
        });
      } catch (affError) {
        console.error('Affiliate tracking error:', affError);
      }
    }

    console.log("✅ Bank transfer order created:", orderData);

    return NextResponse.json({
      success: true,
      orderId: orderId,
      message: "Order created successfully. Waiting for admin approval."
    });

  } catch (error: any) {
    console.error("Bank transfer order creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

