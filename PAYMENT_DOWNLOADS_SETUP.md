# 💳 Payment & Downloads System - Complete Setup Guide

## ✅ Đã Hoàn Thành

### 📦 **3 Sections Downloads:**

1. **📄 PDF Guides** - 3 files hướng dẫn miễn phí
2. **🎁 Free Indicators & EA** - 3 products miễn phí cho cộng đồng  
3. **💎 Paid Products** - 3 products premium với payment protection

### 💳 **Payment Integration:**
- ✅ Stripe checkout
- ✅ PayPal checkout
- ✅ Order verification system
- ✅ Protected downloads

---

## 📂 File Structure Created

```
app/
├── downloads/
│   └── page.tsx           # Main downloads page
├── checkout/
│   └── page.tsx           # Checkout page (Stripe/PayPal)
└── api/
    ├── create-payment/
    │   └── route.ts       # Create payment session
    ├── verify-order/
    │   └── route.ts       # Verify paid order
    └── webhooks/
        ├── stripe/
        │   └── route.ts   # Stripe webhook handler
        └── paypal/
            └── route.ts   # PayPal webhook handler

public/
└── downloads/
    └── files/
        ├── *.pdf          # PDF guides
        ├── *.ex4          # Free indicators/EA
        └── *.zip          # Paid products (protected)
```

---

## 🚀 Setup Instructions

### **Step 1: Install Dependencies**

```bash
npm install stripe @paypal/checkout-server-sdk
npm install --save-dev @types/node
```

---

### **Step 2: Environment Variables**

Create `.env.local`:

```bash
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal Keys
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=sandbox # or 'live'

# Database (for orders - choose one)
# Option 1: Simple JSON file
ORDERS_DB_PATH=./data/orders.json

# Option 2: PostgreSQL
DATABASE_URL=postgresql://...

# Option 3: MongoDB
MONGODB_URI=mongodb+srv://...

# App Config
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ADMIN_SECRET=your-admin-secret-here

# Email (for sending download links)
RESEND_API_KEY=re_...
RESEND_FROM=downloads@leopardsmart.com
```

---

### **Step 3: Create File Storage**

```bash
mkdir -p public/downloads/files

# Upload your files:
# - PDF guides (free)
# - Free indicators/EA
# - Paid products
```

**File naming:**
```
public/downloads/files/
├── Installation-Guide.pdf
├── Parameter-Guide.pdf
├── Broker-Setup-Guide.pdf
├── SR-Indicator-Free.ex4
├── TrendLines-Free.ex4
├── LeopardSmart-Demo.ex4
├── Indicator-Pro-Pack.zip
├── LeopardSmart-Full.ex4
└── LeopardSmart-Pro-Source.zip
```

---

### **Step 4: Create API Routes**

