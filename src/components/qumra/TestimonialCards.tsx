import { useEffect, useRef, useState } from "react";
import { Quote, Star } from "lucide-react";
import { useLang } from "@/lib/i18n/LanguageProvider";
import type { Testimonial } from "@/lib/admin-server";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => Array.from(w)[0] ?? "")
    .join("")
    .toUpperCase();
}

function Stars() {
  return (
    <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function Avatar({ image, name, className }: { image: string; name: string; className?: string }) {
  const size = className ? "" : "h-14 w-14";
  if (image) {
    return (
      <img
        src={image}
        alt={name || "Student"}
        className={cn("shrink-0 rounded-full border-2 border-primary/30 object-cover", size, className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 text-sm font-bold text-primary",
        size,
        className,
      )}
    >
      {initials(name) || <Quote className="h-4 w-4" />}
    </div>
  );
}

function TestimonialCard({ name, text, image }: { name: string; text: string; image: string }) {
  return (
    <figure className="flex h-full flex-col items-center rounded-3xl border border-border bg-surface/50 p-8 text-center sm:p-10">
      <Stars />
      <blockquote className="mt-6 flex-1 text-lg leading-relaxed text-foreground sm:text-xl">
        {text ? `"${text}"` : "Watch the video to hear what this student says about Qumra Academy."}
      </blockquote>
      <figcaption className="mt-7 flex items-center gap-3">
        <Avatar image={image} name={name} className="h-16 w-16" />
        <div className="text-left">
          <p className="text-base font-semibold text-primary">{name}</p>
          <p className="text-sm text-muted-foreground">Verified Student</p>
        </div>
      </figcaption>
    </figure>
  );
}

export function TestimonialCards({ items }: { items?: Testimonial[] }) {
  const { t, lang } = useLang();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const activeRef = useRef<HTMLButtonElement>(null);

  const fallback = t.testimonials.items.map((it) => ({ name: it.a, text: it.q, image: "" }));
  const cards = !items
    ? fallback
    : items
        .filter((it) => !(it.video_url && it.video_url.trim() !== ""))
        .map((it) => ({
          name: lang === "ar" ? it.name_ar : it.name_en,
          text: lang === "ar" ? it.text_ar : it.text_en,
          image: it.image_url,
        }));

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [current]);

  if (cards.length === 0) return null;

  return (
    <div className="w-full">
      <Carousel className="w-full" opts={{ loop: cards.length > 1, align: "center" }} setApi={setApi}>
        <CarouselContent>
          {cards.map((c, i) => (
            <CarouselItem key={i} className="basis-full sm:basis-4/5 lg:basis-3/4">
              <TestimonialCard name={c.name} text={c.text} image={c.image} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="max-sm:hidden" />
        <CarouselNext className="max-sm:hidden" />
      </Carousel>

      {cards.length > 1 && (
        <div className="mt-10 overflow-x-auto px-2 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center justify-center gap-3">
            {cards.map((c, i) => {
              const active = i === current;
              return (
                <button
                  key={i}
                  ref={active ? activeRef : undefined}
                  onClick={() => api?.scrollTo(i)}
                  className={cn(
                    "group flex flex-col items-center gap-1.5 transition",
                    active ? "opacity-100" : "opacity-60 hover:opacity-90",
                  )}
                  aria-label={c.name}
                >
                  <Avatar
                    image={c.image}
                    name={c.name}
                    className={cn(
                      "h-14 w-14 transition",
                      active ? "border-primary ring-2 ring-primary/40" : "border-border/60",
                    )}
                  />
                  <span className="max-w-24 truncate text-[11px] font-medium text-muted-foreground">
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
