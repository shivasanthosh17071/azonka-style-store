import { SectionHeading } from "@/components/common/SectionHeading";
import bannerImage from "@/assets/brand-banner.jpg";

export function AboutPage() {
  return (
    <div>
      <div className="relative overflow-hidden bg-ink">
        <img src={bannerImage} alt="STAPLE/01 studio" className="h-[280px] w-full object-cover opacity-70 sm:h-[380px]" />
        <div className="absolute inset-0 grid place-items-center bg-ink/25 text-center">
          <p className="font-display text-6xl font-semibold text-primary-foreground sm:text-8xl">Our story</p>
        </div>
      </div>
      <div className="section-wrap max-w-2xl py-12 sm:py-16">
        <SectionHeading eyebrow="Since day one" title="Everyday, considered" copy="" />
        <div className="mt-8 space-y-4 text-sm leading-6 text-ink-soft">
          <p>
            STAPLE/01 started with a simple frustration: most "basic" t-shirts weren't basic at all — thin fabric, boxy
            fits, colours that faded after two washes. We set out to build the tee we actually wanted to wear on repeat.
          </p>
          <p>
            Every piece is made from heavyweight cotton, cut in considered fits, and tested for the wash-and-wear
            realities of everyday life. No seasonal gimmicks — just a small, tightly edited range we keep improving.
          </p>
          <p>Designed in India, worn everywhere. Thank you for being part of the story.</p>
        </div>
      </div>
    </div>
  );
}
