import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/_authenticated")({
  component: AuthGate,
});

function AuthGate() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <SiteLayout>
        <div className="container mx-auto max-w-md px-4 py-24 text-center text-muted-foreground">Loading…</div>
      </SiteLayout>
    );
  }

  return <Outlet />;
}
