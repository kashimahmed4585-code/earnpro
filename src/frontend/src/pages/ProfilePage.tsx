import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { Briefcase, DollarSign, Loader2, Plus, User, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useSaveCallerUserProfile,
} from "../hooks/useQueries";

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const saveMutation = useSaveCallerUserProfile();

  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (profile) {
      setBio(profile.bio);
      setSkills(profile.skills);
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync({
        bio,
        skills,
        completedJobs: profile?.completedJobs ?? BigInt(0),
        totalEarnings: profile?.totalEarnings ?? 0,
      });
      toast.success("Profile saved!");
    } catch (e: any) {
      toast.error(e.message || "Failed to save profile");
    }
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !skills.includes(s)) {
      setSkills((prev) => [...prev, s]);
    }
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  if (!identity) {
    return (
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold mb-3">
            Sign in to view your profile
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
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-10">
            <h1 className="font-display text-4xl font-bold mb-2">
              Your Profile
            </h1>
            <p className="text-muted-foreground text-sm font-mono">
              {identity.getPrincipal().toString().substring(0, 20)}...
            </p>
          </div>

          {/* Stats */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-card border border-border/60 rounded-2xl p-5">
                <DollarSign className="w-5 h-5 text-accent mb-2" />
                <div className="font-display text-2xl font-bold text-accent">
                  ${(profile?.totalEarnings ?? 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Total Earnings
                </p>
              </div>
              <div className="bg-card border border-border/60 rounded-2xl p-5">
                <Briefcase className="w-5 h-5 text-primary mb-2" />
                <div className="font-display text-2xl font-bold">
                  {profile?.completedJobs?.toString() ?? "0"}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Jobs Completed
                </p>
              </div>
            </div>
          )}

          {/* Edit form */}
          <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border/50">
              <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-semibold">Edit Profile</h2>
                <p className="text-xs text-muted-foreground">
                  Update your public profile
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                data-ocid="profile.bio_input"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people a bit about yourself..."
                className="bg-background border-border/60 focus:border-primary/50 resize-none"
                rows={4}
              />
            </div>

            <div className="space-y-3">
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    className="bg-primary/10 text-primary border border-primary/20 pr-1.5 gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-destructive transition-colors ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  data-ocid="profile.skills_input"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  placeholder="Add a skill (e.g. React, Copywriting)"
                  className="bg-background border-border/60 focus:border-primary/50"
                />
                <Button
                  onClick={addSkill}
                  variant="outline"
                  size="icon"
                  className="border-border/60 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button
              data-ocid="profile.save_button"
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saveMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Save Profile
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
