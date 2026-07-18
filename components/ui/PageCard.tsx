import { ReactNode } from "react";

interface PageCardProps {
  children: ReactNode;
  className?: string;
}

export default function PageCard({
  children,
  className = "",
}: PageCardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}