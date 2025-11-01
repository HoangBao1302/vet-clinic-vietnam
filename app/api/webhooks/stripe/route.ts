import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AffiliateClick from "@/lib/models/AffiliateClick";
import User from "@/lib/models/User";
import Order from "@/lib/models/Order";

// Force rebuild: 2024-10-29 21:15 - Fix Stripe webhook deployment issue
export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.log("Stripe not configured, skipping webhook processing");
      return NextResponse.json({ received: true, message: "Stripe not configured" });
    }

    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // Verify webhook signature
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia" as any,
    });

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      // Log the successful payment
      console.log("Payment successful:", session.id);

      // IMPROVED: Extract productId with validation
      let productId = session.metadata?.productId || 'unknown';
      let productName = session.metadata?.productName || 'Unknown Product';
      
      // Amount in VND (Stripe stores in smallest currency unit - cents for VND)
      let amountVND = session.amount_total / 100;
      
      console.log('🔍 Stripe Webhook ProductID Detection:', {
        productId,
        productName,
        amountVND: `${amountVND.toLocaleString('vi-VN')}đ`,
        amountCents: session.amount_total,
        customerEmail: session.customer_email
      });
      
      // VALIDATION: Verify amount matches expected product price
      const expectedPrices: Record<string, number> = {
        'ea-pro-source-mt4': 14900000,
        'ea-pro-source-mt5': 14900000,
        'ea-full-mt4': 7900000,
        'ea-full-mt5': 7900000,
        'indicator-pro-mt4': 1990000,
        'indicator-pro-mt5': 1990000,
      };
      
      const expectedPrice = expectedPrices[productId];
      if (expectedPrice) {
        // CRITICAL FIX: Always use expected price based on productId
        // This prevents incorrect amount in emails due to Stripe calculation errors
        if (Math.abs(amountVND - expectedPrice) > 100000) {
          console.warn('⚠️ STRIPE AMOUNT MISMATCH - Using expected price based on productId:', {
            productId,
            expectedPrice: `${expectedPrice.toLocaleString('vi-VN')}đ`,
            stripeAmount: `${amountVND.toLocaleString('vi-VN')}đ`,
            difference: `${Math.abs(amountVND - expectedPrice).toLocaleString('vi-VN')}đ`,
            action: 'Correcting to expected price'
          });
        }
        
        // ALWAYS use expected price (productId is source of truth)
        amountVND = expectedPrice;
        
        console.log(`✅ Amount set from productId: ${amountVND.toLocaleString('vi-VN')}đ (${productId})`);
      } else {
        // Auto-correct productId based on amount if productId is unknown
        if (productId === 'unknown' || !productId) {
          console.warn('⚠️ ProductId is unknown, trying amount detection...');
          for (const [pid, price] of Object.entries(expectedPrices)) {
            if (Math.abs(amountVND - price) < 100000) {
              console.log(`✅ Auto-correcting productId from "${productId}" to "${pid}"`);
              productId = pid;
              
              // Update productName
              const productNames: Record<string, string> = {
                'indicator-pro-mt4': 'Multi-Indicator Pro Pack (MT4)',
                'ea-full-mt4': 'EA ThebenchmarkTrader Full Version (MT4)',
                'ea-pro-source-mt4': 'EA ThebenchmarkTrader Pro + Source Code (MT4)',
                'indicator-pro-mt5': 'Multi-Indicator Pro Pack (MT5)',
                'ea-full-mt5': 'EA ThebenchmarkTrader Full Version (MT5)',
                'ea-pro-source-mt5': 'EA ThebenchmarkTrader Pro + Source Code (MT5)',
              };
              productName = productNames[pid] || productName;
              
              // Set correct amount
              amountVND = price;
              break;
            }
          }
        } else {
          console.warn(`⚠️ Unknown productId: ${productId} - using Stripe amount: ${amountVND.toLocaleString('vi-VN')}đ`);
        }
      }

      // Save order to MongoDB
      const orderData = {
        orderId: session.id,
        productId: productId,
        productName: productName,
        status: "paid",
        customerEmail: session.customer_email,
        customerName: session.metadata?.customerName || 'Unknown Customer',
        customerPhone: session.metadata?.customerPhone || '',
        amount: session.amount_total,
        paymentMethod: "stripe",
        createdAt: new Date(),
        paidAt: new Date(),
      };

      // Save order to database
      try {
        await connectDB();
        const order = new Order(orderData);
        await order.save();
        console.log("✅ Stripe order saved to MongoDB:", orderData);
      } catch (dbError) {
        console.error("❌ Failed to save Stripe order to MongoDB:", dbError);
        // Continue processing even if DB save fails
      }

      // Connect to database for affiliate tracking
      await connectDB();

      // Enhanced affiliate conversion with multi-layer fallback
      let affiliateCode = session.metadata?.affiliateCode;
      let correlationMethod = 'metadata';
      
      // Multi-layer fallback system
      if (!affiliateCode || affiliateCode === '') {
        console.log('🔍 No affiliateCode in metadata, trying multi-layer fallback...');
        
        // Layer 1: Session-based correlation
        const sessionId = session.metadata?.sessionId;
        if (sessionId) {
          const sessionClick = await AffiliateClick.findOne({
            sessionId: sessionId,
            status: 'clicked',
            productId: session.metadata?.productId
          }).sort({ clickedAt: -1 });
          
          if (sessionClick) {
            affiliateCode = sessionClick.affiliateCode;
            correlationMethod = 'session';
            console.log(`✅ Layer 1: Session correlation found - ${affiliateCode}`);
          }
        }
        
        // Layer 2: Email-based correlation
        if (!affiliateCode && session.customer_email) {
          const emailClick = await AffiliateClick.findOne({
            customerEmail: session.customer_email,
            status: 'clicked',
            productId: session.metadata?.productId,
            clickedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
          }).sort({ clickedAt: -1 });
          
          if (emailClick) {
            affiliateCode = emailClick.affiliateCode;
            correlationMethod = 'email';
            console.log(`✅ Layer 2: Email correlation found - ${affiliateCode}`);
          }
        }
        
        // Layer 3: IP + Time + Product correlation
        if (!affiliateCode) {
          const orderTime = new Date();
          const timeWindow = 2 * 60 * 60 * 1000; // 2 hours window
          
          const ipClick = await AffiliateClick.findOne({
            ipAddress: session.metadata?.ipAddress || 'unknown',
            productId: session.metadata?.productId,
            status: 'clicked',
            clickedAt: { 
              $gte: new Date(orderTime.getTime() - timeWindow),
              $lte: orderTime
            }
          }).sort({ clickedAt: -1 });
          
          if (ipClick) {
            affiliateCode = ipClick.affiliateCode;
            correlationMethod = 'ip_time_product';
            console.log(`✅ Layer 3: IP + Time + Product correlation found - ${affiliateCode}`);
          }
        }
        
        // Layer 4: Device fingerprinting (if available)
        if (!affiliateCode && session.metadata?.fingerprint) {
          const fingerprintClick = await AffiliateClick.findOne({
            'trackingData.fingerprint': session.metadata.fingerprint,
            status: 'clicked',
            productId: session.metadata?.productId,
            clickedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
          }).sort({ clickedAt: -1 });
          
          if (fingerprintClick) {
            affiliateCode = fingerprintClick.affiliateCode;
            correlationMethod = 'fingerprint';
            console.log(`✅ Layer 4: Device fingerprinting correlation found - ${affiliateCode}`);
          }
        }
        
        // Layer 5: Name-based correlation (last resort)
        if (!affiliateCode && session.metadata?.customerName) {
          const nameClick = await AffiliateClick.findOne({
            customerName: session.metadata.customerName,
            status: 'clicked',
            productId: session.metadata?.productId,
            clickedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
          }).sort({ clickedAt: -1 });
          
          if (nameClick) {
            affiliateCode = nameClick.affiliateCode;
            correlationMethod = 'name';
            console.log(`✅ Layer 5: Name correlation found - ${affiliateCode}`);
          }
        }
      }
      
      console.log('🔍 Stripe Webhook - Processing affiliate conversion:', {
        orderId: session.id,
        affiliateCode,
        customerEmail: session.customer_email,
        productId: session.metadata?.productId,
        amount: session.amount_total,
        correlationMethod,
        fallbackUsed: correlationMethod !== 'metadata'
      });

      if (affiliateCode && affiliateCode !== '') {
        try {
          // Find the affiliate user
          const affiliate = await User.findOne({ 
            affiliateCode, 
            affiliateStatus: 'approved' 
          });

          if (affiliate) {
            console.log('✅ Affiliate found:', {
              email: affiliate.email,
              affiliateCode: affiliate.affiliateCode,
              isPaid: affiliate.isPaid
            });

            // Calculate commission
            const commissionRates = {
              // MT4 Products
              'indicator-pro-mt4': affiliate.isPaid ? 0.35 : 0.30,
              'ea-full-mt4': affiliate.isPaid ? 0.35 : 0.30,
              'ea-pro-source-mt4': affiliate.isPaid ? 0.35 : 0.30,
              // MT5 Products
              'indicator-pro-mt5': affiliate.isPaid ? 0.35 : 0.30,
              'ea-full-mt5': affiliate.isPaid ? 0.35 : 0.30,
              'ea-pro-source-mt5': affiliate.isPaid ? 0.35 : 0.30,
              // Legacy products (for backward compatibility)
              'ea-full': affiliate.isPaid ? 0.35 : 0.30,
              'ea-pro-source': affiliate.isPaid ? 0.35 : 0.30,
              'indicator-pro': affiliate.isPaid ? 0.35 : 0.30,
              'course': 0.25,
              'social-copy': 0.10,
            };

            const commissionRate = commissionRates[session.metadata?.productId as keyof typeof commissionRates] || 0.30;
            const commissionAmount = Math.round(session.amount_total * commissionRate);

            console.log('💰 Commission calculation:', {
              productId: session.metadata?.productId,
              commissionRate,
              amount: session.amount_total,
              commissionAmount
            });

            // Update affiliate click record (most recent click that hasn't been converted yet)
            const updatedClick = await AffiliateClick.findOneAndUpdate(
              { 
                affiliateCode,
                status: 'clicked' // Only update clicks that haven't been converted
              },
              {
                $set: {
                  convertedAt: new Date(),
                  orderId: session.id,
                  commissionAmount,
                  productId: session.metadata?.productId,
                  productName: session.metadata?.productName || 'Unknown Product',
                  customerEmail: session.customer_email,
                  customerName: session.metadata?.customerName,
                  status: 'converted',
                },
              },
              { sort: { clickedAt: -1 }, new: true } // Update the most recent unconverted click
            );

            if (updatedClick) {
              // Update user's total commission earned
              affiliate.totalCommissionEarned = (affiliate.totalCommissionEarned || 0) + commissionAmount;
              await affiliate.save();

              console.log(`✅ Affiliate conversion tracked successfully:`, {
                affiliateCode,
                clickId: updatedClick._id,
                orderId: session.id,
                commission: commissionAmount,
                totalEarned: affiliate.totalCommissionEarned,
                productId: session.metadata?.productId,
                productName: session.metadata?.productName,
                correlationMethod
              });
            } else {
              // CRITICAL FIX: No click record found - create virtual click for direct purchase
              // This handles cases where user bookmarks affiliate link or pastes it directly
              console.warn(`⚠️ No unconverted click found for affiliate code: ${affiliateCode}`);
              console.log('📌 Creating virtual click for direct purchase with affiliate code...');
              
              try {
                // Get product names for virtual click
                const productNames: Record<string, string> = {
                  'indicator-pro-mt4': 'Multi-Indicator Pro Pack (MT4)',
                  'ea-full-mt4': 'EA ThebenchmarkTrader Full Version (MT4)',
                  'ea-pro-source-mt4': 'EA ThebenchmarkTrader Pro + Source Code (MT4)',
                  'indicator-pro-mt5': 'Multi-Indicator Pro Pack (MT5)',
                  'ea-full-mt5': 'EA ThebenchmarkTrader Full Version (MT5)',
                  'ea-pro-source-mt5': 'EA ThebenchmarkTrader Pro + Source Code (MT5)',
                  'ea-full': 'EA ThebenchmarkTrader Full Version',
                  'ea-pro-source': 'EA ThebenchmarkTrader Pro + Source Code',
                  'indicator-pro': 'Multi-Indicator Pro Pack',
                  'course': 'Khóa học Forex Trading',
                  'social-copy': 'Copy Social Trading',
                };
                
                const virtualClick = await AffiliateClick.create({
                  affiliateCode: affiliateCode,
                  orderId: session.id,
                  customerEmail: session.customer_email,
                  customerName: session.metadata?.customerName || 'Unknown',
                  productId: session.metadata?.productId,
                  productName: productNames[session.metadata?.productId as string] || session.metadata?.productName || 'Unknown Product',
                  commissionAmount: commissionAmount,
                  status: 'converted',
                  clickedAt: new Date(),
                  convertedAt: new Date(),
                  ipAddress: 'direct-purchase-stripe',
                  userAgent: 'direct-purchase-with-code',
                  referrer: 'direct'
                });
                
                // Still credit affiliate for direct purchase
                affiliate.totalCommissionEarned = (affiliate.totalCommissionEarned || 0) + commissionAmount;
                await affiliate.save();
                
                console.log('✅ Virtual click created and commission credited:', {
                  affiliateCode: affiliateCode,
                  clickId: virtualClick._id,
                  orderId: session.id,
                  commission: commissionAmount,
                  totalEarned: affiliate.totalCommissionEarned,
                  productId: session.metadata?.productId,
                  productName: session.metadata?.productName,
                  type: 'virtual-click-direct-purchase',
                  correlationMethod
                });
              } catch (virtualClickError) {
                console.error('❌ Failed to create virtual click for Stripe:', virtualClickError);
              }
            }
          } else {
            console.warn(`⚠️ Affiliate not found or not approved: ${affiliateCode}`);
          }
        } catch (affiliateError) {
          console.error('❌ Affiliate conversion tracking error:', affiliateError);
        }
      } else {
        console.log('ℹ️ No affiliate code in payment metadata');
      }

      // Send email notification using Nodemailer
      if (session.customer_email) {
        try {
          const { sendEmail } = await import("@/lib/email");
          
          // Get product name with MT4/MT5 distinction (same as PayPal)
          const productNames: Record<string, string> = {
            // MT4 Products
            'indicator-pro-mt4': 'Multi-Indicator Pro Pack (MT4)',
            'ea-full-mt4': 'EA ThebenchmarkTrader Full Version (MT4)',
            'ea-pro-source-mt4': 'EA ThebenchmarkTrader Pro + Source Code (MT4)',
            // MT5 Products
            'indicator-pro-mt5': 'Multi-Indicator Pro Pack (MT5)',
            'ea-full-mt5': 'EA ThebenchmarkTrader Full Version (MT5)',
            'ea-pro-source-mt5': 'EA ThebenchmarkTrader Pro + Source Code (MT5)',
            // Legacy products (for backward compatibility)
            'ea-full': 'EA ThebenchmarkTrader Full Version',
            'ea-pro-source': 'EA ThebenchmarkTrader Pro + Source Code',
            'indicator-pro': 'Multi-Indicator Pro Pack',
            'course': 'Khóa học Forex Trading',
            'social-copy': 'Copy Social Trading',
          };
          const productName = productNames[session.metadata?.productId] || session.metadata?.productName || 'EA ThebenchmarkTrader';
          
          await sendEmail({
            to: session.customer_email,
            subject: "✅ Thanh toán thành công - Download EA ThebenchmarkTrader",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center;">
                  <h1 style="margin: 0; font-size: 32px;">🎉 Thanh toán thành công!</h1>
                </div>
                
                <div style="padding: 40px 20px; background: #f8f9fa;">
                  <h2 style="color: #333;">Cảm ơn bạn đã mua hàng!</h2>
                  
                  <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Mã đơn hàng:</strong> ${session.id}</p>
                    <p><strong>Sản phẩm:</strong> ${productName}</p>
                    <p><strong>Phương thức:</strong> Stripe</p>
                    <p><strong>Số tiền:</strong> ${amountVND.toLocaleString("vi-VN")}₫</p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ThebenchmarkTrader.com'}/downloads?order=${session.id}&productId=${session.metadata?.productId}" 
                       style="display: inline-block; padding: 15px 40px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
                      Tải xuống ngay
                    </a>
                  </div>
                  
                  <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #1e40af; margin-top: 0;">📋 Hướng dẫn cài đặt:</h3>
                    ${session.metadata?.productId?.includes('mt5') ? `
                      <ol style="color: #1e3a8a; margin: 10px 0; padding-left: 20px;">
                        <li>Giải nén file (nếu là .zip)</li>
                        <li>Copy file .ex5 vào thư mục MT5/MQL5/Experts</li>
                        <li>Restart MetaTrader 5</li>
                        <li>Drag EA lên chart và configure</li>
                      </ol>
                      <p style="color: #059669; font-weight: bold;">📱 Phiên bản MT5 - Dành cho MetaTrader 5</p>
                    ` : `
                      <ol style="color: #1e3a8a; margin: 10px 0; padding-left: 20px;">
                        <li>Giải nén file (nếu là .zip)</li>
                        <li>Copy file .ex4 vào thư mục MT4/MQL4/Experts</li>
                        <li>Restart MetaTrader 4</li>
                        <li>Drag EA lên chart và configure</li>
                      </ol>
                      <p style="color: #059669; font-weight: bold;">📱 Phiên bản MT4 - Dành cho MetaTrader 4</p>
                    `}
                  </div>
                  
                  <h3>Cần hỗ trợ?</h3>
                  <ul style="list-style: none; padding: 0;">
                    <li>📧 Email: support@thebenchmarktrader.com</li>
                    <li>📱 Telegram Group: t.me/+0ETUdIuYUzdhZWQ1</li>
                    <li>📞 Hotline: +84 765 452 515</li>
                  </ul>
                </div>
                
                <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
                  <p>EA Forex ThebenchmarkTrader<br>© 2025 All rights reserved</p>
                </div>
              </div>
            `,
          });
        } catch (emailError) {
          console.error("Error sending email:", emailError);
          // Continue even if email fails
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

