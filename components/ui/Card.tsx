interface Props {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({
  title,
  subtitle,
  children,
  className = "",
}: Props) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm transition-all ${className}`}
    >
      {(title || subtitle) && (
        <div className="border-b border-slate-200 px-6 py-5">

          {title && (
            <h2 className="text-xl font-bold text-slate-900">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          )}

        </div>
      )}

      <div className="p-6">
        {children}
      </div>

    </section>
  );
}