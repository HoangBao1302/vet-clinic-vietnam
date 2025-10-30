import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AffiliateClick from "@/lib/models/AffiliateClick";
import User from "@/lib/models/User";
import Order from "@/lib/models/Order";

// Force rebuild: 2024-10-29 21:15 - Fix PayPal webhook deployment issue
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("PayPal webhook received:", body);
    
    // Check if this is a payment completion event
    if (body.event_type === "CHECKOUT.ORDER.APPROVED" || body.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const orderId = body.resource?.id || body.resource?.supplementary_data?.related_ids?.order_id;
      const payerEmail = body.resource?.payer?.email_address || body.resource?.payer?.email;
      const payerName = body.resource?.payer?.name;
      
      // Get amount - may vary depending on event type
      const amountUSD = parseFloat(
        body.resource?.amount?.value || 
        body.resource?.purchase_units?.[0]?.amount?.value || 
        '0'
      );
      let amountVND = amountUSD * 24000; // Convert USD to VND
      let amount = Math.round(amountVND * 100); // Convert to cents for storage
      
      // IMPORTANT: Amount from PayPal may be incorrect for CHECKOUT.ORDER.APPROVED
      // We'll recalculate based on productId after we extract it
      console.log('💰 Initial amount from PayPal:', {
        amountUSD: `$${amountUSD.toFixed(2)}`,
        amountVND: `${amountVND.toLocaleString('vi-VN')}đ`,
        amountCents: amount,
        note: 'Will be recalculated based on productId'
      });
      
      // IMPROVED: Multiple strategies to get productId and customer info
      let productId = '';
      let affiliateCode = '';
      let realCustomerEmail = '';
      let realCustomerName = '';
      let realCustomerPhone = '';
      
      // Strategy 1: Get from custom_id (PRIMARY and MOST RELIABLE method)
      // Format: productId|affiliateCode|customerEmail|customerName|customerPhone
      const customId = body.resource?.purchase_units?.[0]?.custom_id || 
                       body.resource?.custom_id || '';
      
      console.log('🔍 RAW PayPal Data:', {
        customId,
        referenceId: body.resource?.purchase_units?.[0]?.reference_id,
        description: body.resource?.purchase_units?.[0]?.description,
        amountUSD: `$${amountUSD.toFixed(2)}`,
        amountVND: `${amountVND.toLocaleString('vi-VN')}đ`
      });
      
      if (customId) {
        const parts = customId.split('|');
        const extractedProductId = parts[0] || '';
        affiliateCode = parts[1] || '';
        realCustomerEmail = parts[2] || '';
        realCustomerName = parts[3] || '';
        realCustomerPhone = parts[4] || '';
        
        // CRITICAL: Validate productId from custom_id
        const validProductIds = [
          'ea-pro-source-mt4', 'ea-pro-source-mt5',
          'ea-full-mt4', 'ea-full-mt5',
          'indicator-pro-mt4', 'indicator-pro-mt5',
          'ea-full', 'ea-pro-source', 'indicator-pro', // Legacy
          'course', 'social-copy'
        ];
        
        if (validProductIds.includes(extractedProductId)) {
          productId = extractedProductId;
          console.log('✅ VALID ProductId from custom_id:', {
            productId,
            affiliateCode,
            realCustomerEmail,
            realCustomerName,
            realCustomerPhone,
            source: 'custom_id (TRUSTED)'
          });
        } else {
          console.error('❌ INVALID ProductId in custom_id:', {
            extractedProductId,
            customId,
            validProductIds
          });
        }
      } else {
        console.warn('⚠️ No custom_id found in PayPal webhook!');
      }
      
      // Strategy 2: Fallback to reference_id (ONLY if custom_id failed)
      if (!productId) {
        const referenceId = body.resource?.purchase_units?.[0]?.reference_id || '';
        if (referenceId) {
          productId = referenceId;
          console.log(`📋 Fallback: Using reference_id as productId: ${productId}`);
        }
      }
      
      // Strategy 3: Detect from amount (LAST RESORT - least reliable)
      // Note: This cannot distinguish between MT4/MT5 as they have same price
      // Will be corrected by Strategy 4 if needed
      if (!productId || productId === 'unknown') {
        console.warn('⚠️ ProductId not found in custom_id or reference_id, trying amount detection (UNRELIABLE)...');
        
        // Amount-based detection with tolerance
        const tolerance = 100000; // 100K VND tolerance
        
        if (Math.abs(amountVND - 14900000) < tolerance) {
          productId = 'ea-pro-source-mt4'; // Default to MT4, will be corrected if needed
          console.warn(`💡 ProductId detected from amount: ${productId} (${amountVND.toLocaleString('vi-VN')}đ ≈ 14.9M) - MT4 assumed, may auto-correct`);
        } else if (Math.abs(amountVND - 7900000) < tolerance) {
          productId = 'ea-full-mt4';
          console.warn(`💡 ProductId detected from amount: ${productId} (${amountVND.toLocaleString('vi-VN')}đ ≈ 7.9M) - MT4 assumed, may auto-correct`);
        } else if (Math.abs(amountVND - 1990000) < tolerance) {
          productId = 'indicator-pro-mt4';
          console.warn(`💡 ProductId detected from amount: ${productId} (${amountVND.toLocaleString('vi-VN')}đ ≈ 1.99M) - MT4 assumed, may auto-correct`);
        } else {
          productId = 'unknown';
          console.error(`❌ Could not detect productId from amount: ${amountVND.toLocaleString('vi-VN')}đ`);
        }
      }
      
      // Strategy 4: Try to detect MT5 from multiple sources
      if (productId && productId.endsWith('-mt4')) {
        // Check multiple sources for MT5 keywords
        const description = body.resource?.purchase_units?.[0]?.description || '';
        const payerEmail = body.resource?.payer?.email_address || '';
        
        // IMPORTANT: Also check custom_id which contains the actual product name from checkout
        const customIdLower = customId.toLowerCase();
        
        // Check all possible sources for MT5 keywords
        const isMT5 = 
          description.toLowerCase().includes('mt5') || 
          description.toLowerCase().includes('metatrader 5') ||
          description.toLowerCase().includes('metatrader5') ||
          customIdLower.includes('mt5') ||  // Check custom_id
          customIdLower.includes('metatrader 5') ||
          customIdLower.includes('metatrader5');
        
        if (isMT5) {
          const mt5ProductId = productId.replace('-mt4', '-mt5');
          console.log(`📋 MT5 detected, converting ${productId} → ${mt5ProductId}`, {
            source: customIdLower.includes('mt5') ? 'custom_id' : 'description',
            customId,
            description
          });
          productId = mt5ProductId;
        }
        
        // Log for manual review if we're not sure
        console.log('🔍 Platform Detection:', {
          currentProductId: productId,
          description,
          customId,
          isMT5,
          note: isMT5 ? 'MT5 detected and corrected' : 'MT4 assumed (no MT5 keywords found)'
        });
      }
      
      console.log('🔍 PayPal Webhook ProductID Detection:', {
        customId,
        referenceId: body.resource?.purchase_units?.[0]?.reference_id,
        finalProductId: productId,
        affiliateCode,
        amountUSD: `$${amountUSD.toFixed(2)}`,
        amountVND: `${amountVND.toLocaleString('vi-VN')}đ`,
        amountCents: amount,
        detectionMethod: customId ? 'custom_id' : body.resource?.purchase_units?.[0]?.reference_id ? 'reference_id' : 'amount'
      });
      
      // CRITICAL PROTECTION: If productId is still invalid, DO NOT SAVE TO DATABASE
      if (!productId || productId === 'unknown') {
        console.error('❌ CRITICAL: Cannot determine productId - REFUSING to save to database!', {
          orderId,
          customId,
          referenceId: body.resource?.purchase_units?.[0]?.reference_id,
          amountVND: `${amountVND.toLocaleString('vi-VN')}đ`,
          action: 'Skipping database save - manual intervention required'
        });
        
        // Still send email notification but warn about missing productId
        if (realCustomerEmail || payerEmail) {
          const emailRecipient = realCustomerEmail || payerEmail;
          try {
            const { sendEmail } = await import("@/lib/email");
            await sendEmail({
              to: emailRecipient,
              subject: "⚠️ Thanh toán thành công - Cần xác nhận thông tin",
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 40px 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 32px;">⚠️ Thanh toán thành công</h1>
                  </div>
                  
                  <div style="padding: 40px 20px; background: #f8f9fa;">
                    <h2 style="color: #333;">Cảm ơn bạn đã thanh toán!</h2>
                    
                    <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                      <p style="color: #92400e; margin: 0;">
                        <strong>⚠️ Lưu ý:</strong> Hệ thống đang xử lý đơn hàng của bạn. 
                        Vui lòng liên hệ support để được hỗ trợ download sản phẩm.
                      </p>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                      <p><strong>Mã đơn hàng:</strong> ${orderId}</p>
                      <p><strong>Phương thức:</strong> PayPal</p>
                      ${amountVND > 0 ? `<p><strong>Số tiền:</strong> ${amountVND.toLocaleString('vi-VN')}₫</p>` : ''}
                    </div>
                    
                    <h3>Liên hệ hỗ trợ:</h3>
                    <ul style="list-style: none; padding: 0;">
                      <li>📧 Email: support@thebenchmarktrader.com</li>
                      <li>📱 Telegram Group: t.me/+0ETUdIuYUzdhZWQ1</li>
                      <li>📞 Hotline: +84 765 452 515</li>
                    </ul>
                  </div>
                </div>
              `,
            });
            console.log("⚠️ Warning email sent to:", emailRecipient);
          } catch (emailError) {
            console.error("❌ Error sending warning email:", emailError);
          }
        }
        
        return NextResponse.json({ 
          success: false, 
          error: "Cannot determine product - manual intervention required",
          orderId 
        });
      }
      
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
        // PayPal amount may be incorrect for CHECKOUT.ORDER.APPROVED event
        if (Math.abs(amountVND - expectedPrice) > 100000) {
          console.warn('⚠️ AMOUNT MISMATCH - Using expected price based on productId:', {
            productId,
            expectedPrice: `${expectedPrice.toLocaleString('vi-VN')}đ`,
            paypalAmount: `${amountVND.toLocaleString('vi-VN')}đ`,
            difference: `${Math.abs(amountVND - expectedPrice).toLocaleString('vi-VN')}đ`,
            action: 'Correcting to expected price'
          });
        }
        
        // ALWAYS use expected price (productId is source of truth)
        amountVND = expectedPrice;
        amount = Math.round(expectedPrice * 100); // Convert to cents
        
        console.log(`✅ Amount set from productId: ${amountVND.toLocaleString('vi-VN')}đ (${productId})`);
      } else {
        console.warn(`⚠️ Unknown productId: ${productId} - using PayPal amount: ${amountVND.toLocaleString('vi-VN')}đ`);
      }
      
      if (orderId) {
        console.log("PayPal order approved:", {
          orderId,
          payerEmail,
          payerName: `${payerName?.given_name || ''} ${payerName?.surname || ''}`.trim(),
          amount,
          amountVND: `${amountVND.toLocaleString('vi-VN')}đ`,
          amountUSD: `$${amountUSD.toFixed(2)}`,
          productId,
          affiliateCode,
          eventType: body.event_type
        });
        
        // Create order record
        // Use real customer info from custom_id if available, otherwise fallback to PayPal payer info
        const finalCustomerEmail = realCustomerEmail || payerEmail;
        const finalCustomerName = realCustomerName || `${payerName?.given_name || ''} ${payerName?.surname || ''}`.trim();
        const finalCustomerPhone = realCustomerPhone || '';
        
        console.log('✅ Using customer info:', {
          email: finalCustomerEmail,
          name: finalCustomerName,
          phone: finalCustomerPhone,
          source: realCustomerEmail ? 'custom_id (real customer)' : 'PayPal payer (sandbox)'
        });
        
        const orderData = {
          orderId: orderId,
          productId: productId || 'unknown',
          productName: 'Unknown Product', // Will be updated below
          status: "paid",
          customerEmail: finalCustomerEmail,
          customerName: finalCustomerName,
          customerPhone: finalCustomerPhone,
          amount: amount,
          paymentMethod: "paypal",
          createdAt: new Date(),
          paidAt: new Date(),
        };

        // Get product name with MT4/MT5 distinction
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
        orderData.productName = productNames[productId] || 'Unknown Product';
        
        // Track if order was created or updated (for email notification)
        let wasOrderCreated = false;
        let wasOrderUpdated = false;
        let shouldSendEmail = false;
        
        // Save order to database
        try {
          await connectDB();
          
          // Check if order already exists to avoid duplicates
          const existingOrder = await Order.findOne({ orderId: orderId });
          if (existingOrder) {
            console.log("ℹ️ Order already exists in MongoDB:", orderId);
            
            // CRITICAL FIX: If existing order has wrong data, UPDATE it!
            const needsUpdate = 
              existingOrder.productId !== orderData.productId ||
              existingOrder.amount !== orderData.amount ||
              existingOrder.customerEmail !== orderData.customerEmail;
            
            if (needsUpdate) {
              console.warn("⚠️ Existing order has incorrect data, updating...", {
                orderId,
                old: {
                  productId: existingOrder.productId,
                  amount: existingOrder.amount,
                  customerEmail: existingOrder.customerEmail,
                  emailSent: existingOrder.emailSent
                },
                new: {
                  productId: orderData.productId,
                  amount: orderData.amount,
                  customerEmail: orderData.customerEmail
                }
              });
              
              await Order.updateOne(
                { orderId: orderId },
                {
                  $set: {
                    productId: orderData.productId,
                    productName: orderData.productName,
                    amount: orderData.amount,
                    customerEmail: orderData.customerEmail,
                    customerName: orderData.customerName,
                    customerPhone: orderData.customerPhone,
                    status: orderData.status,
                    paidAt: orderData.paidAt,
                    emailSent: false // CRITICAL: Reset emailSent when data is corrected
                  }
                }
              );
              
              console.log("✅ Order updated successfully in MongoDB:", {
                orderId: orderData.orderId,
                productId: orderData.productId,
                amount: orderData.amount
              });
              wasOrderUpdated = true;
              
              // CRITICAL: Always send email when updating incorrect data
              // This ensures customer gets correct information
              shouldSendEmail = true;
              console.log("📧 Sending corrected email notification (data was updated)");
              
              if (existingOrder.emailSent) {
                console.warn("⚠️ Previous email had incorrect data - sending corrected version");
              }
            } else {
              console.log("✅ Order data is already correct, no update needed");
              shouldSendEmail = false; // Data correct, no email needed
            }
          } else {
            const order = new Order(orderData);
            await order.save();
            console.log("✅ PayPal order saved to MongoDB successfully:", {
              orderId: orderData.orderId,
              productId: orderData.productId,
              customerEmail: orderData.customerEmail,
              customerName: orderData.customerName,
              amount: orderData.amount
            });
            wasOrderCreated = true;
            shouldSendEmail = true; // New order, send email
          }
        } catch (dbError: any) {
          console.error("❌ Failed to save PayPal order to MongoDB:", {
            error: dbError.message,
            stack: dbError.stack,
            orderData: {
              orderId: orderData.orderId,
              productId: orderData.productId,
              customerEmail: orderData.customerEmail,
              customerName: orderData.customerName
            }
          });
          // Continue processing even if DB save fails - email will still be sent
        }
        
        // Handle affiliate conversion with URL parameter fallback
        let finalAffiliateCode = affiliateCode;
        
        // URL Parameter Fallback: If no affiliateCode in custom_id, try to find from recent clicks
        if (!finalAffiliateCode || finalAffiliateCode === '') {
          console.log('🔍 No affiliateCode in PayPal custom_id, trying URL parameter fallback...');
          
          // Find recent clicks for this customer email (within last 30 days)
          // Use real customer email if available
          const recentClicks = await AffiliateClick.find({
            customerEmail: finalCustomerEmail,
            clickedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
            status: 'clicked' // Only unconverted clicks
          }).sort({ clickedAt: -1 }).limit(5);
          
          if (recentClicks.length > 0) {
            // Use the most recent click
            finalAffiliateCode = recentClicks[0].affiliateCode;
            console.log(`✅ Found affiliateCode from recent click: ${finalAffiliateCode}`);
          }
        }
        
        console.log('🔍 PayPal Webhook - Processing affiliate conversion:', {
          orderId,
          affiliateCode: finalAffiliateCode,
          customerEmail: finalCustomerEmail,
          productId,
          amount,
          fallbackUsed: !affiliateCode || affiliateCode === ''
        });

        if (finalAffiliateCode && finalAffiliateCode !== '') {
          try {
            await connectDB();
            
            // Find the affiliate user
            const affiliate = await User.findOne({ 
              affiliateCode: finalAffiliateCode, 
              affiliateStatus: 'approved' 
            });

            if (affiliate) {
              // Calculate commission with MT4/MT5 support
              const commissionRates: Record<string, number> = {
                // MT4 Products
                'indicator-pro-mt4': affiliate.isPaid ? 0.35 : 0.30,
                'ea-full-mt4': affiliate.isPaid ? 0.35 : 0.30,
                'ea-pro-source-mt4': affiliate.isPaid ? 0.35 : 0.30,
                // MT5 Products
                'indicator-pro-mt5': affiliate.isPaid ? 0.35 : 0.30,
                'ea-full-mt5': affiliate.isPaid ? 0.35 : 0.30,
                'ea-pro-source-mt5': affiliate.isPaid ? 0.35 : 0.30,
                // Legacy products
                'ea-full': affiliate.isPaid ? 0.35 : 0.30,
                'ea-pro-source': affiliate.isPaid ? 0.35 : 0.30,
                'indicator-pro': affiliate.isPaid ? 0.35 : 0.30,
                'course': 0.25,
                'social-copy': 0.10,
              };

              const commissionRate = commissionRates[productId] || 0.30;
              const commissionAmount = Math.round(amount * commissionRate);

              // Get product name with MT4/MT5 distinction
              const productNames: Record<string, string> = {
                // MT4 Products
                'indicator-pro-mt4': 'Multi-Indicator Pro Pack (MT4)',
                'ea-full-mt4': 'EA ThebenchmarkTrader Full Version (MT4)',
                'ea-pro-source-mt4': 'EA ThebenchmarkTrader Pro + Source Code (MT4)',
                // MT5 Products
                'indicator-pro-mt5': 'Multi-Indicator Pro Pack (MT5)',
                'ea-full-mt5': 'EA ThebenchmarkTrader Full Version (MT5)',
                'ea-pro-source-mt5': 'EA ThebenchmarkTrader Pro + Source Code (MT5)',
                // Legacy products
                'ea-full': 'EA ThebenchmarkTrader Full Version',
                'ea-pro-source': 'EA Pro + Source Code',
                'indicator-pro': 'Multi-Indicator Pro Pack',
                'course': 'Khóa học Forex Trading',
                'social-copy': 'Copy Social Trading',
              };

              // Update affiliate click record (most recent click that hasn't been converted yet)
              const updatedClick = await AffiliateClick.findOneAndUpdate(
                { 
                  affiliateCode: finalAffiliateCode,
                  status: 'clicked' // Only update clicks that haven't been converted
                },
                {
                  $set: {
                    convertedAt: new Date(),
                    orderId: orderId,
                    commissionAmount,
                    productId: productId,
                    productName: productNames[productId] || productId,
                    customerEmail: finalCustomerEmail,
                    customerName: finalCustomerName,
                    status: 'converted',
                  },
                },
                { sort: { clickedAt: -1 }, new: true } // Update the most recent unconverted click
              );

              if (updatedClick) {
                // Update user's total commission earned
                affiliate.totalCommissionEarned = (affiliate.totalCommissionEarned || 0) + commissionAmount;
                await affiliate.save();

                console.log(`✅ PayPal Affiliate conversion tracked:`, {
                  affiliateCode: finalAffiliateCode,
                  clickId: updatedClick._id,
                  orderId: orderId,
                  commission: commissionAmount,
                  totalEarned: affiliate.totalCommissionEarned,
                  productId,
                  productName: productNames[productId],
                  fallbackUsed: !affiliateCode || affiliateCode === ''
                });
              } else {
                console.warn(`⚠️ No unconverted click found for PayPal affiliate code: ${finalAffiliateCode}`);
              }
            } else {
              console.warn(`⚠️ Affiliate not found or not approved: ${finalAffiliateCode}`);
            }
          } catch (affiliateError) {
            console.error('PayPal Affiliate conversion tracking error:', affiliateError);
          }
        }
        
        // Send email notification
        // Use real customer email if available
        const emailRecipient = finalCustomerEmail;
        
        // CRITICAL: Use shouldSendEmail flag set during DB operation
        // This prevents duplicate emails from multiple webhook events
        if (emailRecipient && shouldSendEmail) {
          try {
            const { sendEmail } = await import("@/lib/email");
            
            console.log('📧 Sending email notification:', {
              to: emailRecipient,
              orderId,
              productId,
              reason: wasOrderCreated ? 'New order' : 'Order updated with correct data'
            });
            
            // Get product name for email with MT4/MT5 distinction
            const productNames: Record<string, string> = {
              // MT4 Products
              'indicator-pro-mt4': 'Multi-Indicator Pro Pack (MT4)',
              'ea-full-mt4': 'EA ThebenchmarkTrader Full Version (MT4)',
              'ea-pro-source-mt4': 'EA ThebenchmarkTrader Pro + Source Code (MT4)',
              // MT5 Products
              'indicator-pro-mt5': 'Multi-Indicator Pro Pack (MT5)',
              'ea-full-mt5': 'EA ThebenchmarkTrader Full Version (MT5)',
              'ea-pro-source-mt5': 'EA ThebenchmarkTrader Pro + Source Code (MT5)',
              // Legacy products
              'ea-full': 'EA ThebenchmarkTrader Full Version',
              'ea-pro-source': 'EA Pro + Source Code',
              'indicator-pro': 'Multi-Indicator Pro Pack',
              'course': 'Khóa học Forex Trading',
              'social-copy': 'Copy Social Trading',
            };
            const productName = productNames[productId] || 'EA ThebenchmarkTrader';
            
            console.log('📧 Sending email to:', emailRecipient, '(real customer email)');
            
            await sendEmail({
              to: emailRecipient,
              subject: "✅ Thanh toán thành công - Download EA ThebenchmarkTrader",
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 32px;">🎉 Thanh toán thành công!</h1>
                  </div>
                  
                  <div style="padding: 40px 20px; background: #f8f9fa;">
                    <h2 style="color: #333;">Cảm ơn bạn đã mua hàng!</h2>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                      <p><strong>Mã đơn hàng:</strong> ${orderId}</p>
                      <p><strong>Sản phẩm:</strong> ${productName}</p>
                      <p><strong>Phương thức:</strong> PayPal</p>
                      ${amountVND > 0 ? `<p><strong>Số tiền:</strong> ${amountVND.toLocaleString('vi-VN')}₫ (≈ $${amountUSD.toFixed(2)} USD)</p>` : ''}
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ThebenchmarkTrader.com'}/downloads?order=${orderId}&productId=${productId}" 
                         style="display: inline-block; padding: 15px 40px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
                        Tải xuống ngay
                      </a>
                    </div>
                    
                    <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                      <h3 style="color: #1e40af; margin-top: 0;">📋 Hướng dẫn cài đặt:</h3>
                      ${productId.includes('mt5') ? `
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
            
            console.log("✅ Email sent successfully to:", emailRecipient);
            
            // CRITICAL: Mark email as sent to prevent duplicates
            try {
              await connectDB();
              await Order.updateOne(
                { orderId: orderId },
                { $set: { emailSent: true } }
              );
              console.log("✅ Order marked as emailSent = true");
            } catch (updateError) {
              console.error("❌ Failed to update emailSent flag:", updateError);
            }
          } catch (emailError) {
            console.error("❌ Error sending email:", emailError);
          }
        } else {
          console.warn("⚠️ No email recipient found or email already sent - skipping email notification");
        }
        
        return NextResponse.json({ success: true, message: "Order processed" });
      }
    }
    
    return NextResponse.json({ success: true, message: "Webhook received" });
  } catch (error: any) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
