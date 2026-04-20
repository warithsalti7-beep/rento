import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0F0F0F",
          fontSize: 44,
          fontWeight: 700,
          color: "#FFFFFF",
          letterSpacing: "-0.06em",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        r
        <span
          style={{
            display: "flex",
            width: 7,
            height: 7,
            borderRadius: 999,
            background: "#1C2A44",
            marginLeft: 2,
            marginTop: 16,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
