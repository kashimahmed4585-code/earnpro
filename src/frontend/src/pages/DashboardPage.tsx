import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  Clock,
  DollarSign,
  Search,
  TrendingUp,
  Trophy,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useGetUserApplications,
} from "../hooks/useQueries";
import { ApplicationStatus } from "../hooks/useQueries";

const statusColor: Record<string, string> = {
  [ApplicationStatus.pending]:
    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  [ApplicationStatus.accepted]: "bg-primary/10 text-primary border-primary/20",
  [ApplicationStatus.rejected]:
    "bg-destructive/10 text-destructive border-destructive/20",
  [ApplicationStatus.completed]:
    "bg-secondary text-muted-foreground border-border",
};

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() ?? null;
  const { data: profile, isLoading: profileLoading } =
    useGetCallerUserProfile();
  const { data: applications = [], isLoading: appsLoading } =
    useGetUserApplications(principal);

  if (!identity) {
    return (
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold mb-3">
            Sign in to view your dashboard
          </h2>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to access your dashboard.
          </p>
          <Button asChild>
            <Link to="/jobs">Browse Jobs Instead</Link>
          </Button>
        </div>
      </main>
    );
  }

  const recentApps = applications.slice(0, 5);

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4" data-ocid="dashboard.section">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-10">
            <h1 className="font-display text-4xl font-bold mb-2">
              Welcome back{profile ? `, ${profile.bio.split(" ")[0]}` : ""}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your account.
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {profileLoading ? (
              [...Array(3)].map((_, i) => (
                <div
                  key={String(i)}
                  className="bg-card border border-border/60 rounded-2xl p-6"
                >
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))
            ) : (
              <>
                <Card className="bg-card border border-border/60 rounded-2xl overflow-hidden group hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-muted-foreground font-medium">
                        Total Earnings
                      </CardTitle>
                      <DollarSign className="w-4 h-4 text-accent" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="font-display text-3xl font-bold text-accent">
                      ${(profile?.totalEarnings ?? 0).toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      All time earnings
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-muted-foreground font-medium">
                        Completed Jobs
                      </CardTitle>
                      <Briefcase className="w-4 h-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="font-display text-3xl font-bold">
                      {profile?.completedJobs?.toString() ?? "0"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Successfully completed
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-muted-foreground font-medium">
                        Applications
                      </CardTitle>
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="font-display text-3xl font-bold">
                      {applications.length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total submitted
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent activity */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold">
                  Recent Applications
                </h2>
                <Link
                  to="/my-applications"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {appsLoading ? (
                  [...Array(3)].map((_, i) => (
                    <div
                      key={String(i)}
                      className="bg-card border border-border/60 rounded-xl p-4"
                    >
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  ))
                ) : recentApps.length === 0 ? (
                  <div className="bg-card border border-border/60 rounded-xl p-8 text-center">
                    <Briefcase className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No applications yet
                    </p>
                    <Button
                      asChild
                      size="sm"
                      className="mt-3"
                      variant="outline"
                    >
                      <Link to="/jobs">Browse Jobs</Link>
                    </Button>
                  </div>
                ) : (
                  recentApps.map((app) => (
                    <div
                      key={app.id.toString()}
                      className="bg-card border border-border/60 rounded-xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          Job #{app.jobId.toString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Applied{" "}
                          {new Date(
                            Number(app.appliedAt) / 1_000_000,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        className={`text-xs border ${statusColor[app.status] || ""}`}
                      >
                        {app.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h2 className="font-display text-xl font-semibold mb-4">
                Quick Links
              </h2>
              <div className="space-y-3">
                {[
                  {
                    to: "/jobs",
                    icon: Search,
                    label: "Browse Jobs",
                    desc: "Find new opportunities",
                  },
                  {
                    to: "/my-applications",
                    icon: Clock,
                    label: "My Applications",
                    desc: "Track your progress",
                  },
                  {
                    to: "/profile",
                    icon: User,
                    label: "Edit Profile",
                    desc: "Update your info",
                  },
                  {
                    to: "/leaderboard",
                    icon: Trophy,
                    label: "Leaderboard",
                    desc: "See top earners",
                  },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 bg-card border border-border/60 rounded-xl p-4 hover:border-primary/30 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
