import React from "react";

/**
 * HirePulse logo (DESIGN.md v2) — black rounded mark, white "H",
 * green pulse line, concentric brand dots. Pure SVG, no image assets.
 *
 * variant="default" — black mark (light surfaces)
 * variant="dark"    — white mark (for dark sidebar surfaces)
 * showText          — render the Hire/Pulse wordmark next to the mark
 */
const Logo = ({ size = 28, variant = "default", showText = true, className = "" }) => {
  const isDark = variant === "dark";
  const markBg = isDark ? "#FFFFFF" : "#0F0F0F";
  const hStroke = isDark ? "#0F0F0F" : "#FFFFFF";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          borderRadius: 9,
          background: markBg,
          boxShadow: "0 1px 2px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.08)",
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {/* circle glow */}
        <circle cx="16" cy="16" r="10" fill="#5A8F2A" opacity="0.12" />
        {/* H shape */}
        <path
          d="M10 9.5 L10 22.5 M22 9.5 L22 22.5"
          stroke={hStroke}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* pulse line */}
        <path
          d="M10 16 L13.5 16 L15 13.5 L17 18.5 L18.5 16 L22 16"
          stroke="#6BAE3A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* core dot + mid + light */}
        <circle cx="16" cy="16" r="2.8" fill="#3A5A1E" />
        <circle cx="16" cy="16" r="1.6" fill="#6BAE3A" />
        <circle cx="16" cy="16" r="0.7" fill="#8BC53F" />
      </svg>

      {showText && (
        <span
          className="font-heading font-bold tracking-[-0.02em]"
          style={{ fontSize: Math.max(size * 0.6, 15), lineHeight: 1 }}
        >
          <span style={{ color: isDark ? "#FFFFFF" : "#0F0F0F" }}>Hire</span>
          <span style={{ color: "#3A5A1E", fontWeight: 600 }}>Pulse</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
