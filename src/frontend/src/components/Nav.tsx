import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { Loader2, Menu, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../hooks/useQueries";

export default function Nav() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const qc = useQueryClient();
  const { data: isAdmin } = useIsCallerAdmin();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      qc.clear();
    } else {
      try {
        await login();
      } catch (e: any) {
        if (e.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { to: "/jobs", label: "Browse Jobs", ocid: "nav.jobs_link" },
    { to: "/leaderboard", label: "Leaderboard", ocid: "nav.leaderboard_link" },
    ...(isAuthenticated
      ? [
          { to: "/dashboard", label: "Dashboard", ocid: "nav.dashboard_link" },
          { to: "/profile", label: "Profile", ocid: "nav.profile_link" },
          { to: "/tasks", label: "টাস্ক", ocid: "nav.tasks_link" },
          { to: "/payment", label: "পেমেন্ট", ocid: "nav.payment_link" },
        ]
      : []),
    ...(isAdmin
      ? [{ to: "/admin", label: "Admin", ocid: "nav.admin_link" }]
      : []),
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Earn<span className="text-primary">Pro</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid={link.ocid}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            data-ocid="nav.login_button"
            onClick={handleAuth}
            disabled={isLoggingIn}
            variant={isAuthenticated ? "outline" : "default"}
            size="sm"
            className={
              isAuthenticated
                ? ""
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }
          >
            {isLoggingIn && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isLoggingIn
              ? "Signing in..."
              : isAuthenticated
                ? "Sign Out"
                : "Sign In"}
          </Button>
          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid={link.ocid}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
