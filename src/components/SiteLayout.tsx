import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { user, signOut } = useAuth();
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-40">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <Activity className="h-5 w-5 text-primary" />
          <span>DiabetesRisk</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2 text-sm">
          <Link
            to="/assessment"
            className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent"
            activeProps={{ className: "rounded-md px-3 py-2 text-foreground bg-accent" }}
          >
            Assessment
          </Link>
          {user && (
            <Link
              to="/history"
              className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent"
              activeProps={{ className: "rounded-md px-3 py-2 text-foreground bg-accent" }}
            >
              History
            </Link>
          )}
          <Link
            to="/about"
            className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent"
            activeProps={{ className: "rounded-md px-3 py-2 text-foreground bg-accent" }}
          >
            About
          </Link>
          {user ? (
            <Button variant="outline" size="sm" onClick={() => signOut()} className="ml-2">
              Sign out
            </Button>
          ) : (
            <Button asChild size="sm" className="ml-2">
              <Link to="/login">Sign in</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
        <p className="mb-2 font-medium text-foreground">Medical disclaimer</p>
        <p>
          This tool provides an educational risk estimate based on a logistic regression model trained on the Pima Indians
          Diabetes dataset. It is not a medical diagnosis. Always consult a qualified healthcare professional for medical
          advice.
        </p>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
