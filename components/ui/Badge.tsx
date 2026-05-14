import { twMerge } from "tailwind-merge";

export function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={twMerge("inline-flex items-center rounded-full bg-lagoon/10 px-3 py-1 text-xs font-semibold text-reef", className)}>
      {children}
    </span>
  );
}
