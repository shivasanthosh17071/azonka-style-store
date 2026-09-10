export function PillTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 sm:justify-center">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`shrink-0 border px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${
            active === tab ? "border-brick bg-brick text-primary-foreground" : "border-brick text-brick hover:bg-brick/10"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
