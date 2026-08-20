import type { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
  center = false,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  center?: boolean;
}) {
  return (
    <section className={`relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 ${className}`}>
      {(eyebrow || title || subtitle) && (
        <div className={`mb-12 max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
          {eyebrow && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              {eyebrow}
            </div>
          )}
          {title && <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">{title}</h2>}
          {subtitle && <p className="mt-4 text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
