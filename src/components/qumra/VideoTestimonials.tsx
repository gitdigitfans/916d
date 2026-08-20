import video from "@/assets/qumra/qumra-intro.mp4.asset.json";
import { useLang } from "@/lib/i18n/LanguageProvider";
import type { Testimonial } from "@/lib/admin-server";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function VideoTestimonials({ items }: { items?: Testimonial[] }) {
  const { t, lang } = useLang();
  const videos = (items ?? []).filter((it) => it.video_url && it.video_url.trim() !== "");
  const hasVideos = videos.length > 0;

  const slides: { video: string; name?: string; text?: string; intro?: boolean }[] = [
    { video: video.url, intro: true },
    ...videos.map((it) => ({
      video: it.video_url,
      name: lang === "ar" ? it.name_ar : it.name_en,
      text: lang === "ar" ? it.text_ar : it.text_en,
    })),
  ];

  return (
    <section className="border-y border-border/50 bg-gradient-to-b from-surface/20 via-background to-surface/20 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {hasVideos ? t.videos.eyebrow : "Intro"}
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            {hasVideos ? t.videos.title : t.courses.intro.title}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {hasVideos ? t.videos.subtitle : t.courses.intro.subtitle}
          </p>
        </div>

        <Carousel
          className="mx-auto w-full max-w-lg"
          opts={{ loop: slides.length > 1, align: "center" }}
        >
          <CarouselContent>
            {slides.map((c, i) => (
              <CarouselItem key={i} className="basis-full">
                <figure className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface/50">
                  <Media url={c.video} />
                  {c.intro ? (
                    <figcaption className="p-4 text-center">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {t.courses.intro.subtitle}
                      </p>
                    </figcaption>
                  ) : (
                    <figcaption className="flex flex-col justify-between gap-2 p-4">
                      {c.text ? (
                        <p className="text-sm leading-relaxed text-foreground">"{c.text}"</p>
                      ) : (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          Watch the video to hear what this student says about Qumra Academy.
                        </p>
                      )}
                      {c.name && (
                        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                          {c.name}
                        </p>
                      )}
                    </figcaption>
                  )}
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="max-sm:hidden" />
          <CarouselNext className="max-sm:hidden" />
        </Carousel>
      </div>
    </section>
  );
}

function videoEmbed(url: string) {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/))([\w-]{11})|youtu\.be\/([\w-]{11})/,
  );
  if (m) return { type: "youtube" as const, id: m[1] || m[2] };
  return { type: "file" as const, url };
}

function Media({ url }: { url: string }) {
  const emb = videoEmbed(url);
  if (emb.type === "youtube") {
    return (
      <div className="aspect-video overflow-hidden">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${emb.id}`}
          title="Student opinion video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <video
      src={url}
      controls
      playsInline
      preload="metadata"
      className="aspect-video w-full bg-black object-contain"
    />
  );
}
