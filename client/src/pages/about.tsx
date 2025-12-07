import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Zap, 
  Shield, 
  Users, 
  Coins,
  Target,
  Star,
  Heart,
  Flag,
  Mail,
  Building2,
  Flame,
  Users2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { useLocation } from "wouter";
import logoImage from "@assets/Latest Level Up Logo_1765075167902.png";

function Logo() {
  return (
    <img 
      src={logoImage} 
      alt="Level Up Logo" 
      className="w-10 h-10 object-contain flex-shrink-0"
    />
  );
}

function Header() {
  const [, navigate] = useLocation();

  return (
    <header className="flex items-center gap-3 mb-8">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => navigate('/')}
        data-testid="button-back"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      <div className="flex items-center gap-2">
        <Logo />
        <span className="font-extrabold tracking-[0.14em] text-sm text-foreground">LEVEL UP</span>
      </div>
    </header>
  );
}

export default function AboutPage() {
  return (
    <div 
      className="min-h-screen"
      style={{
        background: "radial-gradient(ellipse at top, #1a0a2e 0%, #0d0518 40%, #050509 100%)"
      }}
    >
      <div className="max-w-[1120px] mx-auto px-4 py-6 pb-16">
        <Header />
        
        <section id="about" className="mb-10">
          <h2 className="text-2xl font-bold mb-4">About Level Up</h2>
          
          <Card className="p-4 border-border mb-6">
            <h3 className="text-base font-semibold text-green-400 mb-3">What is Level Up?</h3>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                Level Up is a competitive social platform that combines short-form video content with
                time-based battles and rewards. Post videos/images of your personal goals, challenge others to timed battles, and climb
                the leaderboard.
              </p>
              <p>
                Whether you're showing off your fitness journey, creative projects, or life
                achievements - Level Up turns every post into a chance to compete, earn rewards, and
                build your reputation.
              </p>
            </div>
          </Card>

          <Card className="p-4 border-border mb-6">
            <h3 className="text-base font-semibold text-green-400 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Time-Based Battles
            </h3>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              Challenge other users to high-stakes coin battles! Both players stake coins (minimum
              100), and compete for the most votes within a chosen time limit (5 minutes to 24 hours).
              Watch as your posts compete side-by-side in split-screen battles with a live countdown
              timer.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-green-400">•</span> <span>Choose battle duration from 5 minutes up to 24 hours</span></li>
              <li className="flex gap-2"><span className="text-green-400">•</span> <span>Most votes wins when time expires (ties result in refunds)</span></li>
              <li className="flex gap-2"><span className="text-green-400">•</span> <span><strong>Battle Creation Fee:</strong> 100 coins</span></li>
              <li className="flex gap-2"><span className="text-green-400">•</span> <span>Minimum 100 coin stake required for all battles</span></li>
              <li className="flex gap-2"><span className="text-green-400">•</span> <span>Winner gets 92.5% of total prize pool - loser loses their stake!</span></li>
              <li className="flex gap-2"><span className="text-green-400">•</span> <span>Platform takes 7.5% fee from prize pool (5% burned, 2.5% to creator treasury)</span></li>
              <li className="flex gap-2"><span className="text-green-400">•</span> <span>Build winning streaks by challenging friends repeatedly</span></li>
            </ul>
          </Card>

          <Card className="p-4 border-border mb-6">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: "#f97316" }}>
              <Flame className="w-5 h-5" />
              Winning Streaks
            </h3>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              Keep winning battles to build your winning streak! Your current streak shows
              consecutive wins, while your best streak tracks your all-time record.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-orange-400">•</span> <span><strong>Current Streak 🔥:</strong> Consecutive battle wins in a row</span></li>
              <li className="flex gap-2"><span className="text-orange-400">•</span> <span><strong>Best Streak 🏆:</strong> Your longest winning streak ever</span></li>
              <li className="flex gap-2"><span className="text-orange-400">•</span> <span>Win a battle → streak increases by 1</span></li>
              <li className="flex gap-2"><span className="text-orange-400">•</span> <span>Lose a battle → streak resets to 0</span></li>
              <li className="flex gap-2"><span className="text-orange-400">•</span> <span>Compete for longest streak on the Streaks Leaderboard</span></li>
              <li className="flex gap-2"><span className="text-orange-400">•</span> <span>Challenge your friends repeatedly to dominate the rankings!</span></li>
            </ul>
          </Card>

          <Card className="p-4 border-border mb-6">
            <h3 className="text-base font-semibold text-green-400 mb-3 flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Coin Economy
            </h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Level Up uses an in-app coin system to reward challenge creators, active players, and battle winners. Coins are used for battles, boosts, cosmetics, and other in-app features.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <p><strong className="text-foreground">Start with 1,000 coins</strong> when you join</p>
              <p><strong className="text-foreground">1 coin = $0.002</strong> (1,000 coins = $1.99)</p>
              <p><strong className="text-foreground">Battle Creation Fee:</strong> 100 coins 🔥</p>
              <p><strong className="text-foreground">Battle Stakes:</strong> Minimum 100 coins required</p>
              <p><strong className="text-foreground">Platform Fee:</strong> 7.5% from every battle (5% burned, 2.5% creator treasury)</p>
              <p><strong className="text-foreground">Winner Gets:</strong> 92.5% of the total pot (both stakes combined)</p>
              <p><strong className="text-foreground">Daily Free Earning Cap:</strong> 250 coins/day from creator rewards & votes</p>
              <p><strong className="text-foreground">Creator Rewards:</strong> Earn coins when people engage with your challenges</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-4">
              <p className="text-xs font-semibold text-green-400 mb-2">💰 Coin Packs Available:</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>Starter Pack: 1,000 coins ($1.99)</div>
                <div>Challenger Pack: 5,000 coins ($7.99)</div>
                <div>Pro Pack: 12,000 coins ($14.99)</div>
                <div>Legendary Pack: 25,000 coins ($29.99)</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-border mb-6">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: "#ec4899" }}>
              <Building2 className="w-5 h-5" />
              Creator Rewards
            </h3>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              Challenge creators earn coins when their content generates engagement. All rewards
              paid from the creator treasury (2.5% of battle fees).
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground mb-4">
              <li className="flex gap-2"><span className="text-pink-400">•</span> <span><strong>Challenge Created:</strong> +25 coins (Influencers: +50)</span></li>
              <li className="flex gap-2"><span className="text-pink-400">•</span> <span><strong>Participant Milestones:</strong> +1 coin for every 10 participants (Influencers: +2)</span></li>
              <li className="flex gap-2"><span className="text-pink-400">•</span> <span><strong>100 Votes Earned:</strong> +5 coins (Influencers: +10)</span></li>
              <li className="flex gap-2"><span className="text-pink-400">•</span> <span><strong>Battle Spawned:</strong> +50 coins (Influencers: +100)</span></li>
              <li className="flex gap-2"><span className="text-pink-400">•</span> <span><strong>Milestone (1K views):</strong> +100 coins (Influencers: +200)</span></li>
              <li className="flex gap-2"><span className="text-pink-400">•</span> <span><strong>Trending Bonus (top 1%):</strong> +250 coins (Influencers: +500)</span></li>
            </ul>
            <p className="text-xs text-muted-foreground italic">
              Note: Influencers get 2× creator rewards on standard activity. Regular users daily earnings capped at 250 coins/day. Influencers: 500 coins/day. If treasury is insufficient, rewards are queued.
            </p>
          </Card>

          <Card className="p-4 border-border mb-6">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: "#eab308" }}>
              📋 Trending Bonus Rules
            </h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              The trending bonus rewards the top 1% of challenges daily. To keep it fair, we have anti-gaming rules:
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2 mb-4">
              <p className="text-xs font-semibold text-yellow-400 mb-2">How Trending Score is Calculated:</p>
              <p className="text-xs text-muted-foreground font-mono">Trending Score = (Votes × 10) + Views</p>
              <p className="text-xs text-muted-foreground">Examples: 5 votes = 50 pts | 3 votes + 20 views = 50 pts | 50 views = 50 pts</p>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex gap-2"><span className="text-yellow-400">•</span> <span><strong>Minimum Pool:</strong> At least 10 eligible challenges must exist before any payouts</span></li>
              <li className="flex gap-2"><span className="text-yellow-400">•</span> <span><strong>No Boosted Challenges:</strong> Challenges with active boosts or visual effects are excluded</span></li>
              <li className="flex gap-2"><span className="text-yellow-400">•</span> <span><strong>Organic Votes Only:</strong> Your own votes on your challenge don't count toward trending score</span></li>
              <li className="flex gap-2"><span className="text-yellow-400">•</span> <span><strong>Minimum Score:</strong> Must earn 50+ trending points to qualify (about 5 organic votes)</span></li>
              <li className="flex gap-2"><span className="text-yellow-400">•</span> <span><strong>One-Time Per Challenge:</strong> Each challenge can only earn the trending bonus once</span></li>
            </ul>
            <p className="text-xs text-muted-foreground italic mt-3">
              Calculated daily at midnight UTC. Only challenges created in the last 7 days are eligible.
            </p>
          </Card>

          <Card className="p-4 border-border mb-6">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: "#eab308" }}>
              🏆 XP & Progression System
            </h3>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              Rise through 5 competitive tiers based on your XP. Create content, vote, battle, and
              climb the ranks!
            </p>
            <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-3 mb-4">
              <p className="text-xs font-semibold text-green-400 mb-2">⭐ Creator XP Bonus</p>
              <p className="text-xs text-muted-foreground">
                Creators earn +1 XP for every vote their challenge receives! The more engaging your content, the faster you level up. This is your reward for creating content the community loves.
              </p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <p><strong>Vote on Challenges:</strong> +1 XP per 100 votes you cast</p>
              <p><strong>Vote on Battles:</strong> +1 XP per 100 battle votes you cast</p>
              <p><strong>Battle Victory:</strong> +50 XP for winning a battle</p>
              <p><strong>Battle Participation:</strong> +10 XP just for competing (even if you lose)</p>
              <p><strong>Streak Breaker Bonus:</strong> +150 XP when you break an opponent's 3+ win streak</p>
              <p><strong>Share Content:</strong> +25 XP every time you share a challenge or battle</p>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p>🌱 <strong>Beginner</strong> (0-499 XP)</p>
              <p>⚡ <strong>Challenger</strong> (500-1,499 XP)</p>
              <p>🔥 <strong>Contender</strong> (1.5K-3,499 XP)</p>
              <p>🏅 <strong>Champion</strong> (3.5K-6,999 XP)</p>
              <p>👑 <strong>Legendary</strong> (7K+ XP)</p>
            </div>
          </Card>

          <Card className="p-4 border-border mb-6">
            <h3 className="text-base font-semibold text-green-400 mb-3 flex items-center gap-2">
              <Users2 className="w-5 h-5" />
              Social Features
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-green-400">•</span> <span><strong>Friend Requests:</strong> Connect with other users</span></li>
              <li className="flex gap-2"><span className="text-green-400">•</span> <span><strong>Follow System:</strong> Follow your favorite creators</span></li>
              <li className="flex gap-2"><span className="text-green-400">•</span> <span><strong>Notifications:</strong> Get alerted for battles, friend requests, and more</span></li>
              <li className="flex gap-2"><span className="text-green-400">•</span> <span><strong>Profile Pages:</strong> Upload custom avatars, view stats, check battle history</span></li>
            </ul>
          </Card>

          <Card className="p-4 border-border mb-6">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: "#f97316" }}>
              <Flame className="w-5 h-5" />
              Influencers & OG Influencers
            </h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Influencers are the power users of Level Up. Upgrade to unlock bigger uploads,
              bigger rewards, and battle tools that regular users will never see.
            </p>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-4 space-y-3">
              <p className="text-sm font-semibold text-purple-400">⭐ Influencer Perks ($9.99/month)</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" /> <span><strong>3-minute uploads</strong> (regular users capped at 60 seconds)</span></li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" /> <span><strong>2× creator rewards</strong> on standard activity (joins, votes, battles, views, trending)</span></li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" /> <span><strong>500 coin/day earning cap</strong> (regular users: 250 coins/day)</span></li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" /> <span><strong>Creator Insights card</strong> on your profile showing challenges, rewards, and battle performance</span></li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" /> <span><strong>Premium Profile Cosmetics</strong> – Access exclusive visual customizations like the Cosmic Aura Pack (gradient avatar borders, username glow effects)</span></li>
              </ul>
            </div>

            <div className="bg-purple-600/20 border border-purple-500/40 rounded-lg p-4 space-y-4">
              <p className="text-sm font-semibold text-purple-300 mb-2">⚔️ Battle Tools Tray (accessible during active battles, participant-only):</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-purple-300 font-semibold flex-shrink-0">⚡ Power Votes</span>
                  <span>– Activate for 5 minutes! Every vote you cast hits at 2x, 5x, or 10x power (200-1000 coins)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-300 font-semibold flex-shrink-0">🚀 Battle Boost</span>
                  <span>– Pin your battle to the top of the feed for 60 minutes (250 coins)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-300 font-semibold flex-shrink-0">🛡️ Battle Shield</span>
                  <span>– Activate 12-hour aura to block all battle callouts under 5,000 coins (150 coins per activation, continuous protection)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-300 font-semibold flex-shrink-0">🎧 SFX Toggle</span>
                  <span>– Mute/unmute battle sound effects</span>
                </li>
              </ul>

              <p className="text-sm font-semibold text-orange-300 mt-3 mb-2">🔥 Power Up Tools (to promote your challenges):</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-orange-300 font-semibold flex-shrink-0">🚀 Visibility Boost</span>
                  <span>– Pin your challenge to the top of the home feed for 30 minutes (500 coins)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-300 font-semibold flex-shrink-0">✨ Vote Magnet</span>
                  <span>– Add sparkle effects and a special badge to attract more votes for 24 hours (300 coins)</span>
                </li>
              </ul>
            </div>

            <Card className="p-4 border-yellow-500/40 bg-yellow-500/5 mt-4">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: "#eab308" }}>
                👑 OG Influencers (First 2,000 Only)
              </h4>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                The first 2,000 Influencers unlock permanent OG status with exclusive perks:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: "#3b82f6" }} /> <span><strong>5,000 bonus coins every month for 6 months</strong> (30,000 total value)</span></li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: "#3b82f6" }} /> <span><strong>Exclusive OG badge and crown</strong></span></li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: "#3b82f6" }} /> <span><strong>Special glowing profile frame</strong></span></li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: "#3b82f6" }} /> <span><strong>"OG Influencer" status in profile & UI</strong></span></li>
              </ul>
              <p className="text-xs text-muted-foreground italic mt-3">
                As we add ads and sponsored challenges, influencers stay on the inside track with early access to new tools and experiments.
              </p>
            </Card>
          </Card>

          <Card className="p-4 border-border mb-6">
            <h3 className="text-base font-semibold text-green-400 mb-3 flex items-center gap-2">
              🏢 Sponsor Program
            </h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Run sponsored challenges with real coin prize pools. Sponsors can create branded
              challenges where coins are escrowed and automatically paid out to the winner when
              the challenge ends.
            </p>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
              <p className="text-sm font-semibold text-yellow-400 mb-2">⚠️ Requirements</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex gap-2"><span className="text-yellow-400">•</span> <span>Must be an Influencer member before accessing Sponsor Program</span></li>
                <li className="flex gap-2"><span className="text-yellow-400">•</span> <span><strong>Minimum prize pool:</strong> 25,000 coins per sponsored challenge</span></li>
                <li className="flex gap-2"><span className="text-yellow-400">•</span> <span>Coins are locked in escrow when challenge is created</span></li>
                <li className="flex gap-2"><span className="text-yellow-400">•</span> <span>Winner receives prize pool automatically when challenge ends</span></li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="border border-green-500/40 bg-green-500/5 rounded-lg p-3">
                <p className="text-sm font-semibold text-green-400 mb-2">🌱 Starter Sponsor - $49/month</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" /> <span>1 active sponsored challenge at a time</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" /> <span>Sponsored badge on challenge cards</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" /> <span>Small banner on challenge detail page</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" /> <span>Basic stats (views, entries, winner)</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" /> <span>Coin prize pool escrow & automatic payout</span></li>
                </ul>
              </div>

              <div className="border border-blue-500/40 bg-blue-500/5 rounded-lg p-3">
                <p className="text-sm font-semibold text-blue-400 mb-2">⚡ Pro Sponsor - $149/month</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" /> <span>Everything in Starter</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" /> <span>Up to 3 active sponsored challenges</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" /> <span>Higher feed priority among sponsored challenges</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" /> <span>Join-screen sponsor intro card</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" /> <span>10,000 bonus coins per month</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" /> <span>Expanded stats: entries, unique participants, votes</span></li>
                </ul>
              </div>

              <div className="border border-purple-500/40 bg-purple-500/5 rounded-lg p-3">
                <p className="text-sm font-semibold text-purple-400 mb-2">👑 Elite Sponsor - $399/month</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" /> <span>Everything in Pro</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" /> <span>Up to 5 active sponsored challenges</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" /> <span>Featured Sponsor tile in challenge discovery</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" /> <span>30,000 bonus coins per month</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" /> <span>Slot for short sponsor intro video (muted auto-play)</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" /> <span>"Elite Sponsor" badge on cards</span></li>
                </ul>
              </div>
            </div>

            <p className="text-xs text-muted-foreground italic mt-4">
              Note: All tiers require Influencer membership ($9.99/mo) as a prerequisite. Sponsored challenge coins are held in escrow until the challenge ends, then distributed to the winner.
            </p>
          </Card>

          <Card className="p-4 border-border mb-6">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: "#ef4444" }}>
              <Shield className="w-5 h-5" />
              Community Guidelines & Moderation Policy
            </h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Level Up is committed to maintaining a safe and respectful community. We enforce a
              strict 3-strike moderation policy to ensure all users can enjoy the platform.
            </p>

            <div className="space-y-3 mb-4">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-sm font-semibold text-yellow-400">Strike 1: 24-Hour Suspension</p>
                <p className="text-sm text-muted-foreground">First offense results in a 24-hour temporary ban from the platform.</p>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                <p className="text-sm font-semibold text-orange-400">Strike 2: 3-Day Suspension</p>
                <p className="text-sm text-muted-foreground">Second offense results in a 3-day temporary ban from the platform.</p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-sm font-semibold text-red-400">Strike 3: Permanent Ban</p>
                <p className="text-sm text-muted-foreground">Third offense results in permanent removal from Level Up.</p>
              </div>

              <div className="bg-red-900/20 border border-red-500/40 rounded-lg p-3">
                <p className="text-sm font-semibold text-red-400 mb-2">Severe Violations</p>
                <p className="text-sm text-muted-foreground">
                  Level Up reserves the right to permanently ban users immediately for severe violations
                  of our community guidelines, including but not limited to: illegal content, threats of
                  violence, harassment, hate speech, content involving minors, or any content that
                  endangers user safety.
                </p>
              </div>
            </div>

            <p className="text-sm font-semibold mb-2">Prohibited Content Includes:</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground mb-4">
              <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> <span>Dangerous acts or challenges that could cause harm</span></li>
              <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> <span>Harassment, bullying, or targeted abuse</span></li>
              <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> <span>Hate speech or discrimination</span></li>
              <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> <span>Sexual or explicit content</span></li>
              <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> <span>Content involving or exploiting minors</span></li>
              <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> <span>Self-harm or suicide promotion</span></li>
              <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> <span>Spam, scams, or misleading content</span></li>
              <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> <span>Copyright infringement</span></li>
              <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> <span>Privacy violations</span></li>
              <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> <span>Violent or graphic content</span></li>
              <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> <span>Illegal activities</span></li>
            </ul>
            <p className="text-xs text-muted-foreground italic">
              Users can report content via the Help & Support page or by using the report button on any content. All reports are reviewed by our moderation team.
            </p>
          </Card>
        </section>

        <footer className="border-t border-border/50 mt-8 pt-4 text-[11px] text-muted-foreground flex flex-wrap gap-2 justify-between">
          <div>© {new Date().getFullYear()} Level Up · Marshell Ventures LLC</div>
          <div className="flex flex-wrap gap-3">
            <a href="/" className="hover:text-foreground transition-colors">Home</a>
            <a href="/about" className="hover:text-foreground transition-colors">About</a>
            <a href="/" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
