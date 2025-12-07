import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  ExternalLink, 
  Shield, 
  Users, 
  Trophy, 
  Gamepad2,
  Coins,
  Target,
  Star,
  Heart,
  Flag,
  Mail,
  Building2
} from "lucide-react";

function Logo() {
  return (
    <div 
      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{
        background: "radial-gradient(circle at 20% 0, #ffe66e 0, #ff7a3c 32%, #ff3c7d 58%, #6c5ce7 86%)",
        boxShadow: "0 18px 45px rgba(0, 0, 0, 0.6)"
      }}
    >
      <span className="font-extrabold text-lg tracking-wider text-white">LU</span>
    </div>
  );
}

function Header() {
  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#safety", label: "Safety" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
      <div className="flex items-center gap-3" data-testid="brand-logo">
        <Logo />
        <div className="flex flex-col">
          <span className="font-extrabold tracking-[0.14em] text-sm text-foreground">LEVEL UP</span>
          <span className="text-xs text-muted-foreground">Challenge · Compete · Grow</span>
        </div>
      </div>
      <nav className="flex items-center gap-4 flex-wrap text-sm">
        {navLinks.map((link) => (
          <a 
            key={link.href}
            href={link.href} 
            className="text-muted-foreground transition-colors hover:text-foreground"
            data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {link.label}
          </a>
        ))}
        <a 
          href="#policies" 
          className="px-3.5 py-1.5 rounded-full border border-border text-foreground font-medium text-sm"
          style={{
            background: "linear-gradient(120deg, rgba(255, 122, 60, 0.12), rgba(0, 212, 255, 0.06))"
          }}
          data-testid="nav-link-policies"
        >
          Policies
        </a>
      </nav>
    </header>
  );
}

