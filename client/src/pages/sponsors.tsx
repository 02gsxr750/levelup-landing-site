import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Check, Loader2, Crown, Star, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Tier = "starter" | "pro" | "elite";

const tiers = [
  {
    id: "starter" as Tier,
    name: "Starter",
    price: "$49/mo",
    icon: Zap,
    color: "from-cyan-500 to-blue-500",
    features: [
      "Featured sponsor challenge placement",
      "Basic sponsor badge on profile",
      "Priority support",
    ],
  },
  {
    id: "pro" as Tier,
    name: "Pro",
    price: "$149/mo",
    icon: Star,
    color: "from-purple-500 to-pink-500",
    popular: true,
    features: [
      "Everything in Starter",
      "Periodic feed placement (~every 25 items)",
      "Enhanced sponsor badge",
      "Analytics dashboard access",
    ],
  },
  {
    id: "elite" as Tier,
    name: "Elite",
    price: "$349/mo",
    icon: Crown,
    color: "from-orange-500 to-red-500",
    features: [
      "Everything in Pro",
      "Higher frequency feed placement (~every 12 items)",
      "Top priority prominence",
      "Custom challenge branding",
      "Dedicated account manager",
    ],
  },
];

function TierCard({ tier, onSelect, loading }: { 
  tier: typeof tiers[0]; 
  onSelect: (id: Tier) => void;
  loading: Tier | null;
}) {
  const Icon = tier.icon;
  const isLoading = loading === tier.id;
  const isDisabled = loading !== null;

  return (
    <Card className={`relative overflow-visible bg-card/50 backdrop-blur border-border/50 ${tier.popular ? 'ring-2 ring-purple-500' : ''}`}>
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
          Most Popular
        </div>
      )}
      <CardHeader className="text-center pb-4">
        <div className={`mx-auto w-12 h-12 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center mb-3`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-xl text-foreground">{tier.name}</CardTitle>
        <CardDescription className="text-2xl font-bold text-foreground mt-2">
          {tier.price}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {tier.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className="w-full rounded-full font-semibold"
          style={{
            background: `linear-gradient(135deg, ${tier.color.includes('cyan') ? '#00d4ff, #6366f1' : tier.color.includes('purple') ? '#a855f7, #ec4899' : '#f97316, #ef4444'})`,
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
            `Choose ${tier.name}`
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

        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Sponsor Level Up
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get your brand in front of creators and competitors. Feature your challenges, 
            boost your visibility, and connect with an engaged community driven by 
            votes, leaderboards, and bragging rights.
          </p>
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
            <div>
              <h3 className="font-semibold text-foreground mb-2">What about coins?</h3>
              <p className="text-muted-foreground text-sm">
                Coins are a separate in-app feature for participating in challenges. Coins have no cash 
                value and cannot be purchased through the sponsorship program.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center mb-12 p-6 rounded-lg border border-border/50 bg-card/30">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Important:</strong> Sponsor subscriptions are purchased 
            and managed on the web. The mobile app only links out to this page.
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
