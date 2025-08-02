/**
 * @file Defines the SVG Logo component for the application.
 */
import type { SVGProps } from "react";

/**
 * A simple SVG logo component.
 * @param {SVGProps<SVGSVGElement>} props - Standard SVG props.
 * @returns {React.ReactElement} The rendered SVG logo.
 */
export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="120"
      height="30"
      {...props}
    >
      {/* The text is split into two parts to allow for different colors */}
      <text
        x="10"
        y="35"
        fontFamily="'Space Grotesk', sans-serif"
        fontSize="30"
        fontWeight="bold"
        fill="hsl(var(--primary))"
      >
        Procure
        <tspan fill="hsl(var(--foreground))">CRM</tspan>
      </text>
    </svg>
  );
}
