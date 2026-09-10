import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/common/SectionHeading";

const FAQS = [
  { q: "What sizes do you carry?", a: "Our tees run S to XXL. Check the size chart on each product page — fits true to size unless noted." },
  { q: "How long does delivery take?", a: "Metro cities: around 3 days. Other locations: 5–7 days. You'll get tracking details by SMS and email once your order ships." },
  { q: "Do you offer cash on delivery?", a: "Yes, COD is available on eligible pincodes — you'll see it as a payment option at checkout if it's available for you." },
  { q: "Can I return or exchange an item?", a: "Yes, unworn items with tags can be returned within 7 days of delivery. See our Refund & Returns policy for details." },
  { q: "How do I track my order?", a: "Use the Track Order page with your order number and the phone or email you used at checkout — no account needed." },
];

export function FaqPage() {
  return (
    <div className="section-wrap max-w-2xl py-12 sm:py-16">
      <SectionHeading eyebrow="Need help" title="Frequently asked questions" copy="" />
      <Accordion type="single" collapsible className="mt-8">
        {FAQS.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-sm font-semibold">{item.q}</AccordionTrigger>
            <AccordionContent className="text-ink-soft">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
