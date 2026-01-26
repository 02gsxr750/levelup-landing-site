import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Tier = "starter" | "pro" | "elite";

const tiers = [
  {
    id: "starter" as Tier,
    name: "Starter Sponsor",
    price: "$49/month",
    badgeEmoji: "🌱",
    badgeLabel: "SPONSORED",
    borderColor: "border-yellow-500",
    textColor: "text-yellow-400",
    bgGradient: "from-yellow-900/20 to-amber-800/10",
    features: [
      "1 active sponsored challenge at a time",
      "Sponsored badge on challenge cards",
      "Small banner on challenge detail page",
      "Basic stats (views, entries, winner)",
      "Coin prize pool escrow & automatic payout",
    ],
  },
  {
    id: "pro" as Tier,
    name: "Pro Sponsor",
    price: "$149/month",
    badgeEmoji: "⚡",
    badgeLabel: "PRO SPONSOR",
    borderColor: "border-blue-500",
    textColor: "text-blue-400",
    bgGradient: "from-blue-900/20 to-cyan-800/10",
    popular: true,
    features: [
      "Everything in Starter",
      "Up to 3 active sponsored challenges",
      "Higher feed priority among sponsored challenges",
      "Join-screen sponsor intro card",
      "10,000 bonus coins per month",
      "Expanded stats: entries, unique participants, votes",
    ],
  },
  {
    id: "elite" as Tier,
    name: "Elite Sponsor",
    price: "$399/month",
    badgeEmoji: "👑",
    badgeLabel: "ELITE SPONSOR",
    borderColor: "border-purple-500",
    textColor: "text-purple-400",
    bgGradient: "from-purple-900/20 to-gray-800/10",
    features: [
      "Everything in Pro",
      "Up to 5 active sponsored challenges",
      "Featured Sponsor tile in challenge discovery",
      "30,000 bonus coins per month",
      "Slot for short sponsor intro video (muted auto-play)",
      '"Elite Sponsor" badge on cards',
    ],
  },
];

function TierCard({ tier, onSelect, loading }: { 
  tier: typeof tiers[0]; 
  onSelect: (id: Tier) => void;
  loading: Tier | null;
}) {
  const isLoading = loading === tier.id;
  const isDisabled = loading !== null;

  return (
    <Card className={`relative overflow-visible backdrop-blur border-2 ${tier.borderColor} bg-gradient-to-br ${tier.bgGradient}`}>
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
          Most Popular
        </div>
      )}
      <CardHeader className="text-center pb-4">
        <div className="text-4xl mb-3">{tier.badgeEmoji}</div>
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${tier.textColor} border ${tier.borderColor} mb-3`}>
          {tier.badgeLabel}
        </div>
        <h3 className={`text-xl font-bold ${tier.textColor}`}>{tier.name}</h3>
        <p className="text-2xl font-bold text-foreground mt-2">
          {tier.price}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {tier.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#39FF14" }} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className={`w-full rounded-full font-semibold text-black ${tier.id === 'starter' ? 'bg-yellow-500 hover:bg-yellow-400' : tier.id === 'pro' ? 'bg-blue-500 hover:bg-blue-400' : 'bg-purple-500 hover:bg-purple-400'}`}
          style={{
            boxShadow: tier.id === 'starter' 
              ? "0 0 20px rgba(234, 179, 8, 0.4)" 
              : tier.id === 'pro' 
                ? "0 0 20px rgba(59, 130, 246, 0.4)" 
                : "0 0 20px rgba(168, 85, 247, 0.4)"
          }}
          onClick={() => onSelect(tier.id)}
          disabled={isDisabled}
          data-testid={`button-choose-${tier.id}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Redirecting...
            </>
          ) : (
            `Choose ${tier.name.split(" ")[0]}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function SponsorsPage() {
  const [loadingTier, setLoadingTier] = useState<Tier | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const goToHome = () => {
    window.location.href = "/";
  };

  const handleSelectTier = async (tier: Tier) => {
    setLoadingTier(tier);
    try {
      const response = await fetch("/api/stripe/sponsors/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setLoadingTier(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter the email associated with your subscription.",
        variant: "destructive",
      });
      return;
    }

    setPortalLoading(true);
    try {
      const response = await fetch("/api/stripe/sponsors/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to access billing portal");
      }
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
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

        <section className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Sponsor Program
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Run sponsored challenges with platform coin prize pools. Sponsors can create branded 
            challenges where coins are escrowed and automatically paid out to the winner when the challenge ends.
          </p>
        </section>

        <section className="max-w-2xl mx-auto mb-12 p-6 rounded-lg border border-yellow-500/50 bg-yellow-900/10">
          <h2 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
            <span>⚠️</span> Requirements
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">•</span>
              <span>Must be an Influencer member before accessing Sponsor Program</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">•</span>
              <span>Minimum prize pool: 25,000 coins per sponsored challenge</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">•</span>
              <span>Coins are locked in escrow when challenge is created</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">•</span>
              <span>Winner receives prize pool automatically when challenge ends</span>
            </li>
          </ul>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-16">
          {tiers.map((tier) => (
            <TierCard 
              key={tier.id} 
              tier={tier} 
              onSelect={handleSelectTier}
              loading={loadingTier}
            />
          ))}
        </section>

        <section className="max-w-md mx-auto mb-16">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="text-foreground">Already a Sponsor?</CardTitle>
              <CardDescription>
                Manage, upgrade, downgrade, or cancel anytime in the billing portal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50"
                data-testid="input-portal-email"
              />
              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={handleManageSubscription}
                disabled={portalLoading}
                data-testid="button-manage-subscription"
              >
                {portalLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Manage Subscription"
                )}
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">How do I purchase a sponsorship?</h3>
              <p className="text-muted-foreground text-sm">
                Sponsor subscriptions are purchased and managed on the web only. Select your tier above 
                and complete checkout via Stripe. The mobile app links to this page for purchases.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">When do my benefits activate?</h3>
              <p className="text-muted-foreground text-sm">
                Benefits activate automatically after successful checkout. Provisioning happens via our 
                payment system and may take a few moments to reflect in the app.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Can I upgrade, downgrade, or cancel?</h3>
              <p className="text-muted-foreground text-sm">
                Yes! Use the "Manage Subscription" button above to access the billing portal where you 
                can change plans, update payment methods, or cancel anytime.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center mb-12 p-6 rounded-lg border border-border/50 bg-card/30">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> All tiers require Influencer membership ($9.99/mo) as a prerequisite. 
            Sponsored challenge coins are held in escrow until the challenge ends, then distributed to the winner. 
            Coins have no cash value. Sponsor subscriptions are purchased and managed on the web.
          </p>
        </section>

        <footer className="border-t border-border/50 pt-8 pb-4 text-xs text-muted-foreground flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div>© {new Date().getFullYear()} Level Up · Marshell Ventures LLC</div>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="mailto:support@joinlevelupapp.com" className="hover:text-foreground transition-colors">
              Contact
            </a>
            <a 
              href="/privacy" 
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </a>
            <a 
              href="/delete-account" 
              className="hover:text-foreground transition-colors"
            >
              Delete Account
            </a>
            <span 
              className="hover:text-foreground transition-colors cursor-pointer"
              onClick={goToHome}
            >
              Home
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