#### **File: `app/api/create-payment/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const { productId, productName, amount, method, customerInfo } = await request.json();

    if (method === "stripe") {
      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "vnd",
              product_data: {
                name: productName,
                description: `Product ID: ${productId}`,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/downloads/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/downloads?cancelled=true`,
        customer_email: customerInfo.email,
        metadata: {
          productId,
          customerName: customerInfo.name,
          customerPhone: customerInfo.phone,
        },
      });

      return NextResponse.json({
        success: true,
        paymentUrl: session.url,
        sessionId: session.id,
      });
    } else if (method === "paypal") {
      // PayPal integration
      const paypal = require("@paypal/checkout-server-sdk");
      
      const environment = process.env.PAYPAL_MODE === "live"
        ? new paypal.core.LiveEnvironment(
            process.env.PAYPAL_CLIENT_ID,
            process.env.PAYPAL_CLIENT_SECRET
          )
        : new paypal.core.SandboxEnvironment(
            process.env.PAYPAL_CLIENT_ID,
            process.env.PAYPAL_CLIENT_SECRET
          );

      const client = new paypal.core.PayPalHttpClient(environment);

      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: (amount / 25000).toFixed(2), // VND to USD conversion
            },
            description: productName,
          },
        ],
        application_context: {
          brand_name: "EA LeopardSmart",
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/paypal/capture`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/downloads?cancelled=true`,
        },
      });

      const order = await client.execute(request);
      const approveUrl = order.result.links.find((link: any) => link.rel === "approve")?.href;

      return NextResponse.json({
        success: true,
        paymentUrl: approveUrl,
        orderId: order.result.id,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid payment method" }, { status: 400 });
  } catch (error: any) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

#### **File: `app/api/verify-order/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const ORDERS_FILE = join(process.cwd(), "data", "orders.json");

interface Order {
  orderId: string;
  productId: string;
  status: "pending" | "paid" | "completed";
  customerEmail: string;
  createdAt: string;
  paidAt?: string;
}

function getOrders(): Order[] {
  if (!existsSync(ORDERS_FILE)) {
    return [];
  }
  const data = readFileSync(ORDERS_FILE, "utf-8");
  return JSON.parse(data);
}

export async function POST(request: NextRequest) {
  try {
    const { orderId, productId } = await request.json();

    const orders = getOrders();
    const order = orders.find(
      (o) => o.orderId === orderId && o.productId === productId
    );

    if (!order) {
      return NextResponse.json({
        verified: false,
        error: "Không tìm thấy đơn hàng",
      });
    }

    if (order.status !== "paid") {
      return NextResponse.json({
        verified: false,
        error: "Đơn hàng chưa được thanh toán",
      });
    }

    // Generate secure download link
    const downloadUrl = `/downloads/files/${productId}`;

    return NextResponse.json({
      verified: true,
      downloadUrl,
      orderInfo: {
        orderId: order.orderId,
        productId: order.productId,
        paidAt: order.paidAt,
      },
    });
  } catch (error: any) {
    console.error("Order verification error:", error);
    return NextResponse.json(
      { verified: false, error: "Lỗi xác thực đơn hàng" },
      { status: 500 }
    );
  }
}
```

---

#### **File: `app/api/webhooks/stripe/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

const resend = new Resend(process.env.RESEND_API_KEY);

const ORDERS_FILE = join(process.cwd(), "data", "orders.json");

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Save order to database
    const order = {
      orderId: session.id,
      productId: session.metadata?.productId,
      status: "paid",
      customerEmail: session.customer_email,
      customerName: session.metadata?.customerName,
      customerPhone: session.metadata?.customerPhone,
      amount: session.amount_total,
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    };

    // Save to file (or database)
    const orders = existsSync(ORDERS_FILE)
      ? JSON.parse(readFileSync(ORDERS_FILE, "utf-8"))
      : [];
    orders.push(order);
    writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));

    // Send email with download link
    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: session.customer_email!,
      subject: "Download EA LeopardSmart - Thanh toán thành công",
      html: `
        <h2>Cảm ơn bạn đã mua hàng!</h2>
        <p>Mã đơn hàng: <strong>${session.id}</strong></p>
        <p>Sử dụng mã này để tải file tại: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/downloads">Download Page</a></p>
        <p>Hoặc click link trực tiếp: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/downloads/${order.productId}?order=${session.id}">Tải ngay</a></p>
      `,
    });
  }

  return NextResponse.json({ received: true });
}
```

---

### **Step 5: Stripe Setup**

1. **Create Stripe Account:**
   - Go to https://stripe.com
   - Sign up or login
   - Get API keys from Dashboard

2. **Get Test Keys:**
   ```
   Publishable: pk_test_...
   Secret: sk_test_...
   ```

3. **Setup Webhook:**
   - Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Events to select:
     - `checkout.session.completed`
   - Get webhook secret: `whsec_...`

4. **Test Cards:**
   ```
   Success: 4242 4242 4242 4242
   Declined: 4000 0000 0000 0002
   3D Secure: 4000 0027 6000 3184
   ```

---

### **Step 6: PayPal Setup**

1. **Create PayPal Developer Account:**
   - Go to https://developer.paypal.com
   - Login/Sign up
   - Create App

2. **Get Credentials:**
   ```
   Client ID: ...
   Secret: ...
   ```

3. **Sandbox Testing:**
   - Create test buyer/seller accounts
   - Test transactions with sandbox credentials

4. **Setup Webhook:**
   - Webhooks → Add webhook
   - URL: `https://yourdomain.com/api/webhooks/paypal`
   - Events:
     - PAYMENT.CAPTURE.COMPLETED
     - PAYMENT.CAPTURE.DENIED

