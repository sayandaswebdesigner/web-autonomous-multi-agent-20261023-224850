import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, source } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email format." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const subscriberRecord = {
      email: cleanEmail,
      name: name?.trim() || null,
      source: source || "website_waitlist",
      created_at: new Date().toISOString(),
    };

    // If Supabase credentials are configured, persist to database
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("subscribers")
        .insert([subscriberRecord])
        .select()
        .single();

      if (error) {
        // If unique constraint violation, treat as already subscribed gracefully
        if (error.code === "23505" || error.message.includes("duplicate")) {
          return NextResponse.json(
            {
              success: true,
              message: "You are already registered on our early access list!",
              data: { email: cleanEmail, status: "existing" },
            },
            { status: 200 }
          );
        }
        console.error("[API /api/subscribe] Supabase insert error:", error);
        return NextResponse.json(
          { success: false, error: "Failed to save subscriber record." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Successfully joined the early access waitlist!",
          data: data || subscriberRecord,
        },
        { status: 201 }
      );
    }

    // Local Mock / Demo Sandbox response when Supabase keys are not set
    console.log("[API /api/subscribe] Sandbox mode subscriber saved:", subscriberRecord);
    return NextResponse.json(
      {
        success: true,
        message: "Successfully joined the waitlist! (Sandbox mode verified)",
        data: {
          id: `sub_${Date.now()}`,
          ...subscriberRecord,
          status: "confirmed",
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[API /api/subscribe] Request error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "operational",
    endpoint: "/api/subscribe",
    isDatabaseConnected: isSupabaseConfigured,
    timestamp: new Date().toISOString(),
  });
}
