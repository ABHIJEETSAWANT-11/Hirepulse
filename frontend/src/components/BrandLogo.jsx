import React from "react";
import Logo from "@/components/Logo";

/**
 * HirePulse brand logo (v2 SVG mark + wordmark).
 *
 * Kept as a thin wrapper so existing usages (`variant="lockup"`,
 * class-based sizing) keep working while rendering the DESIGN.md v2 logo.
 */
const BrandLogo = ({ variant = "wordmark", className = "" }) => {
  const size = variant === "lockup" ? 34 : 28;
  return <Logo size={size} className={className} />;
};

export default BrandLogo;
