import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, ExternalLink } from "lucide-react";

export default function SponsorsSuccessPage() {
  const goToSponsors = () => {
    window.location.href = "/sponsors";
  };

  const goToHome = () => {
    window.location.href = "/";
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "radial-gradient(ellipse at top, #1a0a2e 0%, #0d0518 40%, #050509 100%)"
      }}
    >
      <div className="max-w-lg mx-auto px-4 py-16">
        <Card className="bg-card/50 backdrop-blur border-border/50 text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-foreground">You're In!</CardTitle>
            <CardDescription className="text-base mt-2">
              Your sponsorship is activating...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-sm">
              Thank you for becoming a Level Up sponsor! Your benefits are being provisioned 
              automatically and should be active within a few moments.
            </p>
            
            <div className="p-4 rounded-lg bg-background/50 border border-border/50">
              <p className="text-sm text-muted-foreground">
                A confirmation email will be sent to your inbox with details about your 
                subscription and next steps.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                className="w-full rounded-full font-semibold"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #ec4899)",
                }}
                onClick={goToSponsors}
                data-testid="button-back-sponsors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sponsors
              </Button>
              
              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={() => window.open('https://levelup-app-flax.vercel.app', '_blank')}
                data-testid="button-open-app"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Level Up App
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <span 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            onClick={goToHome}
          >
            Return to Homepage
          </span>
        </div>
      </div>
    </div>
  );
}