---

### **Step 7: Create Data Directory**

```bash
mkdir -p data
echo "[]" > data/orders.json
```

---

### **Step 8: Email Template (Resend)**

Create email template for download links:

```typescript
// lib/emailTemplates.ts
export const downloadEmail = (orderInfo: any) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { background: #f8f9fa; padding: 30px; }
    .button { display: inline-block; padding: 15px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Thanh toán thành công!</h1>
    </div>
    <div class="content">
      <h2>Cảm ơn bạn đã mua hàng</h2>
      <p><strong>Sản phẩm:</strong> ${orderInfo.productName}</p>
      <p><strong>Mã đơn hàng:</strong> ${orderInfo.orderId}</p>
      <p><strong>Số tiền:</strong> ${orderInfo.amount.toLocaleString("vi-VN")}đ</p>
      
      <p>Bạn có thể tải file ngay bây giờ:</p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/downloads?order=${orderInfo.orderId}" class="button">
        Tải xuống ngay
      </a>
      
      <p>Hoặc sử dụng mã đơn hàng trên tại trang Downloads để xác thực và tải.</p>
      
      <h3>Hướng dẫn cài đặt:</h3>
      <ol>
        <li>Giải nén file (nếu là .zip)</li>
        <li>Copy file .ex4 vào thư mục MQL4/Experts hoặc MQL5/Experts</li>
        <li>Restart MT4/MT5</li>
        <li>Drag EA lên chart và configure</li>
      </ol>
      
      <p>Cần hỗ trợ? Liên hệ:</p>
      <ul>
        <li>📧 Email: support@leopardsmart.com</li>
        <li>📱 Telegram: @LeopardSmartSupport</li>
        <li>📞 Hotline: +84 901 234 567</li>
      </ul>
    </div>
    <div class="footer">
      <p>EA Forex LeopardSmart<br>
      © 2025 All rights reserved</p>
    </div>
  </div>
</body>
</html>
`;
```

---

### **Step 9: Protected Downloads (Optional)**

For extra security, create signed URLs:

```typescript
// lib/downloadToken.ts
import crypto from "crypto";

const SECRET = process.env.DOWNLOAD_SECRET || "your-secret-key";

export function generateDownloadToken(orderId: string, productId: string, expiresIn: number = 3600000) {
  const expires = Date.now() + expiresIn;
  const data = `${orderId}:${productId}:${expires}`;
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(data)
    .digest("hex");
  
  return Buffer.from(`${data}:${signature}`).toString("base64");
}

export function verifyDownloadToken(token: string): { valid: boolean; orderId?: string; productId?: string } {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [orderId, productId, expires, signature] = decoded.split(":");
    
    if (Date.now() > parseInt(expires)) {
      return { valid: false };
    }
    
    const data = `${orderId}:${productId}:${expires}`;
    const expectedSignature = crypto
      .createHmac("sha256", SECRET)
      .update(data)
      .digest("hex");
    
    if (signature !== expectedSignature) {
      return { valid: false };
    }
    
    return { valid: true, orderId, productId };
  } catch {
    return { valid: false };
  }
}
```

**Usage in download route:**

```typescript
// app/api/download/[productId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyDownloadToken } from "@/lib/downloadToken";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const token = request.nextUrl.searchParams.get("token");
  
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 401 });
  }
  
  const verification = verifyDownloadToken(token);
  
  if (!verification.valid || verification.productId !== params.productId) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
  }
  
  // Serve file
  const filePath = join(process.cwd(), "public", "downloads", "files", `${params.productId}.ex4`);
  const file = readFileSync(filePath);
  
  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${params.productId}.ex4"`,
    },
  });
}
```

---

### **Step 10: Add Download Link to Header/Footer**

Update `components/Header.tsx` and `Footer.tsx`:

```typescript
<Link href="/downloads" className="...">
  Downloads
