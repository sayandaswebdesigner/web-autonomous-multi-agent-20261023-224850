import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

type WebhookEventType =
  | "consensus_round_finalized"
  | "validator_status_change"
  | "telemetry_ingest"
  | "alert_dispatched";

interface BaseWebhookPayload {
  event: WebhookEventType;
  round?: number;
  validatorId?: string;
  timestamp: string;
  status: "success" | "failure";
}

interface ConsensusRoundFinalizedPayload extends BaseWebhookPayload {
  event: "consensus_round_finalized";
  round: number;
  finalizedAt: string;
  checkpoints: number;
}

interface ValidatorStatusChangePayload extends BaseWebhookPayload {
  event: "validator_status_change";
  validatorId: string;
  oldStatus: "online" | "offline" | "degraded";
  newStatus: "online" | "offline" | "degraded";
}

interface TelemetryIngestPayload extends BaseWebhookPayload {
  event: "telemetry_ingest";
  endpoint: string;
  durationMs: number;
  bytes: number;
}

interface AlertDispatchedPayload extends BaseWebhookPayload {
  event: "alert_dispatched";
  alertId: string;
  severity: "low" | "medium" | "high" | "critical";
  channels: ("slack" | "email" | "pagerduty")[];
}

type WebhookPayload =
  | ConsensusRoundFinalizedPayload
  | ValidatorStatusChangePayload
  | TelemetryIngestPayload
  | AlertDispatchedPayload;

interface VerifiedWebhook {
  event: WebhookEventType;
  payload: WebhookPayload;
  signatureVerified: boolean;
}

/** POST /api/webhook - Incoming webhook event receiver with HMAC validation */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature =
      req.headers.get("x-signature-256") ||
      req.headers.get("x-hub-signature-256");
    const webhookSecret = process.env.WEBHOOK_SECRET;

    // HMAC Signature Validation if secret is configured
    if (webhookSecret && signature) {
      const hmac = crypto.createHmac("sha256", webhookSecret);
      const digest = "sha256=" + hmac.update(rawBody).digest("hex");

      const trusted = Buffer.from(digest, "utf-8");
      const untrusted = Buffer.from(signature, "utf-8");

      if (
        trusted.length !== untrusted.length ||
        !crypto.timingSafeEqual(trusted, untrusted)
      ) {
        return NextResponse.json(
          { success: false, error: "Invalid HMAC webhook signature." },
          { status: 401 }
        );
      }
    }

    let payload: any;
    try {
      payload = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      payload = { raw: rawBody };
    }

    const eventId = req.headers.get("x-event-id") || `evt_${Date.now()}`;
    const eventTypeHeader = req.headers.get("x-event-type") as string | null;
    const rawEventType = payload.event as WebhookEventType | undefined;

    // Determine event type from header, payload, or default
    let eventType: WebhookEventType | undefined;

    if (eventTypeHeader) {
      if (["consensus_round_finalized", "validator_status_change", "telemetry_ingest", "alert_dispatched"].includes(eventTypeHeader)) {
        eventType = eventTypeHeader as WebhookEventType;
      } else {
        eventType = undefined;
      }
    } else {
      eventType = rawEventType;
    }

    // Type-narrow payload based on event type
    let verifiedPayload: WebhookPayload;

    switch (eventType) {
      case "consensus_round_finalized": {
        const p = payload as ConsensusRoundFinalizedPayload;
        verifiedPayload = {
          event: "consensus_round_finalized",
          round: p.round,
          validatorId: p.validatorId,
          timestamp: p.timestamp,
          status: p.status,
        } as ConsensusRoundFinalizedPayload;
        break;
      }
      case "validator_status_change": {
        const p = payload as ValidatorStatusChangePayload;
        verifiedPayload = {
          event: "validator_status_change",
          validatorId: p.validatorId,
          oldStatus: p.oldStatus,
          newStatus: p.newStatus,
          timestamp: p.timestamp,
          status: p.status,
        } as ValidatorStatusChangePayload;
        break;
      }
      case "telemetry_ingest": {
        const p = payload as TelemetryIngestPayload;
        verifiedPayload = {
          event: "telemetry_ingest",
          endpoint: p.endpoint,
          durationMs: p.durationMs,
          bytes: p.bytes,
          timestamp: p.timestamp,
          status: p.status,
        } as TelemetryIngestPayload;
        break;
      }
      case "alert_dispatched": {
        const p = payload as AlertDispatchedPayload;
        verifiedPayload = {
          event: "alert_dispatched",
          alertId: p.alertId,
          severity: p.severity,
          channels: p.channels,
          timestamp: p.timestamp,
          status: p.status,
        } as AlertDispatchedPayload;
        break;
      }
      default:
        verifiedPayload = {
          event: "generic.webhook",
          timestamp: new Date().toISOString(),
          status: "success",
        } as unknown as WebhookPayload;
        break;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Webhook event received and verified.",
        data: {
          eventId,
          eventType: verifiedPayload.event,
          receivedAt: new Date().toISOString(),
          verified: Boolean(webhookSecret && signature),
          payloadSummary: {
            keys: typeof verifiedPayload === "object" && verifiedPayload ? Object.keys(verifiedPayload) : [],
            byteLength: rawBody.length,
            event: verifiedPayload.event,
          },
          payload: verifiedPayload,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to process webhook." },
      { status: 500 }
    );
  }
}
