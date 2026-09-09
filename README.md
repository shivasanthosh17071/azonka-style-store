# Azonka Style Store

https://azonka.com/ - regerance for ui


Frontend Build Prompt (v2) — for Lovable

Faithful to azonka.com's UI + theme, with targeted improvements only

Copy everything below into Lovable as your project prompt.

Project

Build "[BRAND NAME]" — a mobile-first T-shirt/fashion e-commerce storefront in React + Vite + Tailwind CSS. No Next.js, no Bootstrap, no UI kit.

This must look and feel like azonka.com — same color theme, same section order, same visual tone (warm, sale-driven, editorial fashion photography). Do not invent a different design direction. Replicate the theme below exactly, then apply only the specific improvements listed at the end of each section.

Exact theme (extracted from azonka.com — use these, don't guess)

Colors

Primary/accent (sale tags, price, active buttons, CTA underlines): warm brick-red — #B7282E / #C0392B range

Secondary dark (buttons, footer, brand banner bg): near-black — #1A1A1A

Background: white #FFFFFF, with occasional warm off-white #F8F5F0 section backgrounds for contrast between sections

Body text: near-black #1F1F1F; muted text (descriptions under headings): grey #6B6B6B

Sale ribbon: solid red badge, white uppercase text

Discount price: red/brick, bold; strikethrough MRP: grey, regular weight, smaller

Typography

Brand wordmark/logo: a serif or scripty display face (Azonka uses an elegant serif-style logo) — use a Google Font like "Playfair Display" or "Cormorant" for the logo/brand name only

Section headings ("OUR CATEGORIES", "FEATURED PRODUCTS", etc.): bold sans-serif, uppercase, letter-spaced (tracking-wide), centered, medium size

Section sub-description under headings: regular weight, grey, centered, max-width constrained (like a 1–2 line intro paragraph), smaller size

Body/product text: clean sans-serif (Inter, Poppins, or similar), normal case

Product card price: bold, larger than title

Structural/visual patterns to replicate

Thin horizontal rule/divider under the header, in the accent color

Circular "50% OFF" starburst/badge overlapping the hero banner image (top-right corner of hero)

Product cards: white bg, no visible border, subtle shadow only on hover, image fills card top, red "Sale" ribbon pinned top-left corner of image, heart/wishlist icon top-right corner of image, category tags as small grey text above product name, product name in black, price row below (strikethrough MRP + red current price), full-width button below ("Select Options" for variant products / "Add to Cart" for simple products) — exact same card anatomy as Azonka, this is critical to match

Pill-style tabs (Men/Women/Kids-equivalent) — active tab = solid red bg + white text, inactive = white bg + red or black outline + black text

Testimonial cards: light-grey section background, circular avatar placeholder icon, italic quote text, bold name credit below, centered, carousel/slider on mobile

Trust badge row: 4 items, red circular icon + bold uppercase label underneath, 2×2 grid mobile / 4-in-row desktop

Footer: solid near-black background, white/light-grey text, 4-column layout (About / Quick Links / Policies / Contact), social icons row, payment method icons row at very bottom, centered copyright line

Global layout rules

Mobile-first: build every section for 375–430px viewport first, then scale up with Tailwind breakpoints. Assume most traffic is from Instagram on mobile.

Sticky header that compacts on scroll.

Every tap target has a visible active/pressed state on mobile.

Lazy-load all below-the-fold images (loading="lazy").

Exact page structure (match Azonka's real section order — do not reorder or skip sections)

1. Top utility bar

Thin black bar, full width: social icons (Facebook/X/LinkedIn/Instagram) left, "My Account" / login link + search icon + wishlist icon + cart icon (with item count) right. Collapses to just essential icons on mobile.

2. Header

Centered logo (serif brand wordmark) with a red accent underline/divider beneath the whole header. Horizontal nav below logo on desktop (Home / Women / Men / Kids / Jewellery-or-Accessories / Contact — adapt categories to actual product line, which for this brand is primarily T-Shirts, so use: Home / Shop / New Arrivals / Best Sellers / About / Contact). On mobile: hamburger menu icon opens a left-side slide-in drawer with accordion category submenus.

3. Hero banner

Full-width promotional banner with warm/terracotta-toned background image, bold sale headline (e.g. "SEASON SALE — 50% OFF"), large percentage-off text treatment, "LIMITED TIME ONLY" tracking-wide subtitle, one CTA button ("Shop Now"), and the circular red starburst badge overlapping the image corner. Auto-rotating carousel (2–3 slides), swipeable on mobile, dot indicators at bottom.

4. "Our Categories" section

Centered uppercase heading + 2-line grey description below it (same copy pattern: "Explore our diverse categories... carefully curated to match every lifestyle and style preference" — reword for a T-shirt-only brand, e.g. featuring fits/styles instead of Men/Women/Kids). Grid of category image-cards below: square product photography, category name in small letter-spaced caps underneath, no card border, just image + label. Horizontally scrollable on mobile, grid on desktop.

5. "Featured Products" section

Centered heading + grey description ("Discover our handpicked featured products showcasing the latest trends, premium quality, and everyday essentials..."). Product grid: 2 columns mobile, 4 columns desktop, using the exact card anatomy specified in the theme section above (sale ribbon, wishlist heart, category tag, name, strikethrough MRP + red price, full-width button).

6. Brand banner

Full-width dark editorial image (a collage of styled fashion photography) with the brand wordmark rendered large and centered over it, in outline or bold display type — this is a pure brand-building section, no products or CTAs, just visual identity.

7. "Our Best Categories" — tabbed carousel

Pill-style filter tabs above a horizontally-scrollable sub-category carousel (arrows on desktop, swipe on mobile). Tabs use the active/inactive pill styling from the theme section above.

8. "Our Bestsellers" section

Same heading+description+grid pattern as Featured Products, different product set, with a "View All" link at the end.

9. "Our Latest News" — blog section

Centered heading + description. 3 blog cards (image, small date badge top-left like "08 JAN", category tag, title, byline, 2-line excerpt, "Continue Reading" link). Horizontal scroll on mobile, 3-column grid on desktop. (Optional section — keep only if the client plans to publish style/blog content; otherwise omit cleanly, don't leave a placeholder gap.)

10. "Customers Reviews" — testimonial carousel

Light-grey background section, centered heading, carousel of quote cards (circular avatar icon, italic quote, bold name) — 1 visible on mobile with a peek of the next card, 3 visible on desktop, auto-scroll + swipe.

11. Trust badges strip

4 items in a row (2×2 mobile): Free Shipping / Best Quality / Best Price / 24/7 Support — red circular icon above bold uppercase label, no supporting text needed (match Azonka's minimal treatment exactly).

12. Footer

Solid near-black background. 4 columns (stack to accordion on mobile):

About — short brand blurb (2–3 lines)

Quick Links — Home, About Us, Shop, Contact, FAQs, Track Orders

Policies — Privacy Policy, Shipping Policy, Cancellation Policy, Terms & Conditions, Refund & Returns Policy

Contact — phone, email, physical address (if applicable), social icons row

Payment method icons row (Visa/Mastercard/UPI/etc.) centered below the columns, then a centered copyright line at the very bottom.

Deliberate improvements over Azonka (small, targeted — don't over-design beyond these)

Star ratings on product cards — Azonka shows none; add a static "★★★★☆ (120)" placeholder row under the product name, wired to real review data later.

Size availability chips directly on the product card grid (S/M/L/XL, greyed if unavailable) — reduces dead clicks into out-of-stock products.

Slide-in cart drawer instead of full navigation — Azonka's WooCommerce cart reloads the page; here "Add to Cart" should open an instant right-side drawer with the updated cart, no page reload.

Persistent bottom tab bar on mobile only (Home / Shop / Wishlist / Cart / Account) — keeps core actions thumb-reachable on long scroll pages, which Azonka lacks.

WhatsApp floating action button, bottom-right above the tab bar — standard expectation for an Instagram-first Indian D2C seller, absent on Azonka.

Skeleton loading states for product grids/images instead of a blank flash while content loads.

Do not add anything beyond this list — the goal is Azonka's exact look and feel with these six specific upgrades, not a redesign.

Pages beyond the homepage (build using the same theme/component language above)

Shop/category listing: sticky filter bar (bottom-sheet filters on mobile, sidebar on desktop) — filter by size, color, price, sort; same product card component

Product detail: swipeable image gallery with dot indicators (+ thumbnail strip on desktop), pinch-to-zoom on mobile, size chips + color swatches, quantity stepper, sticky "Add to Cart"/"Buy Now" bar on mobile, pincode delivery-check input, description/size-chart/care accordion, related products carousel

Cart drawer/page: line items with swipe-to-delete on mobile, coupon input, free-shipping progress bar, order summary

Checkout: single-page (not multi-step wizard), guest checkout allowed, address form, Razorpay + COD payment options

Account: login/register (OTP-based mobile login preferred), order history with status timeline, saved addresses, wishlist

Static pages: About Us, Contact Us, FAQ (accordion), all policy pages, Track Order (guest lookup by order number + phone)

Images

Use real, relevant T-shirt/streetwear fashion photography from Unsplash/Pexels for every placeholder — hero banners, category tiles, brand banner, product cards. No grey placeholder boxes anywhere visible. Structure every image component to accept a clean URL prop, since production images will later be served from Cloudinary.

Tech constraints

React + Vite, Tailwind CSS only, no component libraries

Reusable components: ProductCard, SectionHeading, Carousel, Badge, Button (primary/outline/ghost), Drawer, BottomSheet, Accordion, PillTabs

Fully responsive at 375px / 768px / 1024px / 1440px

Semantic HTML, alt text on all images, aria-labels on icon-only buttons

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/954b5d0e-7edc-48a2-9c6e-ed836bd14451).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
