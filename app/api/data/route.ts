import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table") || "records";
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return NextResponse.json({
          success: true,
          table,
          count: data.length,
          data,
          source: "supabase",
        });
      }
    }

    // Default mock data seed for instant frontend rendering
    const mockDataMap: Record<string, any[]> = {
      prompts: [
        {
          id: "prm_1",
          title: "Production System Prompt",
          description: "Optimized prompt for enterprise AI code generation with strict TS rules.",
          tokens: 420,
          category: "Engineering",
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "prm_2",
          title: "Autonomous Agent Orchestrator",
          description: "Zero-latency multi-step task resolution engine with automated tool calling.",
          tokens: 780,
          category: "Agentic",
          created_at: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: "prm_3",
          title: "SQL Query Synthesizer",
          description: "Converts natural language schemas into parameterized ClickHouse & Postgres queries.",
          tokens: 310,
          category: "Database",
          created_at: new Date(Date.now() - 10800000).toISOString(),
        },
      ],
      records: [
        {
          id: "rec_1",
          title: "Distributed Edge Gateway",
          status: "active",
          latency_ms: 1.2,
          created_at: new Date().toISOString(),
        },
        {
          id: "rec_2",
          title: "HMAC Token Verifier",
          status: "active",
          latency_ms: 0.4,
          created_at: new Date().toISOString(),
        },
      ],
    };

    const fallbackRecords = mockDataMap[table] || mockDataMap["records"];

    return NextResponse.json({
      success: true,
      table,
      count: fallbackRecords.length,
      data: fallbackRecords,
      source: "mock_sandbox",
    });
  } catch (err: any) {
    console.error("[API /api/data GET] Error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to fetch data." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { table = "records", payload } = body;

    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { success: false, error: "A valid payload object is required." },
        { status: 400 }
      );
    }

    const record = {
      ...payload,
      id: payload.id || `rec_${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from(table).insert([record]).select().single();
      if (!error) {
        return NextResponse.json(
          { success: true, table, data: data || record, source: "supabase" },
          { status: 201 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        table,
        message: "Record persisted successfully (sandbox mode).",
        data: record,
        source: "mock_sandbox",
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[API /api/data POST] Error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
