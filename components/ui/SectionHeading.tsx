export function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="mx-auto mb-7 max-w-3xl text-center">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-hibiscus">{eyebrow}</p>
      <h2 className="font-display text-3xl font-semibold text-ink sm:text-5xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-ink/70">{text}</p>
    </div>
  );
}
