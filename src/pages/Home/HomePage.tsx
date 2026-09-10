import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, PackageCheck, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProductCard } from "@/components/common/ProductCard";
import { PillTabs } from "@/components/common/PillTabs";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { useProducts, useCategories } from "@/hooks/queries/useProducts";
import type { Category } from "@/types";
import bannerImage from "@/assets/brand-banner.jpg";
import heroImage1 from "@/assets/homePage/image1.png";
import heroImage2 from "@/assets/homePage/image2.png";

const HERO_SLIDES = [
  {
    eyebrow: "The everyday edit · 01 / 02",
    title: "Good\nthings\nrepeat.",
    copy: "Premium essentials with an uncomplicated point of view. Made for the plans you make every day.",
    image: heroImage1,
  },
  {
    eyebrow: "The everyday edit · 02 / 02",
    title: "Wear it\nout.\nWear it\nagain.",
    copy: "Heavyweight cotton, considered fits, and colours that live well together.",
    image: heroImage2,
  },
];

function flattenLeafCategories(categories: Category[]): Category[] {
  return categories.flatMap((c) =>
    c.children && c.children.length ? flattenLeafCategories(c.children) : [c],
  );
}

export function HomePage() {
  const [heroSlide, setHeroSlide] = useState(0);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setHeroSlide((s) => (s + 1) % HERO_SLIDES.length), 6500);
    return () => window.clearInterval(timer);
  }, []);

  const { data: categoryTree } = useCategories();
  const leafCategories = useMemo(
    () => (categoryTree ? flattenLeafCategories(categoryTree) : []),
    [categoryTree],
  );

  useEffect(() => {
    if (!activeCategorySlug && leafCategories.length) setActiveCategorySlug(leafCategories[0].slug);
  }, [leafCategories, activeCategorySlug]);

  const { data: featured, isLoading: featuredLoading } = useProducts({
    isFeatured: true,
    limit: 8,
  });
  const { data: bestsellers, isLoading: bestsellersLoading } = useProducts({
    isBestseller: true,
    limit: 8,
  });
  const { data: byCategory, isLoading: byCategoryLoading } = useProducts(
    { category: activeCategorySlug ?? undefined, limit: 8 },
    Boolean(activeCategorySlug),
  );

  const slide = HERO_SLIDES[heroSlide];

  return (
    <>
      <section className="relative overflow-hidden bg-ink">
        <img
          key={slide.image}
          src={slide.image}
          alt="Model wearing the RAGYAI_m everyday tee"
          width={1600}
          height={900}
          className="h-[520px] w-full object-cover object-[62%_center] sm:h-[610px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />
        <div className="absolute inset-0 section-wrap flex items-center">
          <div className="max-w-[270px] text-primary-foreground sm:max-w-md">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-primary-foreground/80">
              {slide.eyebrow}
            </p>
            <h1 className="whitespace-pre-line font-display text-6xl font-semibold leading-[0.85] sm:text-8xl">
              {slide.title.split("\n").map((line, i, arr) =>
                i === arr.length - 1 ? (
                  <em key={i} className="font-normal not-italic text-brick">
                    {line}
                  </em>
                ) : (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ),
              )}
            </h1>
            <p className="mt-6 max-w-xs text-sm leading-6 text-primary-foreground/80">
              {slide.copy}
            </p>
            <Button
              asChild
              className="mt-7 h-12 rounded-none bg-brick px-7 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-foreground hover:bg-brick-dark"
            >
              <Link to="/shop">
                Shop the edit <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-7 right-6 flex items-center gap-2 sm:right-10">
          {HERO_SLIDES.map((_, dot) => (
            <button
              key={dot}
              aria-label={`Go to slide ${dot + 1}`}
              onClick={() => setHeroSlide(dot)}
              className={`h-1 transition-all ${heroSlide === dot ? "w-10 bg-primary-foreground" : "w-3 bg-primary-foreground/50"}`}
            />
          ))}
        </div>
        <div className="absolute right-7 top-7 grid size-[90px] rotate-12 place-items-center rounded-full border border-primary-foreground/70 bg-brick text-center text-[10px] font-bold uppercase leading-3 tracking-[0.12em] text-primary-foreground sm:right-12 sm:top-10 sm:size-[116px]">
          Up to
          <br />
          <strong className="text-2xl leading-none">50%</strong>
          <br />
          off
        </div>
      </section>

      <section className="border-b border-line bg-paper py-14 sm:py-20">
        <div className="section-wrap">
          <SectionHeading
            eyebrow="Find your fit"
            title="Our categories"
            copy="Considered fits, nothing extra. Find the shape that feels like you, then make it yours."
          />
          <div className="no-scrollbar mt-10 flex snap-x gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-4">
            {leafCategories.map((category) => (
              <Link
                to={`/shop/${category.slug}`}
                key={category._id}
                className="group min-w-[72%] snap-start sm:min-w-0"
              >
                <div className="overflow-hidden bg-sand">
                  <img
                    src={category.image?.url || HERO_SLIDES[0].image}
                    alt={category.name}
                    loading="lazy"
                    width={900}
                    height={900}
                    className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-end justify-between pt-3">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.16em]">
                    {category.name}
                  </h3>
                  <ArrowRight className="size-4 text-brick" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="featured" className="section-wrap scroll-mt-28 py-16 sm:py-24">
        <SectionHeading
          eyebrow="The good stuff"
          title="Featured pieces"
          copy="The ones you reach for first. Thoughtful weight, easy shapes, and colours that live well together."
        />
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:mt-14 sm:grid-cols-4 sm:gap-x-6">
          {featuredLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : featured?.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink">
        <img
          src={bannerImage}
          alt="RAGYAI_m campaign with relaxed fit tees"
          loading="lazy"
          width={1600}
          height={650}
          className="h-[390px] w-full object-cover opacity-70 sm:h-[500px]"
        />
        <div className="absolute inset-0 grid place-items-center bg-ink/25 text-center">
          <p className="font-display text-7xl font-semibold tracking-[-0.05em] text-primary-foreground sm:text-[10rem]">
            RAGYAI<span className="text-brick">_m</span>
          </p>
        </div>
      </section>

      {leafCategories.length > 0 && (
        <section className="bg-paper py-16 sm:py-24">
          <div className="section-wrap">
            <SectionHeading
              eyebrow="Shop by fit"
              title="Our best categories"
              copy="Jump straight into the fit you're after."
            />
            <div className="mt-8">
              <PillTabs
                tabs={leafCategories.map((c) => c.name)}
                active={leafCategories.find((c) => c.slug === activeCategorySlug)?.name || ""}
                onChange={(name) =>
                  setActiveCategorySlug(leafCategories.find((c) => c.name === name)?.slug || null)
                }
              />
            </div>
            <div className="no-scrollbar mt-10 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-4">
              {byCategoryLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="min-w-[45%] sm:min-w-0">
                      <SkeletonCard />
                    </div>
                  ))
                : byCategory?.products.map((product) => (
                    <div key={product._id} className="min-w-[45%] sm:min-w-0">
                      <ProductCard product={product} />
                    </div>
                  ))}
            </div>
          </div>
        </section>
      )}

      <section id="best-sellers" className="bg-paper py-16 sm:py-24">
        <div className="section-wrap">
          <SectionHeading
            eyebrow="The edit"
            title="Our bestsellers"
            copy="Proven favourites, worn on repeat. Start here if you're new around here."
          />
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 sm:gap-x-6">
            {bestsellersLoading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : bestsellers?.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/shop?isBestseller=true"
              className="inline-flex items-center gap-2 border-b border-brick pb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brick"
            >
              View all pieces <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-sand py-16 sm:py-24">
        <div className="section-wrap">
          <SectionHeading
            eyebrow="From the people"
            title="Customer reviews"
            copy="“The kind of t-shirt you buy once, then slowly build your whole week around.”"
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                initial: "A",
                name: "Aarav M.",
                quote:
                  "The weight is perfect and the fit is exactly as pictured. Already eyeing the sage one.",
                bg: "bg-brick",
              },
              {
                initial: "R",
                name: "Rhea K.",
                quote:
                  "Finally, a basic that feels considered. Soft, structured, and the colour is gorgeous.",
                bg: "bg-ink",
              },
              {
                initial: "N",
                name: "Nikhil S.",
                quote:
                  "Good fabric, fast delivery, no fuss. This is the everyday tee I was looking for.",
                bg: "bg-brick",
              },
            ].map((t, i) => (
              <figure
                key={t.name}
                className={`bg-background p-6 sm:p-8 ${i > 0 ? "hidden sm:block" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`grid size-10 place-items-center rounded-full ${t.bg} text-sm font-bold text-primary-foreground`}
                  >
                    {t.initial}
                  </div>
                  <figcaption>
                    <p className="text-sm font-bold">{t.name}</p>
                    <p className="text-xs text-ink-soft">Verified buyer</p>
                  </figcaption>
                </div>
                <blockquote className="mt-6 text-sm italic leading-6 text-ink-soft">
                  “{t.quote}”
                </blockquote>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-14 text-primary-foreground sm:py-20">
        <div className="section-wrap grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-y-0">
          {[
            { icon: Truck, title: "Free shipping", copy: "On orders over ₹999" },
            { icon: ShieldCheck, title: "Best quality", copy: "Premium cotton, always" },
            { icon: Sparkles, title: "Fair pricing", copy: "Good things, honestly priced" },
            { icon: PackageCheck, title: "24/7 support", copy: "Here when you need us" },
          ].map(({ icon: Icon, title, copy }) => (
            <div key={title} className="text-center">
              <div className="mx-auto grid size-11 place-items-center rounded-full border border-brick text-brick">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em]">{title}</h3>
              <p className="mt-1 text-xs text-primary-foreground/55">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
