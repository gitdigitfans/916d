import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { ContactProvider } from "@/lib/i18n/ContactProvider";
import { Header } from "@/components/qumra/Header";
import { Footer } from "@/components/qumra/Footer";
import { FloatingWhatsApp } from "@/components/qumra/FloatingWhatsApp";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try refreshing or head back home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Qumra Academy — Learn Quran, Arabic & Islamic Studies Online" },
      {
        name: "description",
        content:
          "Qumra Academy is a global online platform for learning the Holy Quran, Arabic, and Islamic Studies with certified teachers, one-to-one live classes, and flexible schedules.",
      },
      { name: "author", content: "Qumra Academy" },
      { property: "og:site_name", content: "Qumra Academy" },
      {
        property: "og:title",
        content: "Qumra Academy — Learn Quran, Arabic & Islamic Studies Online",
      },
      {
        property: "og:description",
        content:
          "Qumra Academy is a global online platform for learning the Holy Quran, Arabic, and Islamic Studies with certified teachers, one-to-one live classes, and flexible schedules.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Qumra Academy — Learn Quran, Arabic & Islamic Studies Online",
      },
      {
        name: "twitter:description",
        content:
          "Qumra Academy is a global online platform for learning the Holy Quran, Arabic, and Islamic Studies with certified teachers, one-to-one live classes, and flexible schedules.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/329513bd-6d1b-45de-914d-54a296fc99c2/id-preview-6979755e--e1d91e25-29f1-41e0-b34d-f7e50b736d1c.lovable.app-1783596422834.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/329513bd-6d1b-45de-914d-54a296fc99c2/id-preview-6979755e--e1d91e25-29f1-41e0-b34d-f7e50b736d1c.lovable.app-1783596422834.png",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "Qumra Academy",
          alternateName: "أكاديمية قمرة",
          description: "Global online academy for Quran, Arabic, and Islamic Studies.",
          email: "info@qumraacademy.com",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ContactProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer />
            <FloatingWhatsApp />
          </div>
        </ContactProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
