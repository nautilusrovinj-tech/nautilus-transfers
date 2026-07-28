import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">

      <div className="min-w-0">

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1 text-base text-slate-500">
            {subtitle}
          </p>
        )}

      </div>

      {action && (
        <div className="w-full md:w-auto">
          {action}
        </div>
      )}

    </div>
  );
}