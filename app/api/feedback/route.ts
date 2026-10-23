import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, message, category, rating } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "A message is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const feedbackRecord = {
      email: email.trim().toLowerCase(),
      name: name?.trim() || "Anonymous",
      message: message.trim(),
      category: category || "general",
      rating: typeof rating === "number" ? rating : null,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("feedback")
        .insert([feedbackRecord])
        .select()
        .single();

      if (error) {
        console.error("[API /api/feedback] Supabase error:", error);
        return NextResponse.json(
          { success: false, error: "Failed to persist feedback." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Thank you for your feedback! Our team has received your submission.",
          data: data || feedbackRecord,
        },
        { status: 201 }
      );
    }

    // Mock fallback response
    console.log("[API /api/feedback] Mock feedback received:", feedbackRecord);
    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your feedback has been recorded in sandbox mode.",
        data: {
          id: `fb_${Date.now()}`,
          ...feedbackRecord,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[API /api/feedback] Server error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "operational",
    endpoint: "/api/feedback",
    isDatabaseConnected: isSupabaseConfigured,
    timestamp: new Date().toISOString(),
  });
}
