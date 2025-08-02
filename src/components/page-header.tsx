/**
 * @file Defines a reusable page header component.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Props for the PageHeader component.
 * @property {string} title - The main title of the page.
 * @property {string} [description] - An optional description or subtitle.
 * @property {ReactNode} [children] - Optional children to render on the right side, like action buttons.
 * @property {string} [className] - Optional additional CSS classes.
 */
interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * A standard page header component with a title, description, and an area for action buttons.
 * @param {PageHeaderProps} props - The component props.
 * @returns {React.ReactElement} The rendered page header.
 */
export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      <div className="grid gap-1">
        <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}
