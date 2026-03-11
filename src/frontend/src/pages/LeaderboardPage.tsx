import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Medal, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useGetTopEarners } from "../hooks/useQueries";

const rankColors = ["text-amber-400", "text-slate-300", "text-orange-400"];

const rankIcons = [Trophy, Medal, Medal];

export default function LeaderboardPage() {
  const { data: earners = [], isLoading } = useGetTopEarners(20);

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-accent" />
            </div>
            <h1 className="font-display text-4xl font-bold mb-2">
              Leaderboard
            </h1>
            <p className="text-muted-foreground">
              Top earners on EarnPro this month
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={String(i)} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
              <Table data-ocid="leaderboard.table">
                <TableHeader>
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableHead className="text-muted-foreground w-16">
                      Rank
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Earner
                    </TableHead>
                    <TableHead className="text-muted-foreground text-right">
                      Earnings
                    </TableHead>
                    <TableHead className="text-muted-foreground text-right">
                      Jobs Done
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {earners.map((earner, i) => {
                    const RankIcon = rankIcons[i] || Medal;
                    return (
                      <TableRow
                        key={String(i)}
                        className="border-border/60 hover:bg-secondary/30"
                      >
                        <TableCell>
                          <div
                            className={`flex items-center gap-1.5 font-bold ${rankColors[i] || "text-muted-foreground"}`}
                          >
                            <RankIcon className="w-4 h-4" />
                            <span>#{i + 1}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                              {i + 1}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {earner.bio
                                  ? earner.bio.substring(0, 20)
                                  : `Earner #${i + 1}`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {earner.skills.slice(0, 2).join(", ")}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-accent">
                            ${earner.totalEarnings.toFixed(0)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs">
                            {earner.completedJobs.toString()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {earners.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-12 text-muted-foreground"
                      >
                        No earners yet — be the first!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
