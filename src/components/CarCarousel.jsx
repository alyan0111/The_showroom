import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useState, useEffect } from "react";
import logo from "../assets/logo.png";

// ─── Carousel Component ───────────────────────────────────────────────────────
function CarCarousel({ images }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#00f5ff]/10 shadow-[0_0_60px_#ff2d9b20] group">
      {/* Embla Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((src, i) => (
            <div
              key={i}
              className="relative min-w-full h-64 md:h-96 flex-shrink-0"
            >
              <img
                src={src}
                alt={`Car view ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = logo;
                }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a2e]/60 via-transparent to-transparent" />
              {/* Slide counter */}
              <div className="absolute bottom-3 right-4 text-xs text-white/60 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                {i + 1} / {images.length}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev Button */}
      <button
        onClick={scrollPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10
                   w-10 h-10 rounded-full
                   bg-black/50 border border-[#ff2d9b]/40
                   text-white backdrop-blur-sm
                   flex items-center justify-center
                   hover:bg-[#ff2d9b] hover:border-[#ff2d9b]
                   transition-all duration-200
                   opacity-0 group-hover:opacity-100"
        aria-label="Previous image"
      >
        ‹
      </button>

      {/* Next Button */}
      <button
        onClick={scrollNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10
                   w-10 h-10 rounded-full
                   bg-black/50 border border-[#ff2d9b]/40
                   text-white backdrop-blur-sm
                   flex items-center justify-center
                   hover:bg-[#ff2d9b] hover:border-[#ff2d9b]
                   transition-all duration-200
                   opacity-0 group-hover:opacity-100"
        aria-label="Next image"
      >
        ›
      </button>

      {/* Dot Indicators */}
      <DotIndicators emblaApi={emblaApi} count={images.length} />
    </div>
  );
}

// ─── Dot Indicators ───────────────────────────────────────────────────────────
function DotIndicators({ emblaApi, count }) {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => emblaApi && emblaApi.scrollTo(i)}
          className={`rounded-full transition-all duration-300 ${
            i === selected
              ? "w-5 h-2 bg-[#ff2d9b]"
              : "w-2 h-2 bg-white/30 hover:bg-white/60"
          }`}
        />
      ))}
    </div>
  );
}

export default CarCarousel;