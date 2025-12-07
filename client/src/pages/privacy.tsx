import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  const goToHome = () => {
    window.location.href = "/";
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        background: "radial-gradient(ellipse at top, #1a0a2e 0%, #0d0518 40%, #050509 100%)"
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 py-6 pb-16">
        <header className="mb-8">
          <Button
            variant="ghost"
            data-testid="button-back-home"
            onClick={goToHome}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </header>

        <article className="prose prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">LEVEL UP — PRIVACY POLICY</h1>
          <p className="text-lg text-muted-foreground mb-2">(Professional Legal Version)</p>
          <p className="text-muted-foreground mb-8">
            Last Updated: December 2025<br />
            Operated by Marshell Ventures LLC<br />
            Contact: <a href="mailto:support@joinlevelupapp.com" className="text-green-400 hover:underline">support@joinlevelupapp.com</a>
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Level Up ("we," "us," "our") is a challenge-based social platform where users post content, compete in battles, earn coins and XP, and join a community of creators and competitors.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We are committed to protecting your privacy and being transparent about how we collect, use, and safeguard your information. This Privacy Policy explains what data we collect, how we use it, how it is shared, your rights, and the choices you have.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              By using Level Up, you agree to the practices described in this Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">We collect the following categories of information:</p>
            
            <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">A. Account Information</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Email address</li>
              <li>Username and profile information</li>
              <li>Authentication data (passwords, tokens, or magic links handled securely by Supabase)</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">B. User-Generated Content</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Photos, videos, and posts you upload</li>
              <li>Challenge submissions, battle entries, comments, and other interactions</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">C. Usage & Technical Data</h3>
            <p className="text-muted-foreground mb-2">Collected automatically through hosting and analytics services (e.g., Vercel, Supabase, Expo, Resend, optional analytics tools):</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>IP address</li>
              <li>Device type</li>
              <li>App version</li>
              <li>Activity logs</li>
              <li>Crash logs and performance data</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">D. Communications</h3>
            <p className="text-muted-foreground mb-2">If you contact support or receive emails:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Support messages</li>
              <li>Email interaction logs (open, bounce, delivery)</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">E. Cookies and Similar Technologies (Web Only)</h3>
            <p className="text-muted-foreground">
              We may use cookies for authentication, session handling, and performance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use the information we collect to:</p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">A. Operate and maintain the Level Up platform</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Create and manage user accounts</li>
              <li>Process authentication and login</li>
              <li>Host and display challenges, battles, and content</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">B. Support core features</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>XP and coin rewards</li>
              <li>Leaderboards and battle outcomes</li>
              <li>Influencer features and sponsored challenges</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">C. Safety & Moderation</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Detect and prevent abuse, fraud, or harmful activity</li>
              <li>Enforce platform policies, including age restrictions (13+)</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">D. Improve the platform</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Analyze usage trends and performance</li>
              <li>Fix bugs and enhance features</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">E. Communicate with users</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Respond to support requests</li>
              <li>Send onboarding, security, and platform updates</li>
              <li>Provide required legal or service-related notifications</li>
            </ul>

            <p className="text-muted-foreground mt-4 font-semibold">We do not sell personal information.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">4. How We Share Information</h2>
            <p className="text-muted-foreground mb-4">We only share information when necessary to operate Level Up or comply with the law.</p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">A. Service Providers</h3>
            <p className="text-muted-foreground mb-2">We may share information with companies that help us run the platform, including:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Supabase – authentication, database storage, logs</li>
              <li>Vercel – website hosting and deployment</li>
              <li>Expo / EAS – mobile app distribution</li>
              <li>Resend – transactional email delivery</li>
              <li>Analytics tools – performance and usage insights</li>
            </ul>
            <p className="text-muted-foreground mt-2">These providers are bound by confidentiality and data protection obligations.</p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">B. Legal Requirements</h3>
            <p className="text-muted-foreground mb-2">We may disclose information to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Comply with legal obligations</li>
              <li>Respond to lawful requests</li>
              <li>Protect the safety, rights, and property of Level Up and its users</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">C. Community Interactions</h3>
            <p className="text-muted-foreground">Any content you upload is visible to other users unless you delete it or your account.</p>
            <p className="text-muted-foreground mt-2 font-semibold">We never sell user data to third parties.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">5. Your Rights & Choices</h2>
            <p className="text-muted-foreground mb-4">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Access your personal information</li>
              <li>Update or correct your information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of certain communications</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              You may exercise these rights by emailing:{" "}
              <a href="mailto:support@joinlevelupapp.com" className="text-green-400 hover:underline">support@joinlevelupapp.com</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">6. Data Retention</h2>
            <p className="text-muted-foreground mb-4">We keep information for as long as your account is active or needed to provide the service.</p>
            <p className="text-muted-foreground mb-2">When you request account deletion:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Your profile and personal information are deleted or anonymized</li>
              <li>Your public submissions (e.g., challenges) may remain unless you delete them manually before requesting account removal</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">7. Security</h2>
            <p className="text-muted-foreground">
              We use reasonable technical and organizational measures to safeguard your data, including encryption, secure authentication, and modern hosting environments.
            </p>
            <p className="text-muted-foreground mt-4">However, no system can guarantee 100% security.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">8. Children's Privacy</h2>
            <p className="text-muted-foreground">Level Up is intended for users 13 years of age or older.</p>
            <p className="text-muted-foreground mt-4">
              We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has created an account, we will delete it promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">9. International Users</h2>
            <p className="text-muted-foreground">
              Your data may be processed or stored in the United States or other locations where our service providers operate.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">10. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy as the platform evolves. Changes will be posted to this page with an updated "Last Updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions, concerns, or requests regarding your privacy, contact us at:
            </p>
            <p className="text-muted-foreground">
              <a href="mailto:support@joinlevelupapp.com" className="text-green-400 hover:underline">support@joinlevelupapp.com</a>
            </p>
            <p className="text-muted-foreground mt-2">Marshell Ventures LLC</p>
          </section>
        </article>

        <footer className="border-t border-border/50 pt-8 pb-4 mt-12 text-xs text-muted-foreground flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div>© {new Date().getFullYear()} Level Up · Marshell Ventures LLC</div>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="mailto:support@joinlevelupapp.com" className="hover:text-foreground transition-colors">
              Contact
            </a>
            <span 
              className="hover:text-foreground transition-colors cursor-pointer"
              onClick={goToHome}
              data-testid="link-back-home-footer"
            >
              Home
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
