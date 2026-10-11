import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name} — ${site.tagline}`;
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
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(120% 120% at 0% 0%, #79ADDC 0%, #FCF5C7 55%)",
          color: "#2B2B26",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: 4,
          }}
        >
          <span>JELAJA</span>
          <span style={{ color: "#FFC069" }}>NIME</span>
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          Jelajahi anime, temukan ceritanya.
        </div>
        <div style={{ marginTop: 28, fontSize: 28, color: "#7B7460" }}>
          Katalog anime · trailer resmi · tonton di sumber legal
        </div>
      </div>
    ),
    size,
  );
}
