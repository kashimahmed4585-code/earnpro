import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { ApplicationStatus, useGetUserApplications } from "../hooks/useQueries";

const statusColor: Record<string, string> = {
  [ApplicationStatus.pending]:
    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  [ApplicationStatus.accepted]: "bg-primary/10 text-primary border-primary/20",
  [ApplicationStatus.rejected]:
    "bg-destructive/10 text-destructive border-destructive/20",
  [ApplicationStatus.completed]:
    "bg-secondary text-muted-foreground border-border",
};

export default function MyApplicationsPage() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() ?? null;
  const { data: applications = [], isLoading } =
    useGetUserApplications(principal);

  if (!identity) {
    return (
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold mb-3">
            Sign in to view applications
          </h2>
          <Button asChild>
            <Link to="/jobs">Browse Jobs</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-10">
            <h1 className="font-display text-4xl font-bold mb-2">
              My Applications
            </h1>
            <p className="text-muted-foreground">
              {applications.length} application
              {applications.length !== 1 ? "s" : ""} submitted
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={String(i)} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div
              data-ocid="applications.empty_state"
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                No applications yet
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs mb-6">
                Start applying for jobs to see your applications here.
              </p>
              <Button asChild>
                <Link to="/jobs">Browse Available Jobs</Link>
              </Button>
            </div>
          ) : (
            <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
              <Table data-ocid="applications.table">
                <TableHeader>
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">
                      Job ID
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Applied
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Updated
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow
                      key={app.id.toString()}
                      className="border-border/60 hover:bg-secondary/30"
                    >
                      <TableCell className="font-medium">
                        #{app.jobId.toString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(
                          Number(app.appliedAt) / 1_000_000,
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(
                          Number(app.updatedAt) / 1_000_000,
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs border capitalize ${statusColor[app.status] || ""}`}
                        >
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                        >
                          <Link
                            to="/jobs/$id"
                            params={{ id: app.jobId.toString() }}
                          >
                            View Job
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
