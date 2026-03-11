import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Pencil,
  Plus,
  Settings,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateJob,
  useDeleteJob,
  useGetAllJobs,
  useGetJobApplications,
  useIsCallerAdmin,
  useUpdateApplicationStatus,
  useUpdateJob,
} from "../hooks/useQueries";
import { ApplicationStatus, JobCategory, JobStatus } from "../hooks/useQueries";
import type { Job } from "../hooks/useQueries";

const categoryOptions = [
  { value: JobCategory.writing, label: "Writing" },
  { value: JobCategory.design, label: "Design" },
  { value: JobCategory.development, label: "Development" },
  { value: JobCategory.dataEntry, label: "Data Entry" },
  { value: JobCategory.marketing, label: "Marketing" },
];

const statusColor: Record<string, string> = {
  [ApplicationStatus.pending]:
    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  [ApplicationStatus.accepted]: "bg-primary/10 text-primary border-primary/20",
  [ApplicationStatus.rejected]:
    "bg-destructive/10 text-destructive border-destructive/20",
  [ApplicationStatus.completed]:
    "bg-secondary text-muted-foreground border-border",
};

type JobFormState = {
  title: string;
  description: string;
  category: JobCategory;
  payRate: string;
  requirements: string;
  status: JobStatus;
};

const defaultForm: JobFormState = {
  title: "",
  description: "",
  category: JobCategory.writing,
  payRate: "",
  requirements: "",
  status: JobStatus.open,
};

