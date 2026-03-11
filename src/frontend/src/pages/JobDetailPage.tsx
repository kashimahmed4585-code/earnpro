import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  DollarSign,
  Loader2,
  Lock,
  Tag,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  JobCategory,
  JobStatus,
  useApplyToJob,
  useGetJob,
} from "../hooks/useQueries";

const categoryLabel: Record<string, string> = {
  [JobCategory.writing]: "Writing",
  [JobCategory.design]: "Design",
  [JobCategory.development]: "Development",
  [JobCategory.dataEntry]: "Data Entry",
  [JobCategory.marketing]: "Marketing",
};

const categoryColor: Record<string, string> = {
  [JobCategory.writing]: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  [JobCategory.design]: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  [JobCategory.development]:
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  [JobCategory.dataEntry]: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  [JobCategory.marketing]:
    "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

export default function JobDetailPage() {
  const { id } = useParams({ from: "/jobs/$id" });
  const { data: job, isLoading } = useGetJob(id ? BigInt(id) : null);
  const { identity } = useInternetIdentity();
  const applyMutation = useApplyToJob();

  const handleApply = async () => {
    if (!job) return;
    try {
      await applyMutation.mutateAsync(job.id);
      toast.success("Application submitted!");
    } catch (e: any) {
      toast.error(e.message || "Failed to apply");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-5 w-48 mb-8" />
          <Skeleton className="h-40 w-full" />
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold mb-2">
            Job not found
          </h2>
          <Link to="/jobs">
            <Button variant="outline">Back to Jobs</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/jobs"
            data-ocid="job_detail.back_button"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Link>

          <div className="bg-card border border-border/60 rounded-2xl p-8 mb-6">
            <div className="flex flex-wrap items-start gap-4 mb-6">
              <div className="flex-1">
                <h1 className="font-display text-3xl font-bold mb-3">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge
                    className={`text-xs border ${categoryColor[job.category] || ""}`}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {categoryLabel[job.category] || job.category}
                  </Badge>
                  <Badge
                    className={`text-xs border ${
                      job.status === JobStatus.open
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {job.status === JobStatus.open ? "Open" : "Closed"}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-accent font-bold text-2xl">
                  <DollarSign className="w-5 h-5" />
                  {job.payRate.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">per hour</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
              <Calendar className="w-3.5 h-3.5" />
              Posted{" "}
              {new Date(Number(job.createdAt) / 1_000_000).toLocaleDateString()}
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="font-display text-lg font-semibold mb-3">
                  Description
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>

              {job.requirements && (
                <div>
                  <h2 className="font-display text-lg font-semibold mb-3">
                    Requirements
                  </h2>
                  <div className="space-y-2">
                    {job.requirements
                      .split("\n")
                      .filter(Boolean)
                      .map((req, i) => (
                        <div
                          key={String(i)}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          {req.replace(/^[-•*]\s*/, "")}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Apply section */}
          <div className="bg-card border border-primary/20 rounded-2xl p-6">
            {identity ? (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-semibold mb-1">
                    Ready to apply?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Submit your application now.
                  </p>
                </div>
                <Button
                  data-ocid="job_detail.apply_button"
                  onClick={handleApply}
                  disabled={
                    applyMutation.isPending || job.status !== JobStatus.open
                  }
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
                >
                  {applyMutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Apply Now
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-display font-semibold mb-0.5">
                      Sign in to apply
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      You need to be logged in to apply for this job.
                    </p>
                  </div>
                </div>
                <Button
                  data-ocid="job_detail.apply_button"
                  asChild
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Link to="/jobs">Sign In</Link>
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
