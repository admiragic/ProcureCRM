import type { SVGProps } from "react";

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="120"
      height="30"
      {...props}
    >
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
