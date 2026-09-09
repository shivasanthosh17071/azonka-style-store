import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Facebook,
  Heart,
  Instagram,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import heroImage from "@/assets/hero-sale.jpg";
import bannerImage from "@/assets/brand-banner.jpg";
import charcoalImage from "@/assets/product-charcoal.jpg";
import ivoryImage from "@/assets/product-ivory.jpg";
import sageImage from "@/assets/product-sage.jpg";
import brickImage from "@/assets/product-brick.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "STAPLE/01 — Everyday, considered" },
      { name: "description", content: "Elevated everyday t-shirts, designed in India and made for repeat wear." },
      { property: "og:title", content: "STAPLE/01 — Everyday, considered" },
      { property: "og:description", content: "Elevated everyday t-shirts, designed in India and made for repeat wear." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  mrp: number;
  image: string;
  tone: string;
};

const products: Product[] = [
  { id: 1, name: "Heavyweight Essential Tee", category: "Core collection", price: 899, mrp: 1499, image: charcoalImage, tone: "Charcoal" },
  { id: 2, name: "The Everyday Tee", category: "Core collection", price: 699, mrp: 1199, image: ivoryImage, tone: "Ivory" },
  { id: 3, name: "Relaxed Fit Tee", category: "New arrival", price: 799, mrp: 1299, image: sageImage, tone: "Sage" },
  { id: 4, name: "Studio Rib Tee", category: "Limited drop", price: 899, mrp: 1499, image: brickImage, tone: "Brick" },
];

const categories = [
  { label: "Heavyweight", note: "Built to last", image: charcoalImage },
  { label: "Everyday", note: "Your daily uniform", image: ivoryImage },
  { label: "Relaxed", note: "Room to breathe", image: sageImage },
  { label: "Limited drops", note: "Small batch only", image: brickImage },
];

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-brick">{eyebrow}</p>
      <h2 className="font-display text-4xl font-semibold leading-none text-ink sm:text-5xl">{title}</h2>
      <p className="mt-4 text-sm leading-6 text-ink-soft">{copy}</p>
    </div>
  );
}

