import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default function DeleteAccountPage() {
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
      <div className="max-w-[800px] mx-auto px-4 py-6 pb-16">
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
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Delete Your Account</h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            We're sorry to see you go. If you'd like to delete your Level Up account, you can do so directly in the app by following the steps below.
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">How to Delete Your Account</h2>
            <ol className="list-decimal list-inside text-muted-foreground space-y-3">
              <li className="leading-relaxed">Open the <strong className="text-foreground">Level Up</strong> app on your device</li>
              <li className="leading-relaxed">Go to <strong className="text-foreground">Profile</strong> and then <strong className="text-foreground">Settings</strong></li>
              <li className="leading-relaxed">Tap <strong className="text-foreground">"Delete Account"</strong></li>
              <li className="leading-relaxed">Type <strong className="text-foreground">"DELETE"</strong> to confirm</li>
              <li className="leading-relaxed">Your account will be permanently deleted</li>
            </ol>
          </section>

          <section className="mb-8 p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
            <h3 className="text-lg font-semibold text-foreground mb-2">Important Note</h3>
            <p className="text-muted-foreground">
              If you have any active or pending battles, account deletion will be blocked until those battles are completed or ended. Please finish or cancel any ongoing battles before attempting to delete your account.
            </p>
          </section>

          <section className="mb-8">
            <div className="flex justify-center">
              <Button
                className="rounded-full px-8 py-4 font-semibold text-base text-white border-0"
                style={{
                  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  boxShadow: "0 0 30px rgba(239, 68, 68, 0.4)"
                }}
                data-testid="button-open-app-delete"
                onClick={() => window.open('https://levelup-app-flax.vercel.app/profile', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Level Up and Delete My Account
              </Button>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Need Help?</h2>
            <p className="text-muted-foreground">
              If you can't access your account or need assistance with account deletion, contact support:{" "}
              <a href="mailto:support@joinlevelupapp.com" className="text-green-400 hover:underline">
                support@joinlevelupapp.com
              </a>
            </p>
          </section>
        </article>

        <footer className="border-t border-border/50 pt-8 pb-4 mt-12 text-xs text-muted-foreground flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div>© {new Date().getFullYear()} Level Up · Marshell Ventures LLC</div>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="mailto:support@joinlevelupapp.com" className="hover:text-foreground transition-colors">
              Contact
            </a>
            <a 
              href="/privacy" 
              className="hover:text-foreground transition-colors"
              data-testid="link-privacy"
            >
              Privacy
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