function HeroContent() {
  return (
    <div>
      <div className="inline-flex items-center gap-2 text-xs text-muted-foreground mb-3.5">
        <span 
          className="px-2.5 py-1 rounded-full border text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{
            borderColor: "rgba(255, 122, 60, 0.4)",
            background: "rgba(5, 5, 9, 0.7)",
            color: "#ff7a3c"
          }}
        >
          Closed Beta
        </span>
        Challenge-based social app for real life.
      </div>
      
      <h1 className="text-[clamp(32px,4vw,40px)] font-extrabold tracking-[0.03em] mb-3.5 leading-tight">
        Turn your everyday life into a{" "}
        <span 
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(110deg, #ffe66e, #ff7a3c, #ff3c7d, #6c5ce7)"
          }}
        >
          challenge
        </span>
        .
      </h1>
      
      <p className="text-[15px] text-muted-foreground max-w-[520px] mb-5 leading-relaxed">
        Level Up is a challenge-based social platform where people post real
        challenges, compete head-to-head in battles, earn votes from the
        community, and collect coins & XP along the way.
      </p>

      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-6">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-background/80">
          <Gamepad2 className="w-3.5 h-3.5" /> No gambling · coins only
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-background/80">
          <Users className="w-3.5 h-3.5" /> Ages 13+ with safety tools
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-background/80">
          <Trophy className="w-3.5 h-3.5" /> Built for creators & sponsors
        </span>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Button 
          className="rounded-full px-5 py-2.5 font-semibold text-sm text-white border-0"
          style={{
            backgroundImage: "linear-gradient(120deg, #ff7a3c, #ff3c7d, #6c5ce7)",
            boxShadow: "0 18px 45px rgba(0, 0, 0, 0.6)"
          }}
          data-testid="button-request-beta"
          onClick={() => {
            const contactSection = document.getElementById('contact');
            contactSection?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <Zap className="w-4 h-4 mr-1.5" />
          Request Beta Access
        </Button>
        <Button 
          variant="outline" 
          className="rounded-full px-4 py-2 text-sm border-border bg-background/60"
          data-testid="button-web-preview"
          onClick={() => window.open('https://levelup-app-flax.vercel.app', '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-1.5" />
          Open Web Preview
        </Button>
      </div>
      
      <p className="text-[11px] text-muted-foreground">
        Level Up is currently in closed beta. Public App Store launch is coming soon.
      </p>
    </div>
  );
}

function HeroCard() {
  return (
    <aside 
      className="rounded-3xl p-5 border relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at top left, rgba(255, 122, 60, 0.32), transparent 55%),
          radial-gradient(circle at bottom right, rgba(0, 212, 255, 0.28), transparent 60%),
          hsl(240 12% 5%)
        `,
        borderColor: "rgba(255, 255, 255, 0.02)",
        boxShadow: "0 18px 45px rgba(0, 0, 0, 0.6)"
      }}
      data-testid="hero-card-preview"
    >
      <div className="text-[11px] text-muted-foreground mb-2">Challenge feed preview</div>
      
      <div className="flex flex-col gap-3.5 mb-3">
        <div className="flex gap-2.5 items-center">
          <div className="flex-1 px-2.5 py-1.5 rounded-xl bg-background/90 border border-border">
            <div className="text-[13px] font-semibold mb-0.5">Cold Shower Streak – Day 7</div>
            <div className="text-[11px] text-muted-foreground">Wellness · 2,450 views · 182 votes</div>
          </div>
          <Badge 
            className="rounded-full text-[11px] font-semibold px-2.5 py-1"
            style={{
              background: "rgba(255, 122, 60, 0.14)",
              color: "#ffd6b7"
            }}
          >
            +75 XP
          </Badge>
        </div>

        <div className="flex gap-2.5 items-center">
          <div className="flex-1 px-2.5 py-1.5 rounded-xl bg-background/90 border border-border">
            <div className="text-[13px] font-semibold mb-0.5">Hit 10,000 Steps Before Noon</div>
            <div className="text-[11px] text-muted-foreground">Daily grind · Battle live now</div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap mt-1">
        <div className="flex-1 min-w-[120px] px-2.5 py-2 rounded-xl bg-background/85 border border-border text-[11px]">
          <div className="text-muted-foreground mb-0.5">Current challenge pool</div>
          <div className="font-semibold">12,500 coins</div>
        </div>
        <div className="flex-1 min-w-[120px] px-2.5 py-2 rounded-xl bg-background/85 border border-border text-[11px]">
          <div className="text-muted-foreground mb-0.5">Creator rewards earned</div>
          <div className="font-semibold">+2,340 coins</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-2.5">
        <span className="text-[11px] px-2.5 py-1 rounded-full border border-dashed border-white/10 text-muted-foreground">
          XP races & side-by-side battles
        </span>
        <span className="text-[11px] px-2.5 py-1 rounded-full border border-dashed border-white/10 text-muted-foreground">
          Coins only · no cash prizes
        </span>
        <span className="text-[11px] px-2.5 py-1 rounded-full border border-dashed border-white/10 text-muted-foreground">
          Report, block & safety tools built in
        </span>
      </div>
    </aside>
  );
}

function HeroSection() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-8 items-center mb-14">
      <HeroContent />
      <HeroCard />
    </main>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, label, title, description }: FeatureCardProps) {
  return (
    <Card className="p-3.5 border-border">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] text-muted-foreground text-[11px] mb-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        {label}
      </div>
      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <p className="text-muted-foreground text-[13px] leading-relaxed">{description}</p>
    </Card>
  );
}

function AboutSection() {
  return (
    <section id="about" className="mb-10">
      <h2 className="text-xl font-bold mb-2.5">What is Level Up?</h2>
      <p className="text-[13px] text-muted-foreground mb-4.5 max-w-[660px] leading-relaxed">
        Level Up is a social app built around challenges instead of scrolling.
        Users create challenges, enter battles, earn votes from the community,
        and collect in-app coins and XP. Coins are virtual items only and are
        used for rewards, upgrades, and future in-app perks.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FeatureCard 
          icon={<Users className="w-4 h-4 text-cyan-400" />}
          label="For Everyday Users"
          title="Compete and grow"
          description="Join public or sponsored challenges, submit your entries, earn votes, and climb the XP ladder. Level Up is designed to push you to get a little better every day, not just watch from the sidelines."
        />
        <FeatureCard 
          icon={<Star className="w-4 h-4 text-cyan-400" />}
          label="For Creators & Influencers"
          title="Turn attention into coin rewards"
          description="Post high-impact challenges, bring your audience, and earn in-app coins as people join, vote, and watch. Influencers get extended video length, special perks, and premium cosmetic upgrades."
        />
        <FeatureCard 
          icon={<Building2 className="w-4 h-4 text-cyan-400" />}
          label="For Sponsors & Brands"
          title="Host meaningful challenges"
          description="Create sponsored challenges with coin-based prize pools to drive engagement around your brand, product, or cause. Level Up is built to spotlight sponsors without turning into a spammy ad feed."
        />
      </div>
    </section>
  );
}

interface HowItWorksCardProps {
  number: string;
  title: string;
  items: string[];
}

function HowItWorksCard({ number, title, items }: HowItWorksCardProps) {
  return (
    <Card className="p-3.5 border-border">
      <h3 className="text-sm font-semibold mb-2">{number}. {title}</h3>
      <ul className="space-y-1.5 text-[13px] text-muted-foreground">
        {items.map((item, index) => (
          <li key={index} className="flex gap-1.5">
            <span className="text-primary mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Create or join a challenge",
      items: [
        "Browse the challenge feed by category (fitness, skills, lifestyle, fun, etc.).",
        "Create your own challenge with rules, tags, and coin rewards.",
        "Brands and sponsors can create sponsored challenges with larger coin pools."
      ]
    },
    {
      number: "2",
      title: "Battle & earn votes",
      items: [
        "Enter 1v1 battles or XP-race style challenge ladders.",
        "The community watches and votes for the better entry.",
        "Top performers earn more XP and coins over time."
      ]
    },
    {
      number: "3",
      title: "Coins, XP & upgrades",
      items: [
        "Earn coins for creating challenges, joining, and winning battles.",
        "Coins are virtual items used for in-app upgrades, cosmetics and perks.",
        "No real-money gambling, no cash betting, and transparent coin supply metrics."
      ]
    },
    {
      number: "4",
      title: "Tools for influencers & sponsors",
      items: [
        "Influencer-only perks like longer videos, higher caps, and cosmetic boosts.",
        "Sponsors can feature challenges to run campaigns or giveaways using coin rewards.",
        "All prizes are managed as in-app coins, subject to platform rules and policies."
      ]
    }
  ];

  return (
    <section id="how-it-works" className="mb-10">
      <h2 className="text-xl font-bold mb-2.5">How Level Up Works</h2>
      <p className="text-[13px] text-muted-foreground mb-4.5 max-w-[660px] leading-relaxed">
        Level Up combines social video, head-to-head battles, and an in-app coin
        system to reward participation and creativity while keeping everything
        virtual-only and safety-first.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step) => (
          <HowItWorksCard key={step.number} {...step} />
        ))}
      </div>
    </section>
  );
}

function SafetySection() {
  return (
    <section id="safety" className="mb-10">
      <h2 className="text-xl font-bold mb-2.5">Safety, Age Rating & Content Moderation</h2>
      <p className="text-[13px] text-muted-foreground mb-4.5 max-w-[660px] leading-relaxed">
        Level Up is built with community safety in mind. We do not allow
        dangerous, hateful, or illegal content. We provide clear tools for
        reporting and blocking, and we reserve the right to remove any content
        that violates our rules.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-3.5 border-border">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            Content & age guidelines
          </h3>
          <ul className="space-y-1.5 text-[13px] text-muted-foreground">
            <li className="flex gap-1.5"><span className="text-primary mt-0.5">•</span><span>Ages 13+ only, with additional restrictions for younger users where required.</span></li>
            <li className="flex gap-1.5"><span className="text-primary mt-0.5">•</span><span>No self-harm, hate, explicit sexual content, or dangerous stunts.</span></li>
            <li className="flex gap-1.5"><span className="text-primary mt-0.5">•</span><span>No real-money gambling, betting, or cash-based games of chance.</span></li>
            <li className="flex gap-1.5"><span className="text-primary mt-0.5">•</span><span>Challenges must follow all local laws and platform rules.</span></li>
          </ul>
        </Card>
        <Card className="p-3.5 border-border">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Flag className="w-4 h-4 text-cyan-400" />
            Moderation & reporting tools
          </h3>
          <ul className="space-y-1.5 text-[13px] text-muted-foreground">
            <li className="flex gap-1.5"><span className="text-primary mt-0.5">•</span><span>Report and block tools are built directly into the app experience.</span></li>
            <li className="flex gap-1.5"><span className="text-primary mt-0.5">•</span><span>Our team can remove violating content and suspend repeat offenders.</span></li>
            <li className="flex gap-1.5"><span className="text-primary mt-0.5">•</span><span>Sponsors and influencers must agree to additional guidelines.</span></li>
            <li className="flex gap-1.5"><span className="text-primary mt-0.5">•</span><span>Clear escalation paths for safety and abuse issues.</span></li>
          </ul>
        </Card>
      </div>
    </section>
  );
}

function PoliciesSection() {
  return (
    <section id="policies" className="mb-10">
      <h2 className="text-xl font-bold mb-2.5">Policies & Legal</h2>
      <p className="text-[13px] text-muted-foreground mb-4.5 max-w-[660px] leading-relaxed">
        Level Up is operated by Marshell Ventures LLC. Full legal details,
        including our Privacy Policy and Terms of Use, will be available at the
        links below as we complete our public launch.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-3.5 border-border">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Coins className="w-4 h-4 text-cyan-400" />
            Virtual coins only
          </h3>
          <p className="text-muted-foreground text-[13px] leading-relaxed">
            Level Up uses in-app virtual coins as a participation and reward
            system. Coins have no guaranteed cash value and cannot be used for
            real-money gambling. All coin usage is governed by our Terms of Use
            and in-app rules.
          </p>
        </Card>
        <Card className="p-3.5 border-border">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Heart className="w-4 h-4 text-cyan-400" />
            Privacy & terms
          </h3>
          <p className="text-muted-foreground text-[13px] leading-relaxed">
            We respect user privacy and are finalizing our full Privacy Policy
            and Terms of Use for public release. For review or pre-launch
            questions, please contact our team at{" "}
            <a href="mailto:support@joinlevelupapp.com" className="text-primary hover:underline">
              support@joinlevelupapp.com
            </a>.
          </p>
        </Card>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="mb-10">
      <h2 className="text-xl font-bold mb-2.5">Contact & Beta Access</h2>
      <p className="text-[13px] text-muted-foreground mb-4.5 max-w-[660px] leading-relaxed">
        For beta access, partnership opportunities, influencer programs, or App
        Store review questions, reach out directly. We're actively onboarding
        early users, creators, and sponsors.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-3.5 border-border">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-cyan-400" />
            Contact
          </h3>
          <ul className="space-y-1.5 text-[13px] text-muted-foreground">
            <li className="flex gap-1.5">
              <span className="text-primary mt-0.5">•</span>
              <span>Email: <a href="mailto:support@joinlevelupapp.com" className="text-primary hover:underline">support@joinlevelupapp.com</a></span>
            </li>
            <li className="flex gap-1.5"><span className="text-primary mt-0.5">•</span><span>Company: Marshell Ventures LLC</span></li>
            <li className="flex gap-1.5"><span className="text-primary mt-0.5">•</span><span>Product: Level Up – challenge-based social app</span></li>
          </ul>
        </Card>
        <Card className="p-3.5 border-border">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            Request beta access
          </h3>
          <p className="text-muted-foreground text-[13px] mb-1.5">Send us a quick note with:</p>
          <ul className="space-y-1.5 text-[13px] text-muted-foreground mb-1.5">
            <li className="flex gap-1.5"><span className="text-primary mt-0.5">•</span><span>Your name and social handles (if any).</span></li>
            <li className="flex gap-1.5"><span className="text-primary mt-0.5">•</span><span>Whether you're a user, influencer, or sponsor.</span></li>
            <li className="flex gap-1.5"><span className="text-primary mt-0.5">•</span><span>Why you'd like to join the beta.</span></li>
          </ul>
          <p className="text-muted-foreground text-[13px]">
            Email{" "}
            <a 
              href="mailto:support@joinlevelupapp.com?subject=Level%20Up%20Beta%20Access" 
              className="text-primary hover:underline"
            >
              support@joinlevelupapp.com
            </a>{" "}
            with the subject "Level Up Beta Access".
          </p>
        </Card>
      </div>
    </section>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border/50 mt-8 pt-4 text-[11px] text-muted-foreground flex flex-wrap gap-2 justify-between">
      <div>© {currentYear} Level Up · Marshell Ventures LLC</div>
      <div className="flex flex-wrap gap-3">
        <a href="#about" className="hover:text-foreground transition-colors">About</a>
        <a href="#safety" className="hover:text-foreground transition-colors">Safety</a>
        <a href="#policies" className="hover:text-foreground transition-colors">Policies</a>
        <a href="#" className="hover:text-foreground transition-colors">Privacy Policy (coming soon)</a>
        <a href="#" className="hover:text-foreground transition-colors">Terms of Use (coming soon)</a>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div 
      className="min-h-screen"
      style={{
        background: "radial-gradient(circle at top, #15152b 0, #050509 55%)"
      }}
    >
      <div className="max-w-[1120px] mx-auto px-4 py-6 pb-16">
        <Header />
        <HeroSection />
        <AboutSection />
        <HowItWorksSection />
        <SafetySection />
        <PoliciesSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
}
