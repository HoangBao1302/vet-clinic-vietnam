/**
 * MongoDB Health Check & Keep-Alive Endpoint
 * 
 * Purpose: 
 * - Check MongoDB connection status
 * - Prevent M0 free tier from auto-pausing after 30 days
 * 
 * Usage:
 * - Manual: Visit https://yourdomain.com/api/health/mongodb
 * - Automated: Setup cron job to ping this endpoint every week
 * 
 * Recommended Cron Services:
 * - UptimeRobot (free): https://uptimerobot.com
 * - Cron-job.org (free): https://cron-job.org
 * - Vercel Cron (paid): https://vercel.com/docs/cron-jobs
 */

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const startTime = Date.now();

  try {
    // Attempt to connect to MongoDB
    const connection = await dbConnect();

    if (!connection) {
      return NextResponse.json(
        {
          status: "warning",
          message: "MongoDB URI not configured",
          timestamp: new Date().toISOString(),
          responseTime: Date.now() - startTime,
        },
        { status: 503 }
      );
    }

    // Perform a ping operation to ensure connection is active
    const adminDb = connection.connection.db.admin();
    const pingResult = await adminDb.ping();

    // Get connection details
    const dbName = connection.connection.name;
    const host = connection.connection.host;
    const readyState = connection.connection.readyState;
    
    // readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    const readyStateMap: Record<number, string> = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    return NextResponse.json({
      status: "healthy",
      message: "MongoDB connection is active",
      database: dbName,
      host: host,
      state: readyStateMap[readyState] || "unknown",
      ping: pingResult,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      note: "Activity timer has been reset. Cluster will remain active.",
    });

  } catch (error: any) {
    console.error("MongoDB health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        message: "Failed to connect to MongoDB",
        error: error.message,
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        troubleshooting: {
          step1: "Check if cluster is paused in MongoDB Atlas",
          step2: "Verify Network Access allows connections (0.0.0.0/0)",
          step3: "Confirm MONGODB_URI is correct in environment variables",
          step4: "Check cluster status at https://cloud.mongodb.com",
        },
      },
      { status: 503 }
    );
  }
}
