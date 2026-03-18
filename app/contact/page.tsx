"use client";

import { FormEvent, useState } from "react";
import { Container } from "@/components/template/Container";
import { PageHeader } from "@/components/template/PageHeader";
import { Card } from "@/components/template/Card";
import { Input, Textarea } from "@/components/template/FormControls";
import { Button } from "@/components/template/Button";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", address: "", message: "" });
  };

  return (
    <div className="ui-shell">
      <Container className="ui-page space-y-10">
        <PageHeader
          title="Let&apos;s plan your clean."
          subtitle="Share your property details and we&apos;ll confirm a plan within one business day."
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        />
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="ui-card p-0">
          <form onSubmit={submit} className="space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Input
                placeholder="Address / suburb"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <Textarea
              rows={4}
              placeholder="Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
            <Button type="submit">
              Send message
            </Button>
            {submitted && <p className="text-sm text-green-700">Thanks! We&apos;ll get back shortly.</p>}
            <p className="text-xs text-slate-500">TODO: hook up SMTP provider for admin notifications.</p>
          </form>
          </Card>
          <Card className="ui-card p-6">
            <h3 className="text-lg font-semibold text-[#02203D]">Call or WhatsApp</h3>
            <p className="mt-2 text-sm text-slate-700">+27 (0)82 000 0000</p>
            <p className="text-sm text-slate-700">hello@aquatechcleaning.co.za</p>
            <p className="mt-4 text-sm text-slate-600">
              Operating hours: Monday-Saturday, 07:00-18:00. Emergency call-outs available for flooding or spills.
            </p>
          </Card>
        </div>
      </Container>
    </div>
  );
}


