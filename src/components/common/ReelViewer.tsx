import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatPrice } from "@/lib/format";
import type { Reel } from "@/types";

interface ReelViewerProps {
  reels: Reel[];
  startIndex: number;
  onClose: () => void;
}

/** Full-screen, Instagram-Stories-style viewer: autoplay, swipe/arrow/keyboard navigation. */
export function ReelViewer({ reels, startIndex, onClose }: ReelViewerProps) {
  const [index, setIndex] = useState(startIndex);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartX = useRef<number | null>(null);

  const reel = reels[index];
  const hasPrev = index > 0;
  const hasNext = index < reels.length - 1;

  const goNext = () => (hasNext ? setIndex((i) => i + 1) : onClose());
  const goPrev = () => hasPrev && setIndex((i) => i - 1);

  // (Re)start playback whenever the active reel changes. Browsers often block
  // autoplay-with-sound outside a direct user gesture — fall back to muted if so.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setProgress(0);
    video.currentTime = 0;
    video.muted = muted;
    video.play().catch(() => {
      video.muted = true;
      setMuted(true);
      video.play().catch(() => {});
    });
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, hasNext, hasPrev]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        hideCloseButton
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="inset-0 h-dvh w-screen max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-0 bg-black p-0"
      >
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          {/* Story-style progress segments */}
          <div className="absolute inset-x-3 top-3 z-20 flex gap-1">
            {reels.map((r, i) => (
              <div key={r._id} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
                <div
                  className="h-full bg-white"
                  style={{ width: i < index ? "100%" : i === index ? `${progress}%` : "0%" }}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-8 z-20 grid size-9 place-items-center rounded-full bg-black/50 text-white"
          >
            ✕
          </button>

          {hasPrev && (
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous reel"
              className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-black/40 p-2 text-white sm:grid sm:place-items-center"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}
          {hasNext && (
            <button
              type="button"
              onClick={goNext}
              aria-label="Next reel"
              className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-black/40 p-2 text-white sm:grid sm:place-items-center"
            >
              <ChevronRight className="size-6" />
            </button>
          )}

          <div
            className="relative h-full max-h-dvh w-full max-w-[min(100vw,calc(100dvh*9/16))]"
            onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const delta = e.changedTouches[0].clientX - touchStartX.current;
              if (delta > 60) goPrev();
              else if (delta < -60) goNext();
              touchStartX.current = null;
            }}
          >
            <video
              key={reel._id}
              ref={videoRef}
              src={reel.video.url}
              playsInline
              autoPlay
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.duration) setProgress((v.currentTime / v.duration) * 100);
              }}
              onEnded={goNext}
              onClick={(e) =>
                e.currentTarget.paused ? e.currentTarget.play() : e.currentTarget.pause()
              }
              className="size-full cursor-pointer object-contain"
            />

            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="absolute bottom-24 right-3 z-20 grid size-9 place-items-center rounded-full bg-black/50 text-white sm:bottom-6"
            >
              {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>

            {(reel.caption || reel.product) && (
              <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12 text-primary-foreground">
                {reel.caption && <p className="text-sm leading-snug">{reel.caption}</p>}
                {reel.product && (
                  <Link
                    to={`/product/${reel.product.slug}`}
                    onClick={onClose}
                    className="mt-3 flex items-center gap-3 bg-white/10 p-2 backdrop-blur-sm"
                  >
                    {reel.product.images[0] && (
                      <img
                        src={reel.product.images[0].url}
                        alt=""
                        className="size-10 shrink-0 object-cover"
                      />
                    )}
                    <span className="min-w-0 flex-1 truncate text-xs font-semibold">
                      {reel.product.name}
                    </span>
                    <span className="shrink-0 text-xs font-bold text-brick">
                      {formatPrice(reel.product.basePrice)}
                    </span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