function ProductCard({ product, onAdd, onWishlist, wished }: { product: Product; onAdd: (product: Product) => void; onWishlist: (id: number) => void; wished: boolean }) {
  return (
    <article className="group min-w-0">
      <div className="relative overflow-hidden bg-sand">
        <img src={product.image} alt={`${product.name} in ${product.tone}`} loading="lazy" width={900} height={900} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        <span className="absolute left-3 top-3 bg-brick px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-primary-foreground">Sale</span>
        <Button variant="ghost" size="icon" aria-label={`Add ${product.name} to wishlist`} onClick={() => onWishlist(product.id)} className="absolute right-2 top-2 bg-background/85 text-ink hover:bg-background hover:text-brick">
          <Heart className={`size-4 ${wished ? "fill-brick text-brick" : ""}`} />
        </Button>
      </div>
      <div className="pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">{product.category}</p>
        <h3 className="mt-1.5 text-sm font-semibold text-ink">{product.name}</h3>
        <div className="mt-2 flex items-center gap-2 text-[11px]">
          <span className="text-brick">★★★★★</span><span className="text-ink-soft">(120)</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-brick">₹{product.price}</span>
          <span className="text-xs text-ink-soft line-through">₹{product.mrp}</span>
          <span className="text-[10px] font-bold uppercase tracking-wide text-brick">40% off</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5" aria-label="Available sizes">
          {['S', 'M', 'L', 'XL'].map((size) => <span key={size} className={`grid size-6 place-items-center border text-[10px] font-medium ${size === 'XL' && product.id === 3 ? 'border-line text-ink-soft/40' : 'border-line text-ink-soft'}`}>{size}</span>)}
        </div>
        <Button onClick={() => onAdd(product)} className="mt-4 h-10 w-full rounded-none bg-ink text-[11px] font-bold uppercase tracking-[0.14em] text-primary-foreground hover:bg-brick">Add to cart</Button>
      </div>
    </article>
  );
}

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlisted, setWishlisted] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("All pieces");
  const [heroSlide, setHeroSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = window.setInterval(() => setHeroSlide((slide) => (slide + 1) % 2), 6500);
    return () => { window.removeEventListener("scroll", onScroll); window.clearInterval(timer); };
  }, []);

  const addToCart = (product: Product) => { setCart((items) => [...items, product]); setCartOpen(true); };
  const removeFromCart = (index: number) => setCart((items) => items.filter((_, itemIndex) => itemIndex !== index));
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart]);
  const tabs = ["All pieces", "Heavyweight", "Everyday", "Limited drops"];
  const filteredProducts = activeTab === "All pieces" ? products : products.filter((product) => product.category.toLowerCase().includes(activeTab.toLowerCase().replace(" pieces", "")) || product.name.toLowerCase().includes(activeTab.toLowerCase().replace(" pieces", "")));

  return (
    <div className="min-h-screen bg-background pb-16 text-ink sm:pb-0">
      <div className="flex min-h-8 items-center justify-between bg-ink px-4 text-[10px] font-medium uppercase tracking-[0.18em] text-primary-foreground sm:px-8">
        <div className="hidden items-center gap-3 sm:flex"><Facebook className="size-3" /><Instagram className="size-3" /><span>Designed in India</span></div>
        <span className="mx-auto sm:mx-0">Free shipping on orders over ₹999</span>
        <div className="hidden items-center gap-3 sm:flex"><span>My account</span><span className="opacity-40">|</span><span>Track order</span></div>
      </div>

      <header className={`sticky top-0 z-40 border-b border-brick bg-background/95 backdrop-blur transition-shadow ${scrolled ? "shadow-sm" : ""}`}>
        <div className="section-wrap flex h-[70px] items-center justify-between gap-4 sm:h-[82px] sm:justify-center">
          <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu className="size-5" /></Button>
          <a href="#top" className="font-display text-[31px] font-bold leading-none tracking-[-0.04em] text-ink">STAPLE<span className="text-brick">/01</span></a>
          <div className="flex items-center gap-0 sm:absolute sm:right-8">
            <Button variant="ghost" size="icon" aria-label="Search"><Search className="size-[18px]" /></Button>
            <Button variant="ghost" size="icon" aria-label="Account" className="hidden sm:inline-flex"><CircleUserRound className="size-[18px]" /></Button>
            <Button variant="ghost" size="icon" aria-label="Open cart" onClick={() => setCartOpen(true)} className="relative"><ShoppingBag className="size-[18px]" />{cart.length > 0 && <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-brick text-[9px] text-primary-foreground">{cart.length}</span>}</Button>
          </div>
        </div>
        <nav className="hidden h-11 items-center justify-center gap-8 text-[11px] font-bold uppercase tracking-[0.15em] sm:flex">
          {['Home', 'Shop', 'New arrivals', 'Best sellers', 'About', 'Contact'].map((item) => <a key={item} href={item === 'Home' ? '#top' : `#${item.toLowerCase().replace(' ', '-')}`} className="transition-colors hover:text-brick">{item}</a>)}
        </nav>
      </header>

      {menuOpen && <div className="fixed inset-0 z-50 bg-ink/40 sm:hidden" onClick={() => setMenuOpen(false)}>
        <aside className="h-full w-[82%] bg-background p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-line pb-6"><span className="font-display text-3xl font-bold">STAPLE<span className="text-brick">/01</span></span><Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X /></Button></div>
          <nav className="mt-8 grid gap-6 text-sm font-bold uppercase tracking-[0.16em]">{['Home', 'Shop', 'New arrivals', 'Best sellers', 'About', 'Contact'].map((item) => <a key={item} href={item === 'Home' ? '#top' : `#${item.toLowerCase().replace(' ', '-')}`} onClick={() => setMenuOpen(false)}>{item}</a>)}</nav>
          <div className="mt-12 border-t border-line pt-6 text-sm text-ink-soft"><p className="font-semibold text-ink">Questions?</p><p className="mt-2">hello@staple01.in</p><p>+91 98765 43210</p></div>
        </aside>
      </div>}

      <main id="top">
        <section className="relative overflow-hidden bg-ink">
          <img src={heroImage} alt="Model wearing the STAPLE/01 everyday tee" width={1600} height={900} className="h-[520px] w-full object-cover object-[62%_center] sm:h-[610px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />
          <div className="absolute inset-0 section-wrap flex items-center">
            <div className="max-w-[270px] text-primary-foreground sm:max-w-md">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-primary-foreground/80">The everyday edit · 02 / 02</p>
              <h1 className="font-display text-6xl font-semibold leading-[0.85] sm:text-8xl">Good<br />things<br /><em className="font-normal text-brick">repeat.</em></h1>
              <p className="mt-6 max-w-xs text-sm leading-6 text-primary-foreground/80">Premium essentials with an uncomplicated point of view. Made for the plans you make every day.</p>
              <Button asChild className="mt-7 h-12 rounded-none bg-brick px-7 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-foreground hover:bg-brick-dark"><a href="#featured">Shop the edit <ArrowRight className="size-4" /></a></Button>
            </div>
          </div>
          <div className="absolute bottom-7 right-6 flex items-center gap-2 sm:right-10">{[0, 1].map((dot) => <button key={dot} aria-label={`Go to slide ${dot + 1}`} onClick={() => setHeroSlide(dot)} className={`h-1 transition-all ${heroSlide === dot ? "w-10 bg-primary-foreground" : "w-3 bg-primary-foreground/50"}`} />)}</div>
          <div className="absolute right-7 top-7 grid size-[90px] rotate-12 place-items-center rounded-full border border-primary-foreground/70 bg-brick text-center text-[10px] font-bold uppercase leading-3 tracking-[0.12em] text-primary-foreground sm:right-12 sm:top-10 sm:size-[116px]">Up to<br /><strong className="text-2xl leading-none">50%</strong><br />off</div>
        </section>

        <section className="border-b border-line bg-paper py-14 sm:py-20">
          <div className="section-wrap"><SectionHeading eyebrow="Find your fit" title="Shop by mood" copy="Four considered fits. Nothing extra. Find the shape that feels like you, then make it yours." />
            <div className="no-scrollbar mt-10 flex snap-x gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-4">
              {categories.map((category) => <a href="#featured" key={category.label} className="group min-w-[72%] snap-start sm:min-w-0"><div className="overflow-hidden bg-sand"><img src={category.image} alt={category.label} loading="lazy" width={900} height={900} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" /></div><div className="flex items-end justify-between pt-3"><div><h3 className="text-[11px] font-bold uppercase tracking-[0.16em]">{category.label}</h3><p className="mt-1 text-xs text-ink-soft">{category.note}</p></div><ArrowRight className="size-4 text-brick" /></div></a>)}
            </div>
          </div>
        </section>

        <section id="featured" className="section-wrap scroll-mt-28 py-16 sm:py-24">
          <SectionHeading eyebrow="The good stuff" title="Featured pieces" copy="The ones you reach for first. Thoughtful weight, easy shapes, and colours that live well together." />
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:mt-14 sm:grid-cols-4 sm:gap-x-6">{products.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} onWishlist={(id) => setWishlisted((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])} wished={wishlisted.includes(product.id)} />)}</div>
        </section>

        <section className="relative overflow-hidden bg-ink">
          <img src={bannerImage} alt="STAPLE/01 campaign with relaxed fit tees" loading="lazy" width={1600} height={650} className="h-[390px] w-full object-cover opacity-70 sm:h-[500px]" />
          <div className="absolute inset-0 grid place-items-center bg-ink/25 text-center"><p className="font-display text-7xl font-semibold tracking-[-0.05em] text-primary-foreground sm:text-[10rem]">STAPLE<span className="text-brick">/01</span></p></div>
        </section>

        <section id="best-sellers" className="bg-paper py-16 sm:py-24">
          <div className="section-wrap"><SectionHeading eyebrow="The edit" title="Best sellers" copy="Proven favourites, worn on repeat. Start here if you’re new around here." />
            <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1 sm:justify-center">{tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 border px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${activeTab === tab ? "border-brick bg-brick text-primary-foreground" : "border-brick text-brick hover:bg-brick/10"}`}>{tab}</button>)}</div>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 sm:gap-x-6">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} onWishlist={(id) => setWishlisted((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])} wished={wishlisted.includes(product.id)} />)}</div>
            <div className="mt-12 text-center"><a href="#featured" className="inline-flex items-center gap-2 border-b border-brick pb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brick">View all pieces <ArrowRight className="size-4" /></a></div>
          </div>
        </section>

        <section className="bg-ink py-14 text-primary-foreground sm:py-20">
          <div className="section-wrap grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-y-0">
            {[{ icon: Truck, title: "Free shipping", copy: "On orders over ₹999" }, { icon: ShieldCheck, title: "Best quality", copy: "Premium cotton, always" }, { icon: Sparkles, title: "Fair pricing", copy: "Good things, honestly priced" }, { icon: PackageCheck, title: "Easy support", copy: "Here when you need us" }].map(({ icon: Icon, title, copy }) => <div key={title} className="text-center"><div className="mx-auto grid size-11 place-items-center rounded-full border border-brick text-brick"><Icon className="size-5" /></div><h3 className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em]">{title}</h3><p className="mt-1 text-xs text-primary-foreground/55">{copy}</p></div>)}
          </div>
        </section>

        <section className="border-b border-line bg-sand py-16 sm:py-24"><div className="section-wrap"><SectionHeading eyebrow="From the people" title="Worn & loved" copy="“The kind of t-shirt you buy once, then slowly build your whole week around.”" /><div className="mt-10 grid gap-4 sm:grid-cols-3"><figure className="bg-background p-6 sm:p-8"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-full bg-brick text-sm font-bold text-primary-foreground">A</div><figcaption><p className="text-sm font-bold">Aarav M.</p><p className="text-xs text-ink-soft">Verified buyer</p></figcaption></div><blockquote className="mt-6 text-sm italic leading-6 text-ink-soft">“The weight is perfect and the fit is exactly as pictured. Already eyeing the sage one.”</blockquote></figure><figure className="hidden bg-background p-6 sm:block sm:p-8"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-full bg-ink text-sm font-bold text-primary-foreground">R</div><figcaption><p className="text-sm font-bold">Rhea K.</p><p className="text-xs text-ink-soft">Verified buyer</p></figcaption></div><blockquote className="mt-6 text-sm italic leading-6 text-ink-soft">“Finally, a basic that feels considered. Soft, structured, and the colour is gorgeous.”</blockquote></figure><figure className="hidden bg-background p-6 sm:block sm:p-8"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-full bg-brick text-sm font-bold text-primary-foreground">N</div><figcaption><p className="text-sm font-bold">Nikhil S.</p><p className="text-xs text-ink-soft">Verified buyer</p></figcaption></div><blockquote className="mt-6 text-sm italic leading-6 text-ink-soft">“Good fabric, fast delivery, no fuss. This is the everyday tee I was looking for.”</blockquote></figure></div></div></section>
      </main>

      <footer className="bg-ink py-14 text-primary-foreground sm:py-16"><div className="section-wrap"><div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr_1fr]"><div><p className="font-display text-4xl font-bold">STAPLE<span className="text-brick">/01</span></p><p className="mt-4 max-w-xs text-sm leading-6 text-primary-foreground/60">Everyday essentials, considered from the first stitch to the last wear.</p><div className="mt-6 flex gap-3"><Instagram className="size-4 text-primary-foreground/70" /><Facebook className="size-4 text-primary-foreground/70" /><span className="text-xs font-bold tracking-[0.12em] text-primary-foreground/70">@STAPLE01</span></div></div><div><h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brick">Explore</h3><div className="mt-5 grid gap-3 text-sm text-primary-foreground/65"><a href="#featured">Shop all</a><a href="#best-sellers">Best sellers</a><a href="#top">Our story</a><a href="#top">Contact</a></div></div><div><h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brick">Help</h3><div className="mt-5 grid gap-3 text-sm text-primary-foreground/65"><a href="#top">Shipping & returns</a><a href="#top">Size guide</a><a href="#top">FAQs</a><a href="#top">Track order</a></div></div><div><h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brick">Say hello</h3><div className="mt-5 grid gap-3 text-sm text-primary-foreground/65"><a href="mailto:hello@staple01.in">hello@staple01.in</a><a href="tel:+919876543210">+91 98765 43210</a><p>Mon — Sat, 10am — 6pm</p></div></div></div><div className="mt-12 border-t border-primary-foreground/10 pt-6 text-center text-[10px] uppercase tracking-[0.17em] text-primary-foreground/40">© 2026 STAPLE/01 · Made for repeat wear</div></div></footer>

      <a href="https://wa.me/919876543210" aria-label="Chat on WhatsApp" className="fixed bottom-[76px] right-4 z-30 grid size-12 place-items-center rounded-full bg-brick text-primary-foreground shadow-lg transition-transform hover:scale-105 sm:bottom-5 sm:right-5"><span className="text-lg font-bold">⌁</span></a>
      <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 border-t border-line bg-background/95 py-2 backdrop-blur sm:hidden"><a href="#top" className="grid justify-items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-brick"><Sparkles className="size-4" />Home</a><a href="#featured" className="grid justify-items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-ink-soft"><Search className="size-4" />Shop</a><button onClick={() => setWishlisted([])} className="grid justify-items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-ink-soft"><Heart className="size-4" />Wishlist</button><button onClick={() => setCartOpen(true)} className="relative grid justify-items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-ink-soft"><ShoppingBag className="size-4" />Cart{cart.length > 0 && <span className="absolute left-1/2 top-[-2px] ml-1 grid size-3 place-items-center rounded-full bg-brick text-[8px] text-primary-foreground">{cart.length}</span>}</button><button className="grid justify-items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-ink-soft"><CircleUserRound className="size-4" />Account</button></nav>

      {cartOpen && <div className="fixed inset-0 z-50 bg-ink/40" onClick={() => setCartOpen(false)}><aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between border-b border-line pb-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brick">Your bag</p><h2 className="mt-1 font-display text-3xl font-semibold">{cart.length} {cart.length === 1 ? 'piece' : 'pieces'}</h2></div><Button variant="ghost" size="icon" aria-label="Close cart" onClick={() => setCartOpen(false)}><X /></Button></div>{cart.length === 0 ? <div className="flex flex-1 flex-col items-center justify-center text-center"><ShoppingBag className="size-10 text-brick" /><p className="mt-5 font-display text-3xl">A little empty.</p><p className="mt-2 text-sm text-ink-soft">Good things are waiting for you.</p><Button onClick={() => setCartOpen(false)} className="mt-6 rounded-none bg-ink text-xs uppercase tracking-[0.15em]">Keep shopping</Button></div> : <><div className="no-scrollbar flex-1 overflow-y-auto py-6">{cart.map((item, index) => <div key={`${item.id}-${index}`} className="flex gap-4 border-b border-line py-4 first:pt-0"><img src={item.image} alt={item.name} className="size-20 object-cover" /><div className="min-w-0 flex-1"><p className="text-xs font-bold">{item.name}</p><p className="mt-1 text-xs text-ink-soft">{item.tone} · One size selected</p><div className="mt-3 flex items-center justify-between"><span className="font-bold text-brick">₹{item.price}</span><Button variant="ghost" size="sm" onClick={() => removeFromCart(index)} className="h-7 px-2 text-xs text-ink-soft">Remove</Button></div></div></div>)}</div><div className="border-t border-line pt-5"><div className="flex justify-between text-sm"><span>Subtotal</span><strong>₹{total}</strong></div><p className="mt-2 text-xs text-ink-soft">Shipping calculated at checkout. Free over ₹999.</p><Button className="mt-5 h-12 w-full rounded-none bg-brick text-xs uppercase tracking-[0.16em] hover:bg-brick-dark">Checkout <ArrowRight className="size-4" /></Button></div></>}</aside></div>}
    </div>
  );
}