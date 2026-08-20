import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { isAdminFn, loginFn, logoutFn } from "@/lib/admin-server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import {
  BadgeDollarSign,
  CalendarDays,
  GraduationCap,
  HelpCircle,
  Home,
  Inbox,
  LayoutDashboard,
  Link2,
  Lock,
  LogOut,
  MessageSquareQuote,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

function AdminLayout() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  if (authed === null) {
    return <AuthCheck onDone={setAuthed} />;
  }

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />;
  }

  const nav = [
    { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
    { to: "/admin/site", label: "Home Page", Icon: Home },
    { to: "/admin/catalog", label: "Courses & Pricing", Icon: BadgeDollarSign },
    { to: "/admin/testimonials", label: "Testimonials", Icon: MessageSquareQuote },
    { to: "/admin/teachers", label: "Teachers", Icon: GraduationCap },
    { to: "/admin/contact", label: "Contact Info", Icon: Link2 },
    { to: "/admin/faqs", label: "FAQ", Icon: HelpCircle },
    { to: "/admin/policies", label: "Policies", Icon: ShieldCheck },
    { to: "/admin/students", label: "Students", Icon: Users },
    { to: "/admin/lessons", label: "Lessons", Icon: CalendarDays },
    { to: "/admin/bookings", label: "Bookings", Icon: Inbox },
    { to: "/admin/settings", label: "Settings", Icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-surface/20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold">
            <span className="rounded-lg bg-primary px-2 py-1 text-primary-foreground">Qumra</span>
            <span className="hidden sm:inline">Admin Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xs font-medium text-muted-foreground hover:text-primary">
              View site
            </Link>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                await logoutFn();
                setAuthed(false);
              }}
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-1.5">
            {nav.map(({ to, label, Icon, exact }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: !!exact }}
                activeProps={{ className: "bg-primary text-primary-foreground" }}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-primary/10 hover:text-primary"
              >
                <Icon className="h-4 w-4" /> {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

function AuthCheck({ onDone }: { onDone: (v: boolean) => void }) {
  useState(() => {
    isAdminFn()
      .then(onDone)
      .catch(() => onDone(false));
  });
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const ok = await loginFn({ data: { email, password } });
      if (ok) {
        toast.success("Welcome back");
        onSuccess();
      } else {
        toast.error("Wrong email or password");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface/20 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-border bg-background p-8 shadow-xl"
      >
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="text-center text-xl font-bold">Admin Login</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">Qumra Academy Dashboard</p>
        <div className="mt-6 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="em">Email</Label>
            <Input
              id="em"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              autoComplete="username"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw">Password</Label>
            <Input
              id="pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
        </div>
        <Button type="submit" className="mt-4 w-full" disabled={busy || !email || !password}>
          {busy ? "Checking…" : "Login"}
        </Button>
      </form>
    </div>
  );
}
