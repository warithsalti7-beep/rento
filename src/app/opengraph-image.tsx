import { ImageResponse } from "next/og";

export const alt = "Rento – Lei bil. Enkelt.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            fontSize: 48,
            fontWeight: 700,
            color: "#0F0F0F",
            letterSpacing: "-0.04em",
          }}
        >
          rento
          <span
            style={{
              display: "flex",
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#1C2A44",
              marginLeft: 8,
              marginBottom: 14,
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 120,
              fontWeight: 600,
              color: "#0F0F0F",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            Lei bil. Enkelt.
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#6b6b6b",
              fontWeight: 400,
            }}
          >
            Book på sekunder. Vi leverer til deg.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "#6b6b6b",
          }}
        >
          <span>rentobil.no</span>
          <span>Bilutleie i Norge</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
