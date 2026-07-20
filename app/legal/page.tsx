import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LegalPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-white">
      {/* Background Grid */}
      <div className="pointer-events-none fixed inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Simple Marketing Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between p-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
          AWSAF<span className="text-slate-400">HUB</span>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" className="rounded-full">
            Sign In
          </Button>
        </Link>
      </header>

      {/* Legal Content */}
      <section className="relative z-10 mx-auto w-full max-w-3xl px-6 py-16 text-slate-700">
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-slate-900">
          Privacy Policy
        </h1>
        <p className="mb-10 text-sm text-slate-400">
          Last Updated:{' '}
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>

        <div className="mb-20 space-y-6 text-sm leading-relaxed text-slate-600">
          <p>
            This Privacy Policy describes how AwsafTrading LLC ("Awsaf Hub", "we", "us", or "our")
            collects, uses, and discloses your information when you use our website and AI-powered
            marketing analysis services (the "Service").
          </p>

          <div>
            <h2 className="mb-3 text-xl font-bold text-slate-900">1. Information We Collect</h2>
            <p className="mb-3">
              <strong>Account Information:</strong> When you create an account, we collect your
              email address and authentication details via our third-party provider, Clerk.
            </p>
            <p className="mb-3">
              <strong>Input Data:</strong> When you generate reports, we collect the inputs you
              provide, such as product details, target audience, and ad budgets.
            </p>
            <p className="mb-3">
              <strong>Usage Data:</strong> We collect telemetry data including page views, IP
              addresses, and geographical location to understand how users interact with the
              Service.
            </p>
            <p>
              <strong>Billing Information:</strong> For paid subscriptions, billing details are
              securely processed by Stripe. We do not store your full credit card numbers on our
              servers.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                To provide, maintain, and improve the Service, including generating AI-driven
                business reports.
              </li>
              <li>To manage your account and provide you with customer support.</li>
              <li>
                To process payments and manage your subscription limits (e.g., the 1 free report, 5
                Pro reports, or purchased extra reports).
              </li>
              <li>
                To monitor and analyze telemetry data to improve user experience and product
                features.
              </li>
              <li>
                To send you administrative emails, such as the "Nagging Engine" reminders if your
                reports are incomplete.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold text-slate-900">3. Data Processing & AI</h2>
            <p>
              We use OpenAI's API to process your input data (product details, budgets) and generate
              marketing strategies. By using our Service, you consent to your input data being sent
              to OpenAI for processing. We do not use your data to train third-party AI models.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold text-slate-900">4. Sharing of Information</h2>
            <p>
              We share your information with the following third-party service providers to operate
              the Service:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong>Clerk:</strong> For user authentication and identity management.
              </li>
              <li>
                <strong>Neon (PostgreSQL):</strong> For secure database storage of your projects and
                account details.
              </li>
              <li>
                <strong>Stripe:</strong> For processing subscription and one-time payments.
              </li>
              <li>
                <strong>OpenAI:</strong> For generating the AI-driven business analysis and reports.
              </li>
              <li>
                <strong>Resend:</strong> For sending transactional and reminder emails.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold text-slate-900">5. Data Retention</h2>
            <p>
              We retain your account information and generated project data for as long as your
              account is active. If you wish to delete your account and all associated data, please
              contact us at feras@awsaftrading.com.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold text-slate-900">6. Your Privacy Rights</h2>
            <p>
              Depending on your location (e.g., California, EU), you may have the right to access,
              correct, or delete your personal information. To exercise these rights, please contact
              us.
            </p>
          </div>
        </div>

        <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-slate-900">
          Terms of Service
        </h1>
        <p className="mb-10 text-sm text-slate-400">
          Last Updated:{' '}
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>

        <div className="mb-20 space-y-6 text-sm leading-relaxed text-slate-600">
          <p>
            These Terms of Service ("Terms") govern your use of the Awsaf Hub website and Service.
            By accessing or using the Service, you agree to be bound by these Terms.
          </p>

          <div>
            <h2 className="mb-3 text-xl font-bold text-slate-900">1. Subscriptions and Billing</h2>
            <p className="mb-3">
              We offer a Free tier (1 report), a Pro Subscription ($100/month), and Extra Reports
              ($25/one-time). By purchasing a subscription, you authorize us to charge your payment
              method via Stripe on a recurring monthly basis until you cancel.
            </p>
            <p className="mb-3">
              <strong>Limits:</strong> The Pro plan allows for 5 reports per month. If you reach
              this limit, you may purchase Extra Reports for $25 each. Unused reports do not roll
              over to the next month. Your monthly limit resets 30 days after your last reset date
              or subscription renewal.
            </p>
            <p>
              <strong>Cancellation:</strong> You can cancel your subscription at any time. Upon
              cancellation, your access to Pro features will remain active until the end of the
              current billing cycle, after which your account will revert to the Free tier limits.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              2. AI Generated Content Disclaimer
            </h2>
            <p>
              The reports, ROAS calculations, budget breakdowns, and marketing strategies generated
              by Awsaf Hub are produced by Artificial Intelligence (OpenAI). While we strive for
              accuracy, AI-generated content may contain errors or inaccuracies. The Service
              provides predictions and estimates, not financial or legal advice. You should not rely
              solely on this data for making critical business decisions. We are not liable for any
              financial losses resulting from the use of the AI-generated reports.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold text-slate-900">3. Acceptable Use</h2>
            <p>
              You agree not to use the Service to generate reports for illegal products, malicious
              intent, or to reverse-engineer, decompile, or attempt to extract the underlying AI
              prompts and logic of the application.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold text-slate-900">4. Limitation of Liability</h2>
            <p>
              AwsafTrading LLC shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, including loss of profits, data, or goodwill,
              arising out of or related to your use of the Service.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold text-slate-900">5. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the
              State of New York, USA, without regard to its conflict of law provisions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-auto w-full border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between px-6 py-8 md:flex-row">
          <p className="mb-4 text-sm text-slate-500 md:mb-0">
            © 2026 AwsafTrading LLC. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-slate-500 transition-colors hover:text-slate-900"
            >
              Dashboard
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-slate-500 transition-colors hover:text-slate-900"
            >
              Pricing
            </Link>
            <Link
              href="/legal"
              className="text-sm text-slate-500 transition-colors hover:text-slate-900"
            >
              Privacy & Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
