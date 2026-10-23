import { ImageResponse } from "next/og";

export const alt =
  "Hunt n Farm - commercial education, advisory, and community";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a2338",
          color: "#f7f2e8",
          padding: "64px 72px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -160,
            top: -220,
            width: 620,
            height: 620,
            border: "1px solid rgba(184,138,59,0.25)",
            borderRadius: "999px",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 40,
            width: 330,
            height: 330,
            border: "1px solid rgba(184,138,59,0.16)",
            borderRadius: "999px",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 54,
              height: 54,
              border: "1px solid rgba(247,242,232,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Georgia, serif",
              fontSize: 30,
              color: "#f7f2e8",
            }}
          >
            H
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <span
              style={{
                fontSize: 20,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Hunt n Farm
            </span>
            <span
              style={{
                marginTop: 5,
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(247,242,232,0.45)",
              }}
            >
              Training / Advisory / Community
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 78,
              lineHeight: 0.98,
              letterSpacing: "-0.04em",
              maxWidth: 880,
            }}
          >
            Commercial capability,
            <br />
            built for the real work.
          </span>
          <span
            style={{
              marginTop: 30,
              fontFamily: "Arial, sans-serif",
              fontSize: 18,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#d9bd84",
            }}
          >
            First Quota / Revenue Lab / Advisory
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(247,242,232,0.15)",
            paddingTop: 18,
            fontFamily: "Arial, sans-serif",
            fontSize: 13,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(247,242,232,0.4)",
          }}
        >
          <span>Practical commercial education</span>
          <span style={{ color: "#d9bd84" }}>
            Education / Advisory / Community
          </span>
        </div>
      </div>
    ),
    size,
  );
}
