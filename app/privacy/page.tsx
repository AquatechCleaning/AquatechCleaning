
import { Container } from "@/components/template/Container";
import { PageHeader } from "@/components/template/PageHeader";
import { Card } from "@/components/template/Card";

export default function PrivacyPage() {
  return (
    <div className="ui-shell">
      <Container className="ui-page space-y-6">
        <PageHeader
          title="Privacy Policy"
          subtitle="How we collect and use customer and property information."
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Legal" }]}
        />
        <Card className="ui-card space-y-4 p-8">
          <p className="text-sm leading-6 text-slate-700">
            We collect contact details, addresses, and measurement information solely to provide quotes and
            schedule work. Data is stored securely in our database and never sold to third parties. You may
            request removal of your data at any time.
          </p>
          <p className="text-sm text-slate-600">TODO: replace with full legal copy.</p>
        </Card>
      </Container>
    </div>
  );
}


