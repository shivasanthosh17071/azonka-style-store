import { useParams } from "react-router-dom";
import { SectionHeading } from "@/components/common/SectionHeading";
import { POLICIES } from "@/content/policies";

export function PolicyPage() {
  const { policySlug } = useParams();
  const policy = policySlug ? POLICIES[policySlug] : undefined;

  if (!policy) {
    return <div className="section-wrap py-16 text-center text-sm text-ink-soft">Policy not found.</div>;
  }

  return (
    <div className="section-wrap max-w-2xl py-12 sm:py-16">
      <SectionHeading eyebrow="Good to know" title={policy.title} copy="" />
      <div className="mt-8 space-y-4 text-sm leading-6 text-ink-soft">
        {policy.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </div>
  );
}
