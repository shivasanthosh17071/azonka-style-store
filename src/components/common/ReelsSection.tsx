import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ReelViewer } from "@/components/common/ReelViewer";
import { useReels } from "@/hooks/queries/useReels";
import { videoPosterUrl } from "@/lib/cloudinary";
import type { Reel } from "@/types";

function ReelTile({ reel, onOpen }: { reel: Reel; onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
      className="group relative aspect-[9/16] w-40 shrink-0 snap-start overflow-hidden bg-ink text-left sm:w-48"
    >
      <video
        ref={videoRef}
        src={reel.video.url}
        poster={videoPosterUrl(reel.video.url)}
        muted
        loop
        playsInline
        preload="metadata"
        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-black/50 text-primary-foreground">
        <Play className="size-3.5 fill-current" />
      </div>
      {reel.caption && (
        <p className="absolute inset-x-0 bottom-0 p-3 text-xs font-medium leading-snug text-primary-foreground">
          {reel.caption}
        </p>
      )}
    </button>
  );
}

export function ReelsSection() {
  const { data: reels } = useReels();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  if (!reels?.length) return null;

  return (
    <section className="border-b border-line bg-paper py-16 sm:py-24">
      <div className="section-wrap">
        <SectionHeading
          eyebrow="In motion"
          title="Reels"
          copy="A closer look at the fit, the fabric and the styling — straight from us."
        />
        <div className="no-scrollbar mt-10 flex snap-x gap-4 overflow-x-auto pb-2">
          {reels.map((reel, i) => (
            <ReelTile key={reel._id} reel={reel} onOpen={() => setViewerIndex(i)} />
          ))}
        </div>
      </div>

      {viewerIndex !== null && (
        <ReelViewer reels={reels} startIndex={viewerIndex} onClose={() => setViewerIndex(null)} />
      )}
    </section>
  );
}
