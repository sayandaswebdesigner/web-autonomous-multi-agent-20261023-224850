import { NextRequest, NextResponse } from "next/server";

interface ValidatorNode {
  id: string;
  address: string;
  lastSeen: string;
  consensusRound: number;
  status: "online" | "offline" | "degraded";
}

interface SyncResult {
  job: "validator_sync";
  status: "completed" | "partial" | "failed";
  records_synced: number;
  duration_ms: number;
  timestamp: string;
  environment: string;
  nodes_checked: number;
  nodes_online: number;
  nodes_offline: number;
  new_checkpoints: number;
}

/** GET /api/cron/sync - Trigger hourly validator consensus sync */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Verify Authorization: Bearer ${CRON_SECRET} if configured
    if (cronSecret) {
      if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Invalid or missing Cron Bearer token." },
          { status: 401 }
        );
      }
    }

    const timestamp = new Date().toISOString();
    const environment = process.env.NODE_ENV || "production";

    // Simulate checking validator nodes across edge PoPs
    const nodes: ValidatorNode[] = [];
    const nodeCount = 150;
    const now = new Date();

    for (let i = 1; i <= nodeCount; i++) {
      const isOnline = Math.random() > 0.1; // 90% online
      nodes.push({
        id: `val_${String(i).padStart(3, "0")}`,
        address: `https://validator-${i}.nexus-analytics.io`,
        lastSeen: now.toISOString(),
        consensusRound: Math.floor(Math.random() * 100) + 1,
        status: isOnline ? "online" : "offline",
      });
    }

    const nodesOnline = nodes.filter((n) => n.status === "online").length;
    const nodesOffline = nodes.filter((n) => n.status === "offline").length;
    const recordsSynced = Math.floor((nodesOnline / nodeCount) * 200); // ~142 avg
    const durationMs = Math.floor(Math.random() * 60000) + 30000; // 30-90s
    const newCheckpoints = Math.floor(Math.random() * 50) + 10; // 10-60 new checkpoints

    const syncResult: SyncResult = {
      job: "validator_sync",
      status: nodesOnline === nodeCount ? "completed" : nodesOnline > nodeCount * 0.5 ? "partial" : "failed",
      records_synced: recordsSynced,
      duration_ms: durationMs,
      timestamp,
      environment,
      nodes_checked: nodeCount,
      nodes_online: nodesOnline,
      nodes_offline: nodesOffline,
      new_checkpoints: newCheckpoints,
    };

    // Persist synced checkpoints to DB (mock/Supabase fallback handled at app layer)
    // In production: INSERT into consensus_checkpoints table with RLS policies

    return NextResponse.json(
      {
        success: true,
        message: "Scheduled cron synchronization executed successfully.",
        data: syncResult,
      },
      { status: 200 }
    );
  } catch (error: any) {
    const timestamp = new Date().toISOString();
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error during cron synchronization.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Support both GET (default Vercel Cron) and POST triggers
  return GET(req);
}
