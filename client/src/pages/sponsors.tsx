import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Check, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

type Tier = "starter" | "pro" | "elite";

type AuthUser = {
  id: string;
  email?: string;
} | null;

type Profile = {
  id: string;
  is_influencer?: boolean;
} | null;

const tiers = [
  {
    id: "starter" as Tier,
    name: "Starter Sponsor",
    price: "$49/month",
    badgeLabel: "STARTER SPONSOR",
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

// TEMP DEBUG: Supabase configuration diagnostics
function getSupabaseDebugInfo() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const siteUrl = import.meta.env.VITE_SITE_URL;
  
  let hostname = "N/A";
  if (url) {
    try {
      hostname = new URL(url).hostname;
    } catch {
      hostname = "INVALID_URL";
    }
  }
  
  return {
    hasUrl: !!url,
    hasKey: !!key,
    hasSiteUrl: !!siteUrl,
    hostname,
    keyPrefix: key ? key.substring(0, 6) : "N/A",
  };
}

function isDebugMode() {
  const params = new URLSearchParams(window.location.search);
  return import.meta.env.DEV || params.get("debug") === "1";
}

function AuthModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const showDebug = isDebugMode();
  const debugInfo = getSupabaseDebugInfo();

  const handleSendCode = async () => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    // TEMP DEBUG: Log Supabase config before OTP call
    console.log("[DEBUG] Supabase config before signInWithOtp:", debugInfo);

    if (!supabase) {
      toast({
        title: "Error",
        description: "Authentication is not available. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) {
        if (error.message.includes("not found") || error.message.includes("Signups not allowed")) {
          throw new Error("No account found with this email. Please use the Level Up app to create an account first.");
        }
        throw error;
      }

      setStep("otp");
      toast({
        title: "Code sent",
        description: "Check your email for the verification code.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!otp.trim()) {
      toast({
        title: "Code required",
        description: "Please enter the verification code.",
        variant: "destructive",
      });
      return;
    }

    if (!supabase) {
      toast({
        title: "Error",
        description: "Authentication is not available. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: "email",
      });

      if (error) throw error;

      toast({
        title: "Signed in",
        description: "You are now signed in.",
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Invalid code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setOtp("");
    setStep("email");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 bg-card border-border">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleClose}
            data-testid="button-close-auth-modal"
          >
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="text-foreground">Sign in to continue</CardTitle>
          <CardDescription>
            To purchase or manage a sponsor subscription, sign in to your Level Up account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "email" ? (
            <>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50"
                data-testid="input-auth-email"
                onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
              />
              <Button
                className="w-full rounded-full"
                onClick={handleSendCode}
                disabled={loading}
                data-testid="button-send-code"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Code"
                )}
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to <strong>{email}</strong>
              </p>
              <Input
                type="text"
                placeholder="Enter verification code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-background/50 text-center text-lg tracking-widest"
                maxLength={6}
                data-testid="input-auth-otp"
                onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()}
              />
              <Button
                className="w-full rounded-full"
                onClick={handleVerifyCode}
                disabled={loading}
                data-testid="button-verify-code"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setStep("email")}
                data-testid="button-back-to-email"
              >
                Use a different email
              </Button>
            </>
          )}
          {/* TEMP DEBUG: Supabase config diagnostics */}
          {showDebug && (
            <div className="mt-4 pt-4 border-t border-border/50 font-mono text-xs text-muted-foreground" data-testid="debug-supabase-info">
              <p>VITE_SUPABASE_URL: {debugInfo.hasUrl ? "true" : "false"}</p>
              <p>VITE_SUPABASE_ANON_KEY: {debugInfo.hasKey ? "true" : "false"}</p>
              <p>VITE_SITE_URL: {debugInfo.hasSiteUrl ? "true" : "false"}</p>
              <p>Hostname: {debugInfo.hostname}</p>
              <p>Key prefix: {debugInfo.keyPrefix}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfluencerRequiredModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 bg-card border-border">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={onClose}
            data-testid="button-close-influencer-modal"
          >
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="text-foreground">Influencer Membership Required</CardTitle>
          <CardDescription>
            Influencer membership is required before accessing the Sponsor Program.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To become a sponsor, you must first be an Influencer member ($9.99/mo). 
            You can upgrade to Influencer in the Level Up app.
          </p>
          <Button
            className="w-full rounded-full"
            onClick={() => {
              window.location.href = "https://joinlevelupapp.com";
            }}
            data-testid="button-become-influencer"
          >
            Become an Influencer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function TierCard({ tier, onSelect, loading }: { 
  tier: typeof tiers[0]; 
  onSelect: (id: Tier) => void;
  loading: Tier | null;
}) {
  const isLoading = loading === tier.id;
  const isDisabled = loading !== null;

  return (
    <Card className={`relative overflow-visible backdrop-blur border-2 ${tier.borderColor} bg-gradient-to-br ${tier.bgGradient} h-full flex flex-col`}>
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
          Most Popular
        </div>
      )}
      <CardHeader className="text-center pb-4">
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${tier.textColor} border ${tier.borderColor} mb-3`}>
          {tier.badgeLabel}
        </div>
        <h3 className={`text-xl font-bold ${tier.textColor}`}>{tier.name}</h3>
        <p className="text-2xl font-bold text-foreground mt-2">
          {tier.price}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <ul className="space-y-2 flex-1">
          {tier.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#39FF14" }} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className={`w-full rounded-full font-semibold text-black mt-4 ${tier.id === 'starter' ? 'bg-yellow-500 hover:bg-yellow-400' : tier.id === 'pro' ? 'bg-blue-500 hover:bg-blue-400' : 'bg-purple-500 hover:bg-purple-400'}`}
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
  const [user, setUser] = useState<AuthUser>(null);
  const [profile, setProfile] = useState<Profile>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showInfluencerModal, setShowInfluencerModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: "checkout"; tier: Tier } | { type: "portal" } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    const sb = supabase;
    const checkAuth = async () => {
      try {
        const { data: { user: authUser } } = await sb.auth.getUser();
        if (authUser) {
          setUser({ id: authUser.id, email: authUser.email });
          
          const { data: profileData } = await sb
            .from("profiles")
            .select("id, is_influencer")
            .eq("user_id", authUser.id)
            .single();
          
          if (profileData) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = sb.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser({ id: session.user.id, email: session.user.email });
        
        const { data: profileData } = await sb
          .from("profiles")
          .select("id, is_influencer")
          .eq("user_id", session.user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (pendingAction && user && profile) {
      if (pendingAction.type === "checkout") {
        if (profile.is_influencer) {
          proceedToCheckout(pendingAction.tier);
        } else {
          setShowInfluencerModal(true);
        }
      } else if (pendingAction.type === "portal") {
        proceedToPortal();
      }
      setPendingAction(null);
    }
  }, [user, profile, pendingAction]);

  const goToHome = () => {
    window.location.href = "/";
  };

  const handleAuthSuccess = async () => {
    if (!supabase) return;
    
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      setUser({ id: authUser.id, email: authUser.email });
      
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, is_influencer")
        .eq("user_id", authUser.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }
    }
  };

  const proceedToCheckout = async (tier: Tier) => {
    setLoadingTier(tier);
    try {
      const response = await fetch("/api/stripe/sponsors/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
        credentials: "include",
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

  const handleSelectTier = async (tier: Tier) => {
    if (!user) {
      setPendingAction({ type: "checkout", tier });
      setShowAuthModal(true);
      return;
    }

    if (!profile?.is_influencer) {
      setShowInfluencerModal(true);
      return;
    }

    proceedToCheckout(tier);
  };

  const proceedToPortal = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch("/api/stripe/sponsors/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("No active sponsor subscription found for this account.");
        }
        throw new Error("We couldn't access your subscription. Please try again or contact support.");
      }
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      const friendlyMessage = error.message.includes("No active sponsor") || error.message.includes("couldn't access")
        ? error.message
        : "We couldn't access your subscription. Please try again or contact support.";
      toast({
        title: "Error",
        description: friendlyMessage,
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) {
      setPendingAction({ type: "portal" });
      setShowAuthModal(true);
      return;
    }

    proceedToPortal();
  };

  const handleManageSubscriptionWithEmail = async () => {
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
        if (response.status === 404) {
          throw new Error("No active sponsor subscription found for this email.");
        }
        throw new Error("We couldn't access your subscription. Please try again or contact support.");
      }
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      const friendlyMessage = error.message.includes("No active sponsor") || error.message.includes("couldn't access")
        ? error.message
        : "We couldn't access your subscription. Please try again or contact support.";
      toast({
        title: "Error",
        description: friendlyMessage,
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        background: "radial-gradient(ellipse at top, #1a0a2e 0%, #0d0518 40%, #050509 100%)"
      }}
    >
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false);
          setPendingAction(null);
        }}
        onSuccess={handleAuthSuccess}
      />
      <InfluencerRequiredModal 
        isOpen={showInfluencerModal} 
        onClose={() => setShowInfluencerModal(false)}
      />
      
      <div className="max-w-[1200px] mx-auto px-4 py-6 pb-16">
        <header className="mb-8 flex justify-between items-center">
          <Button
            variant="ghost"
            data-testid="button-back-home"
            onClick={goToHome}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          
          {!authLoading && (
            user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  data-testid="button-sign-out"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                data-testid="button-sign-in"
              >
                Sign In
              </Button>
            )
          )}
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
          <h2 className="text-lg font-bold text-yellow-400 mb-4">
            Requirements
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

        <section className="grid md:grid-cols-3 gap-6 mb-8">
          {tiers.map((tier) => (
            <TierCard 
              key={tier.id} 
              tier={tier} 
              onSelect={handleSelectTier}
              loading={loadingTier}
            />
          ))}
        </section>

        <p className="text-center text-xs text-muted-foreground mb-16">
          Purchases and subscription management happen on the web. The app links here for convenience.
        </p>

        <section className="max-w-md mx-auto mb-16">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="text-foreground">Already a Sponsor? Manage Your Subscription</CardTitle>
              <CardDescription>
                Manage, upgrade, downgrade, or cancel anytime in the billing portal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <>
                  <p className="text-sm text-muted-foreground text-center">
                    Signed in as <strong>{user.email}</strong>
                  </p>
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
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/50"
                      data-testid="input-portal-email"
                    />
                    <p className="text-xs text-muted-foreground">Use the email you used during checkout.</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={handleManageSubscriptionWithEmail}
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
                  <div className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAuthModal(true)}
                      data-testid="button-sign-in-portal"
                    >
                      Or sign in to your account
                    </Button>
                  </div>
                </>
              )}
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
