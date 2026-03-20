import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { SiApple, SiAndroid } from "react-icons/si";
import { ArrowLeft, Play } from "lucide-react";
import { supabase } from "@/lib/supabase";
import logoImage from "@assets/Latest Level Up Logo_1765078481170.png";

type Challenge = {
  id: string;
  title?: string;
  description?: string;
  /** Static WebP thumbnail — first priority for preview image */
  thumb_url?: string;
  /** Original media file (may be JPEG/video) — fallback preview */
  media_url?: string;
};

const APP_STORE_URL = "https://apps.apple.com/us/app/level-up-challenges/id6754522127";
const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.marshellventures.levelup";

export default function ChallengePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    async function fetchChallenge() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("challenges")
          .select("id, title, description, thumb_url, media_url")
          .eq("id", id)
          .single();

        if (error || !data) {
          setNotFound(true);
        } else {
          setChallenge(data);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchChallenge();
  }, [id]);

  const VIDEO_EXTS = /\.(mp4|mov|webm|m4v|avi|mkv)(\?|$)/i;

  const title = challenge?.title ?? "Level Up Challenge";
  const description = challenge?.description ?? "Join this challenge on Level Up. Compete, vote, and earn coins & XP.";
  // Image is served through the server-side proxy which handles storage resolution
  // using SUPABASE_STORAGE_URL/SUPABASE_STORAGE_KEY (separate from the website's auth project).
  // The proxy applies priority internally: thumb_url → media_url → branded fallback.
  const previewImage = challenge && id ? `/api/challenge-og-image?id=${id}` : null;
  // Play button only when no static thumbnail exists and the raw media file is a video
  const isVideo = VIDEO_EXTS.test(challenge?.media_url ?? "") && !challenge?.thumb_url;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "radial-gradient(ellipse at top, #1a0a2e 0%, #0d0518 40%, #050509 100%)",
      }}
    >
      <header className="flex items-center justify-between px-4 py-4 max-w-2xl mx-auto w-full">
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-back-home"
        >
          <ArrowLeft className="w-4 h-4" />
          Level Up
        </button>
        <img
          src={logoImage}
          alt="Level Up"
          className="w-8 h-8 object-contain"
        />
      </header>

      <main className="flex-1 flex flex-col items-center justify-start px-4 pt-4 pb-16 max-w-2xl mx-auto w-full">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Loading challenge...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full mb-6">
              {previewImage ? (
                <div className="relative w-full rounded-2xl overflow-hidden bg-black/40"
                  style={{ aspectRatio: "16/9" }}
                >
                  <img
                    src={previewImage}
                    alt={title}
                    className="w-full h-full object-cover"
                    data-testid="challenge-preview-image"
                  />
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur flex items-center justify-center border border-white/20">
                        <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="relative w-full rounded-2xl flex items-center justify-center border border-white/10"
                  style={{
                    aspectRatio: "16/9",
                    background: "linear-gradient(135deg, #1a0a2e 0%, #0d0518 60%, #1a0a2e 100%)",
                  }}
                >
                  <img
                    src={logoImage}
                    alt="Level Up"
                    className="w-24 h-24 object-contain opacity-60"
                  />
                </div>
              )}
            </div>

            <div className="w-full mb-8 text-center">
              {notFound ? (
                <>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Challenge Not Found</h1>
                  <p className="text-muted-foreground text-sm">
                    This challenge may have ended or been removed. Download Level Up to find more challenges.
                  </p>
                </>
              ) : (
                <>
                  <h1
                    className="text-2xl font-bold text-foreground mb-2 leading-tight"
                    data-testid="text-challenge-title"
                  >
                    {title}
                  </h1>


                  {description && (
                    <p
                      className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto"
                      data-testid="text-challenge-description"
                    >
                      {description}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="w-full max-w-sm mx-auto space-y-3 mb-8">
              <p className="text-xs text-muted-foreground text-center mb-1">
                Open the Level Up app to view this challenge
              </p>

              <Button
                className="w-full rounded-full py-3 font-semibold text-base text-black border-0"
                style={{
                  background: "linear-gradient(135deg, #00d4ff 0%, #6366f1 50%, #a855f7 100%)",
                  boxShadow: "0 0 30px rgba(99, 102, 241, 0.5)",
                }}
                data-testid="button-open-in-app"
                onClick={() => {
                  window.location.href = APP_STORE_URL;
                }}
              >
                Open in App
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="rounded-full py-2.5 font-semibold text-sm text-black border-0"
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #e5e5ea 100%)",
                    boxShadow: "0 0 20px rgba(229, 229, 234, 0.3)",
                  }}
                  data-testid="button-ios-appstore"
                  onClick={() => window.open(APP_STORE_URL, "_blank", "noopener,noreferrer")}
                >
                  <SiApple className="w-4 h-4 mr-1.5" />
                  App Store
                </Button>
                <Button
                  className="rounded-full py-2.5 font-semibold text-sm text-black border-0"
                  style={{
                    background: "#22c55e",
                    boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)",
                  }}
                  data-testid="button-google-play"
                  onClick={() => window.open(GOOGLE_PLAY_URL, "_blank", "noopener,noreferrer")}
                >
                  <SiAndroid className="w-4 h-4 mr-1.5" />
                  Google Play
                </Button>
              </div>
            </div>

            <div className="w-full max-w-sm mx-auto pt-6 border-t border-border/30">
              <div className="flex items-center justify-center gap-3 mb-3">
                <img src={logoImage} alt="Level Up" className="w-8 h-8 object-contain" />
                <span className="font-extrabold tracking-[0.14em] text-sm text-foreground">LEVEL UP</span>
              </div>
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                The challenge-based social platform. Compete, vote, earn coins & XP, and build your reputation.
              </p>
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-border/30 py-4 text-center">
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <a href="/" className="hover:text-foreground transition-colors">Home</a>
          <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="mailto:support@joinlevelupapp.com" className="hover:text-foreground transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}
