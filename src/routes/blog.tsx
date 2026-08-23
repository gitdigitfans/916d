import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { getBlogPostsFn, type BlogPost } from "@/lib/admin-server";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { Section } from "@/components/qumra/Section";
import { Calendar, ArrowRight, User } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Qumra Academy" },
      { name: "description", content: "Articles, tips and updates from Qumra Academy about Quran, Arabic and Islamic studies." },
      { property: "og:title", content: "Blog — Qumra Academy" },
      { property: "og:description", content: "Articles, tips and updates from Qumra Academy." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  loader: async () => {
    try {
      return { posts: await getBlogPostsFn() };
    } catch {
      return { posts: [] as BlogPost[] };
    }
  },
  component: BlogIndex,
});

function BlogIndex() {
  const { t, lang } = useLang();
  const { posts } = Route.useLoaderData();

  return (
    <Section eyebrow="Blog" title={t.blog.title} subtitle={t.blog.subtitle} center>
      {posts.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">{t.blog.noPosts}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const title = lang === "ar" ? post.title_ar || post.title_en : post.title_en || post.title_ar;
            const excerpt = lang === "ar" ? post.excerpt_ar || post.excerpt_en : post.excerpt_en || post.excerpt_ar;
            const slug = post.slug || post.id;

            return (
              <Link
                key={post.id}
                to={`/blog/$slug`}
                params={{ slug }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/50 transition hover:border-primary/60 hover:shadow-lg"
              >
                {post.image_url && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={post.image_url}
                      alt={title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold leading-snug group-hover:text-primary">{title}</h3>
                  {excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{excerpt}</p>
                  )}
                  <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-muted-foreground">
                    {post.author && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" /> {post.author}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.created_at).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}
                    </span>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                    {t.blog.readMore} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Section>
  );
}
