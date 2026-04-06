import { ImageResponse } from "next/og";
import { generateSeedData } from "@/lib/seed";

export const revalidate = 60;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { pools } = generateSeedData();
  const pool = pools.find((p) => p.id === id);

  if (!pool) {
    return new Response("Pool not found", { status: 404 });
  }

  const percentage = Math.min(
    100,
    Math.round((pool.raisedSol / pool.targetSol) * 100)
  );
  const participantCount = pool.participants.length;

  const now = Date.now();
  const msLeft = pool.expiresAt - now;
  const hoursLeft = Math.max(0, Math.floor(msLeft / 3_600_000));
  const daysLeft = Math.floor(hoursLeft / 24);
  const endingSoon = msLeft > 0 && msLeft < 86_400_000;
  const isExpired = msLeft <= 0;
  const isLaunched = pool.status === "launched";

  let timeLabel = "";
  if (isLaunched) {
    timeLabel = "Launched";
  } else if (isExpired) {
    timeLabel = "Expired";
  } else if (daysLeft > 0) {
    timeLabel = `${daysLeft}d ${hoursLeft % 24}h left`;
  } else {
    timeLabel = `${hoursLeft}h left`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(145deg, #0a0a0f 0%, #12121f 50%, #0a0a0f 100%)",
          padding: "60px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow top-left */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "-120px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        {/* Ambient glow bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-100px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top row: branding + ending soon */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* Logo mark */}
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #a855f7, #ec4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                color: "white",
                fontWeight: 700,
              }}
            >
              LA
            </div>
            <span
              style={{
                color: "#a855f7",
                fontSize: "24px",
                fontWeight: 700,
                letterSpacing: "-0.5px",
              }}
            >
              Lumina Arcade
            </span>
          </div>

          {endingSoon && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.4)",
                borderRadius: "20px",
                padding: "8px 20px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#ef4444",
                  display: "flex",
                }}
              />
              <span style={{ color: "#ef4444", fontSize: "18px", fontWeight: 600 }}>
                Ending Soon
              </span>
            </div>
          )}
        </div>

        {/* Pool name and ticker */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{
                fontSize: "56px",
                fontWeight: 800,
                color: "white",
                letterSpacing: "-1px",
                lineHeight: 1.1,
              }}
            >
              {pool.name}
            </span>
            <span
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#22d3ee",
                background: "rgba(34,211,238,0.1)",
                border: "1px solid rgba(34,211,238,0.25)",
                borderRadius: "12px",
                padding: "4px 16px",
              }}
            >
              ${pool.ticker}
            </span>
          </div>
          <span style={{ fontSize: "20px", color: "#9ca3af", fontWeight: 500 }}>
            Created by {pool.creatorName}
          </span>
        </div>

        {/* Spacer */}
        <div style={{ display: "flex", flex: 1 }} />

        {/* Progress section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: "20px", color: "#9ca3af", fontWeight: 500 }}>
              Progress
            </span>
            <span style={{ fontSize: "20px", color: "#d1d5db", fontWeight: 600 }}>
              {pool.raisedSol.toFixed(1)} / {pool.targetSol} SOL
            </span>
          </div>

          {/* Progress bar background */}
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "28px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Progress bar fill */}
            <div
              style={{
                display: "flex",
                width: `${percentage}%`,
                height: "100%",
                borderRadius: "14px",
                background: percentage >= 100
                  ? "linear-gradient(90deg, #22c55e, #16a34a)"
                  : "linear-gradient(90deg, #a855f7, #ec4899)",
              }}
            />
          </div>

          {/* Percentage label */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <span
              style={{
                fontSize: "32px",
                fontWeight: 800,
                color: percentage >= 100 ? "#22c55e" : "#a855f7",
              }}
            >
              {percentage}%
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "48px" }}>
            {/* Participants */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "16px", color: "#6b7280", fontWeight: 500 }}>
                Participants
              </span>
              <span style={{ fontSize: "28px", color: "white", fontWeight: 700 }}>
                {participantCount}
              </span>
            </div>

            {/* Time left */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "16px", color: "#6b7280", fontWeight: 500 }}>
                Time Left
              </span>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: endingSoon ? "#ef4444" : isLaunched ? "#22c55e" : "white",
                }}
              >
                {timeLabel}
              </span>
            </div>

            {/* Status */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "16px", color: "#6b7280", fontWeight: 500 }}>
                Status
              </span>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: isLaunched ? "#22c55e" : pool.status === "active" ? "#22d3ee" : "#6b7280",
                }}
              >
                {pool.status.charAt(0).toUpperCase() + pool.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Powered by */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "2px",
            }}
          >
            <span style={{ fontSize: "13px", color: "#4b5563", fontWeight: 500 }}>
              Powered by
            </span>
            <span style={{ fontSize: "20px", color: "#ec4899", fontWeight: 700 }}>
              Bags.fm
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
