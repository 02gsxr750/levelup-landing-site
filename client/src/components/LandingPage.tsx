import { Button } from "@/components/ui/button";
import { 
  Zap, 
  ExternalLink,
  Gamepad2,
  Users,
  Trophy,
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import logoImage from "@assets/Latest Level Up Logo_1765075167902.png";
import screenshot1 from "@assets/IMG_5341_1765075302448.png";
import screenshot2 from "@assets/IMG_5352_1765075302441.png";
import screenshot3 from "@assets/IMG_5348_1765075302444.png";
import screenshot4 from "@assets/IMG_5350_1765075302443.png";
import screenshot5 from "@assets/IMG_5346_1765075302446.png";

function Header() {
  const [, navigate] = useLocation();

  const navLinks = [
    { href: "/about", label: "About", action: () => navigate("/about") },
    { href: "#", label: "How It Works", action: () => navigate("/about") },
    { href: "#", label: "Safety", action: () => navigate("/about") },
  ];

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
      <div className="flex items-center gap-6" data-testid="brand-logo">
        <img 
          src={logoImage} 
          alt="Level Up Logo" 
          className="w-40 h-40 object-contain flex-shrink-0"
        />
        <span className="font-black tracking-widest text-3xl md:text-4xl text-white italic">
          LEVEL UP
        </span>
      </div>
      <nav className="flex items-center gap-2 flex-wrap justify-center md:justify-end">
        {navLinks.map((link) => (
          <Button
            key={link.label}
            variant="ghost"
            onClick={link.action}
            data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {link.label}
          </Button>
        ))}
        <Button
          onClick={() => {
            const contactSection = document.getElementById('contact');
            contactSection?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="rounded-full px-5 py-2.5 font-semibold text-sm text-black border-0 ml-2"
          style={{
            background: "#22c55e",
            boxShadow: "0 0 20px rgba(34, 197, 94, 0.6), 0 18px 45px rgba(34, 197, 94, 0.3)"
          }}
          data-testid="button-request-beta"
        >
          <Zap className="w-4 h-4 mr-1.5" />
          Beta Access
        </Button>
      </nav>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="mb-16">
      <div className="text-center mb-8 max-w-3xl mx-auto">
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Level Up is where creators, competitors, and communities collide. Post challenges, battle others in real-time, earn coins and XP, and build your reputation.
        </p>

        <div className="flex flex-wrap gap-3 justify-center text-sm text-muted-foreground mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-border bg-background/60">
            <Gamepad2 className="w-4 h-4" /> No gambling
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-border bg-background/60">
            <Users className="w-4 h-4" /> Ages 13+
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-border bg-background/60">
            <Trophy className="w-4 h-4" /> Built for creators
          </span>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Button 
            className="rounded-full px-6 py-3 font-semibold text-base text-black border-0"
            style={{
              background: "#22c55e",
              boxShadow: "0 0 30px rgba(34, 197, 94, 0.6), 0 20px 60px rgba(34, 197, 94, 0.3)"
            }}
            data-testid="button-request-beta-hero"
            onClick={() => {
              const contactSection = document.getElementById('contact');
              contactSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Zap className="w-5 h-5 mr-2" />
            Request Beta Access
          </Button>
          <Button 
            variant="outline" 
            className="rounded-full px-6 py-3 text-base border-border bg-background/60"
            data-testid="button-web-preview"
            onClick={() => window.open('https://levelup-app-flax.vercel.app', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Web Preview
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Closed beta. App Store launch coming soon.
        </p>
      </div>
    </section>
  );
}

function ScreenshotGrid() {
  const screenshots = [
    { src: screenshot1, label: "Challenge Feed" },
    { src: screenshot2, label: "Battle View" },
    { src: screenshot3, label: "Power Vote" },
    { src: screenshot4, label: "Power Strike" },
    { src: screenshot5, label: "Profile" },
  ];

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-center mb-10">Experience Level Up</h2>
      <div className="flex justify-center items-end gap-4 overflow-x-auto pb-4">
        {screenshots.map((screenshot, idx) => (
          <div 
            key={idx}
            className="flex-shrink-0"
            data-testid={`screenshot-card-${idx}`}
          >
            {/* Phone Frame */}
            <div className="relative w-48 mx-auto">
              {/* Phone bezel - outer frame */}
              <div className="bg-black rounded-3xl p-2.5 shadow-2xl"
                style={{
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8), inset 0 0 0 1px rgba(255,255,255,0.1)"
                }}>
                {/* Phone screen */}
                <div className="bg-black rounded-2xl overflow-hidden aspect-[9/16] relative group">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"></div>
                  
                  {/* Screen content */}
                  <img 
                    src={screenshot.src} 
                    alt={screenshot.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Hover overlay with label */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <p className="text-xs font-semibold text-green-400">{screenshot.label}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: "Create & Battle",
      description: "Post your goals and challenge others to time-based 1v1 battles. Stake coins, earn votes."
    },
    {
      title: "Earn Rewards",
      description: "Win battles, climb leaderboards, and earn coins and XP. Creator rewards for engagement."
    },
    {
      title: "Build Reputation",
      description: "Rise through 5 competitive tiers. Show your skills. Become a Level Up champion."
    },
    {
      title: "Creator Tools",
      description: "Influencer perks, longer uploads, 2× rewards, and exclusive battle tools."
    },
    {
      title: "Community First",
      description: "Safe, moderated platform. 3-strike policy. Built for real connections."
    },
    {
      title: "Sponsor Challenges",
      description: "Brands can run sponsored challenges with real coin prize pools."
    }
  ];

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-center mb-10">Why Level Up?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-lg border border-green-400/20 bg-white/[0.02] hover:bg-white/[0.04] hover:border-green-400/40 transition-all duration-300"
            data-testid={`feature-card-${idx}`}
          >
            <div className="flex items-start gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  const [, navigate] = useLocation();

  return (
    <section id="contact" className="mb-16 py-12 rounded-2xl border border-green-400/30 bg-gradient-to-r from-green-400/10 to-transparent p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Level Up?</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Join thousands of creators and competitors building their reputation. Get beta access today.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Button
            className="rounded-full px-8 py-3 font-semibold text-base text-black border-0"
            style={{
              background: "#22c55e",
              boxShadow: "0 0 30px rgba(34, 197, 94, 0.6)"
            }}
            data-testid="button-beta-cta"
          >
            <Zap className="w-5 h-5 mr-2" />
            Request Beta Access
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-8 py-3 font-semibold text-base border-border"
            onClick={() => navigate("/about")}
            data-testid="button-learn-more"
          >
            Learn More <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Questions? Email{" "}
          <a href="mailto:support@joinlevelupapp.com" className="text-green-400 hover:underline">
            support@joinlevelupapp.com
          </a>
        </p>
      </div>
    </section>
  );
}

function Footer() {
  const [, navigate] = useLocation();

  return (
    <footer className="border-t border-border/50 pt-8 pb-4 text-xs text-muted-foreground flex flex-col sm:flex-row gap-4 justify-between items-center">
      <div>© {new Date().getFullYear()} Level Up · Marshell Ventures LLC</div>
      <div className="flex flex-wrap gap-4 justify-center">
        <button onClick={() => navigate("/about")} className="hover:text-foreground transition-colors">
          About
        </button>
        <a href="mailto:support@joinlevelupapp.com" className="hover:text-foreground transition-colors">
          Contact
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Privacy (coming soon)
        </a>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div 
      className="min-h-screen"
      style={{
        background: "radial-gradient(ellipse at top, #1a0a2e 0%, #0d0518 40%, #050509 100%)"
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 py-6 pb-16">
        <Header />
        <HeroSection />
        <ScreenshotGrid />
        <FeaturesSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