function JobDialog({
  open,
  onClose,
  editJob,
}: {
  open: boolean;
  onClose: () => void;
  editJob?: Job | null;
}) {
  const [form, setForm] = useState<JobFormState>(
    editJob
      ? {
          title: editJob.title,
          description: editJob.description,
          category: editJob.category,
          payRate: editJob.payRate.toString(),
          requirements: editJob.requirements,
          status: editJob.status,
        }
      : defaultForm,
  );
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const isPending = createJob.isPending || updateJob.isPending;

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.payRate) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      if (editJob) {
        await updateJob.mutateAsync({
          id: editJob.id,
          ...form,
          payRate: Number.parseFloat(form.payRate),
        });
        toast.success("Job updated!");
      } else {
        await createJob.mutateAsync({
          ...form,
          payRate: Number.parseFloat(form.payRate),
        });
        toast.success("Job created!");
      }
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Failed to save job");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-card border-border/60 max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">
            {editJob ? "Edit Job" : "Create New Job"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Senior Content Writer"
              className="bg-background border-border/60"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Description *</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Describe the job..."
              className="bg-background border-border/60 resize-none"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, category: v as JobCategory }))
                }
              >
                <SelectTrigger className="bg-background border-border/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Pay Rate ($/hr) *</Label>
              <Input
                type="number"
                value={form.payRate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, payRate: e.target.value }))
                }
                placeholder="25"
                className="bg-background border-border/60"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Requirements</Label>
            <Textarea
              value={form.requirements}
              onChange={(e) =>
                setForm((p) => ({ ...p, requirements: e.target.value }))
              }
              placeholder="- 2+ years experience\n- Strong English skills"
              className="bg-background border-border/60 resize-none"
              rows={3}
            />
          </div>
          {editJob && (
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, status: v as JobStatus }))
                }
              >
                <SelectTrigger className="bg-background border-border/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={JobStatus.open}>Open</SelectItem>
                  <SelectItem value={JobStatus.closed}>Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {editJob ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ApplicationsManager({
  jobId,
  jobTitle,
}: { jobId: bigint; jobTitle: string }) {
  const { data: applications = [], isLoading } = useGetJobApplications(jobId);
  const updateStatus = useUpdateApplicationStatus();

  return (
    <div className="mt-4 border border-border/40 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-secondary/50 border-b border-border/40">
        <p className="text-sm font-medium">Applications for: {jobTitle}</p>
      </div>
      {isLoading ? (
        <div className="p-4">
          <Skeleton className="h-10 w-full" />
        </div>
      ) : applications.length === 0 ? (
        <p className="text-center py-6 text-sm text-muted-foreground">
          No applications yet
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="text-xs text-muted-foreground">
                Applicant
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Applied
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow
                key={app.id.toString()}
                className="border-border/40 hover:bg-secondary/20"
              >
                <TableCell className="text-xs font-mono">
                  {app.applicant.toString().substring(0, 15)}...
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(
                    Number(app.appliedAt) / 1_000_000,
                  ).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`text-xs border ${statusColor[app.status] || ""}`}
                  >
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {Object.values(ApplicationStatus)
                      .filter((s) => s !== app.status)
                      .map((s) => (
                        <Button
                          key={s}
                          size="sm"
                          variant="ghost"
                          className="h-6 text-xs px-2"
                          onClick={() =>
                            updateStatus
                              .mutateAsync({ applicationId: app.id, status: s })
                              .catch((e) => toast.error(e.message))
                          }
                        >
                          {s}
                        </Button>
                      ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: jobs = [], isLoading: jobsLoading } = useGetAllJobs();
  const deleteJob = useDeleteJob();

  const [createOpen, setCreateOpen] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const handleDelete = async (id: bigint) => {
    try {
      await deleteJob.mutateAsync(id);
      toast.success("Job deleted");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete");
    }
  };

  if (!identity || adminLoading) {
    return (
      <main className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You don't have admin privileges.
          </p>
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
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-6 h-6 text-primary" />
                <h1 className="font-display text-4xl font-bold">Admin Panel</h1>
              </div>
              <p className="text-muted-foreground">
                Manage jobs and applications
              </p>
            </div>
            <Button
              data-ocid="admin.create_job_button"
              onClick={() => setCreateOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" /> New Job
            </Button>
          </div>

          <Tabs defaultValue="jobs">
            <TabsList className="bg-card border border-border/60 mb-6">
              <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs">
              {jobsLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={String(i)} className="h-16 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/60 hover:bg-transparent">
                        <TableHead className="text-muted-foreground">
                          Title
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Category
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Rate
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Status
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job, i) => (
                        <>
                          <TableRow
                            key={job.id.toString()}
                            className="border-border/60 hover:bg-secondary/30"
                          >
                            <TableCell className="font-medium">
                              {job.title}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-secondary text-muted-foreground border-border text-xs">
                                {job.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-accent font-semibold">
                              ${job.payRate}/hr
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`text-xs border ${
                                  job.status === JobStatus.open
                                    ? "bg-primary/10 text-primary border-primary/20"
                                    : "bg-secondary text-muted-foreground border-border"
                                }`}
                              >
                                {job.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  data-ocid={
                                    i === 0
                                      ? "admin.job.edit_button.1"
                                      : undefined
                                  }
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0"
                                  onClick={() => setEditJob(job)}
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  data-ocid={
                                    i === 0
                                      ? "admin.job.delete_button.1"
                                      : undefined
                                  }
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDelete(job.id)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs px-2 text-muted-foreground"
                                  onClick={() =>
                                    setExpandedJob(
                                      expandedJob === job.id.toString()
                                        ? null
                                        : job.id.toString(),
                                    )
                                  }
                                >
                                  Apps
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {expandedJob === job.id.toString() && (
                            <TableRow
                              key={`expanded-${job.id}`}
                              className="border-border/60"
                            >
                              <TableCell colSpan={5} className="p-4">
                                <ApplicationsManager
                                  jobId={job.id}
                                  jobTitle={job.title}
                                />
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))}
                      {jobs.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-12 text-muted-foreground"
                          >
                            No jobs yet. Create your first job!
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="applications">
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id.toString()}
                    className="bg-card border border-border/60 rounded-2xl overflow-hidden"
                  >
                    <div className="px-6 py-4 border-b border-border/40">
                      <h3 className="font-semibold">{job.title}</h3>
                    </div>
                    <div className="p-4">
                      <ApplicationsManager
                        jobId={job.id}
                        jobTitle={job.title}
                      />
                    </div>
                  </div>
                ))}
                {jobs.length === 0 && (
                  <p className="text-center py-12 text-muted-foreground">
                    No jobs to show applications for.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <JobDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <AnimatePresence>
        {editJob && (
          <JobDialog
            open={!!editJob}
            onClose={() => setEditJob(null)}
            editJob={editJob}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
