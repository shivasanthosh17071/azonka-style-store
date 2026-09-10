import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/common/SectionHeading";

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = () => {
    if (!form.name || !form.email || !form.message) {
      toast.error("Fill in all fields");
      return;
    }
    toast.success("Thanks — we'll get back to you within a day.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="section-wrap py-12 sm:py-16">
      <SectionHeading eyebrow="Say hello" title="Contact us" copy="Questions about an order, sizing, or anything else? We're here." />

      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        <div className="space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1" rows={5} />
          </div>
          <Button onClick={submit} className="h-11 rounded-none bg-brick hover:bg-brick-dark">
            Send message
          </Button>
        </div>

        <div className="space-y-6 text-sm text-ink-soft">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 size-4 text-brick" />
            <a href="mailto:hello@staple01.in">hello@staple01.in</a>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 size-4 text-brick" />
            <a href="tel:+919876543210">+91 98765 43210</a>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 text-brick" />
            <p>Mon — Sat, 10am — 6pm IST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
