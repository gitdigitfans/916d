import { createFileRoute, Link } from "@tanstack/react-router";
import { getBlogPostsFn, type BlogPost } from "@/lib/admin-server";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { Calendar, ArrowLeft, User } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  head: () => {
    const { posts } = Route.useLoaderData();
    const post = posts[0];
    if (!post) return {};
    const title = post.title_en || post.title_ar;
    return {
      meta: [
        { title: `${title} — Qumra Academy` },
        { name: "description", content: post.excerpt_en || post.excerpt_ar || title },
        { property: "og:title", content: `${title} — Qumra Academy` },
        { property: "og:description", content: post.excerpt_en || post.excerpt_ar || title },
      ],
    };
  },
  loader: async ({ params }) => {
    try {
      const posts = await getBlogPostsFn();
      return { posts };
    } catch {
      return { posts: [] as BlogPost[] };
    }
  },
  component: BlogPostDetail,
});

function BlogPostDetail() {
  const { lang } = useLang();
  const { slug } = Route.useParams();
  const { posts } = Route.useLoaderData();

  const post = posts.find((p) => (p.slug || p.id) === slug);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-muted-foreground">Post not found.</p>
        <Link to="/blog" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>
      </div>
    );
  }

  const title = lang === "ar" ? post.title_ar || post.title_en : post.title_en || post.title_ar;
  const body = lang === "ar" ? post.body_ar || post.body_en : post.body_en || post.body_ar;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        to="/blog"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to blog
      </Link>

      {post.image_url && (
        <div className="mb-8 overflow-hidden rounded-2xl">
          <img
            src={post.image_url}
            alt={title}
            className="aspect-[2/1] w-full object-cover"
          />
        </div>
      )}

      <h1 className="text-3xl font-bold leading-tight md:text-4xl">{title}</h1>

      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        {post.author && (
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" /> {post.author}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          {new Date(post.created_at).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="prose prose-lg dark:prose-invert mt-8 max-w-none whitespace-pre-wrap leading-relaxed">
        {body}
      </div>
    </article>
  );
}