</Link>
```

---

## 🎯 Admin Upload Page (Simple Version)

Create `app/admin/uploads/page.tsx`:

```typescript
"use client";

import { useState } from "react";

export default function AdminUploadsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<"pdf" | "free" | "paid">("pdf");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Upload thành công!");
        setFile(null);
      } else {
        alert("Upload thất bại!");
      }
    } catch (error) {
      alert("Lỗi upload!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Admin - Upload Files</h1>
      
      <div className="max-w-md space-y-4">
        <div>
          <label className="block mb-2">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full p-2 border rounded"
          >
            <option value="pdf">PDF Guide</option>
            <option value="free">Free Indicator/EA</option>
            <option value="paid">Paid Product</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">File:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
```

**API Route:** `app/api/admin/upload/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string;

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadPath = join(
      process.cwd(),
      "public",
      "downloads",
      "files",
      file.name
    );

    await writeFile(uploadPath, buffer);

    return NextResponse.json({ success: true, filename: file.name });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

## ✅ Testing Checklist

### **Free Downloads:**
- [ ] Visit `/downloads`
- [ ] Click "Tải xuống" on PDF
- [ ] File downloads immediately
- [ ] Try all 6 free items

### **Paid Products:**
- [ ] Click "Mua với Stripe"
- [ ] Redirects to checkout
- [ ] Fill form → Submit
- [ ] Redirects to Stripe payment
- [ ] Test card: `4242 4242 4242 4242`
- [ ] Payment success → Receive email
- [ ] Use order code to download

### **Order Verification:**
- [ ] Go back to `/downloads`
- [ ] Enter order code
- [ ] Click "Xác thực"
- [ ] File downloads

### **PayPal:**
- [ ] Click "Mua với PayPal"
- [ ] Redirects to PayPal sandbox
- [ ] Login with test buyer account
- [ ] Complete payment
- [ ] Webhook processes order
- [ ] Receive email

---

## 📊 Database Options

### **Option 1: JSON File (Simple)**
```typescript
// Already implemented in verify-order route
// Good for: < 100 orders/day
```

### **Option 2: PostgreSQL**
```bash
npm install @vercel/postgres
```

```typescript
import { sql } from "@vercel/postgres";

await sql`
  INSERT INTO orders (order_id, product_id, status, customer_email)
  VALUES (${orderId}, ${productId}, 'paid', ${email})
`;
```

### **Option 3: MongoDB**
```bash
npm install mongodb
```

```typescript
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
await client.connect();
const db = client.db("downloads");
await db.collection("orders").insertOne({...});
```

---

## 🚀 Deployment

### **Vercel:**
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy
5. Update webhook URLs to production domain

### **Environment:**
```bash
# Production .env
STRIPE_SECRET_KEY=sk_live_...
PAYPAL_MODE=live
NEXT_PUBLIC_BASE_URL=https://leopardsmart.com
```

---

## 💡 Tips & Best Practices

### **Security:**
- Never expose secret keys in client code
- Use webhook secrets to verify authenticity
- Implement rate limiting
- Add CAPTCHA for free downloads (optional)

### **UX:**
- Send email immediately after payment
- Provide order code in email
- Allow multiple download attempts
- Clear error messages

### **Performance:**
- Use CDN for file delivery (Cloudflare, AWS CloudFront)
- Compress large files
- Implement download resume (Range headers)

---

## 📞 Support

**Documentation:**
- Stripe: https://stripe.com/docs
- PayPal: https://developer.paypal.com/docs
- Resend: https://resend.com/docs

**Issues:**
- Check webhook logs in Stripe/PayPal dashboard
- Verify environment variables
- Check console errors
- Test with sandbox credentials first

---

**Status:** 🟢 Ready for Implementation
**Complexity:** ⭐⭐⭐⭐ Medium-High
**Est. Setup Time:** 4-8 hours

---

**Last Updated:** October 3, 2025
**Version:** 1.0

