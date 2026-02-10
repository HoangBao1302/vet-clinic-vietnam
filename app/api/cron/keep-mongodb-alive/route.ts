/**
 * Vercel Cron Job Endpoint - Keep MongoDB Alive
 * 
 * This endpoint is designed to be called by Vercel Cron Jobs
 * to prevent MongoDB Atlas M0 free tier from auto-pausing.
 * 
 * Setup in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/keep-mongodb-alive",
 *     "schedule": "0 0 * * 1"
 *   }]
 * }
 * 
 * Schedule: Every Monday at 00:00 UTC (weekly)
 * 
 * Note: Vercel Cron requires Pro plan or higher
 */

import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  // Verify request is from Vercel Cron (optional security)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // If CRON_SECRET is set, verify it matches
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  try {
    console.log(`[${timestamp}] 🔄 Cron: Keep MongoDB alive started`);

    const connection = await dbConnect();

    if (!connection) {
      console.log(`[${timestamp}] ⚠️  MongoDB URI not configured`);
      return NextResponse.json({
        success: false,
        message: "MongoDB URI not configured",
        timestamp,
      });
    }

    // Perform ping to keep connection active
    const adminDb = connection.connection.db.admin();
    await adminDb.ping();

    const dbName = connection.connection.name;
    const responseTime = Date.now() - startTime;

    console.log(`[${timestamp}] ✅ MongoDB pinged successfully (${responseTime}ms)`);
    console.log(`[${timestamp}] 📊 Database: ${dbName}`);

    return NextResponse.json({
      success: true,
      message: "MongoDB activity timer reset successfully",
      database: dbName,
      timestamp,
      responseTime,
    });

  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    console.error(`[${timestamp}] ❌ Cron failed:`, error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to ping MongoDB",
        error: error.message,
        timestamp,
        responseTime,
      },
      { status: 500 }
    );
  }
}
