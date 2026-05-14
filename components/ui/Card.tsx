import { twMerge } from "tailwind-merge";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={twMerge("rounded-[28px] bg-white/85 shadow-soft ring-1 ring-white/70", className)}>{children}</div>;
}
