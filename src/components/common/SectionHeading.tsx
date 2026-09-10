export function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-brick">{eyebrow}</p>
      <h2 className="font-display text-4xl font-semibold leading-none text-ink sm:text-5xl">{title}</h2>
      {copy && <p className="mt-4 text-sm leading-6 text-ink-soft">{copy}</p>}
    </div>
  );
}
