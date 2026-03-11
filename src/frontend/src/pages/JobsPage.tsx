import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase, DollarSign, Search, Tag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { useGetOpenJobs } from "../hooks/useQueries";
import { JobCategory } from "../hooks/useQueries";
import type { Job } from "../hooks/useQueries";

const ALL_CATEGORIES = ["all", ...Object.values(JobCategory)];

const categoryLabel: Record<string, string> = {
  all: "All",
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

function JobCard({ job, index }: { job: Job; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      data-ocid={`jobs.item.${index + 1}`}
      className="bg-card border border-border/60 rounded-2xl p-6 hover:border-primary/30 transition-all hover:-translate-y-0.5 group"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-lg truncate group-hover:text-primary transition-colors">
            {job.title}
          </h3>
        </div>
        <Badge
          className={`shrink-0 text-xs border ${categoryColor[job.category] || ""}`}
        >
          {categoryLabel[job.category] || job.category}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
        {job.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-accent text-sm font-semibold">
          <DollarSign className="w-4 h-4" />
          <span>${job.payRate.toFixed(2)}/hr</span>
        </div>
        <Button
          asChild
          size="sm"
          data-ocid="jobs.apply_button"
          className="bg-primary/15 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all"
          variant="outline"
        >
          <Link to="/jobs/$id" params={{ id: job.id.toString() }}>
            View Job <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

export default function JobsPage() {
  const { data: jobs = [], isLoading } = useGetOpenJobs();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchesCat =
        activeCategory === "all" || j.category === activeCategory;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [jobs, search, activeCategory]);

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold mb-2">Browse Jobs</h1>
          <p className="text-muted-foreground">
            {jobs.length} open positions available
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="jobs.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs by title or description..."
            className="pl-10 bg-card border-border/60 focus:border-primary/50 h-11"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {ALL_CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              data-ocid="jobs.filter.tab"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border/60 hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {categoryLabel[cat]}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={String(i)}
                className="bg-card border border-border/60 rounded-2xl p-6"
              >
                <Skeleton className="h-5 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-5" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <AnimatePresence>
            <motion.div
              data-ocid="jobs.empty_state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                No jobs found
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                {search
                  ? `No results for "${search}"`
                  : "No jobs in this category yet."}{" "}
                Try adjusting your filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                }}
              >
                Clear filters
              </Button>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {filtered.map((job, i) => (
                <JobCard key={job.id.toString()} job={job} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
