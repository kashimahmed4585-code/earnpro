import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const TASKS = [
  {
    id: "fb",
    storageKey: "task_fb_done",
    title: "Facebook পেজ ফলো করুন",
    description:
      "আমাদের Facebook পেজ ফলো করুন এবং সর্বশেষ আপডেট পান। ফলো করার পর নিচের বাটনে ক্লিক করুন।",
    reward: "৳10",
    link: "https://www.facebook.com/share/14YTD13PWJA/",
    color: "#1877F2",
    ocid: "tasks.facebook.button",
    itemOcid: "tasks.item.1",
    icon: (
      <svg
        role="img"
        aria-label="Facebook"
        viewBox="0 0 24 24"
        className="w-8 h-8"
        fill="#1877F2"
      >
        <title>Facebook</title>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: "tg",
    storageKey: "task_tg_done",
    title: "Telegram চ্যানেলে যোগ দিন",
    description:
      "আমাদের Telegram চ্যানেলে যোগ দিন এবং এক্সক্লুসিভ অফার ও টিপস পান। জয়েন করার পর নিচের বাটনে ক্লিক করুন।",
    reward: "৳15",
    link: "https://t.me/marketing_group_03",
    color: "#26A5E4",
    ocid: "tasks.telegram.button",
    itemOcid: "tasks.item.2",
    icon: (
      <svg
        role="img"
        aria-label="Telegram"
        viewBox="0 0 24 24"
        className="w-8 h-8"
        fill="#26A5E4"
      >
        <title>Telegram</title>
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
];

export default function TasksPage() {
  const [done, setDone] = useState<Record<string, boolean>>(() => {
    const result: Record<string, boolean> = {};
    for (const t of TASKS) {
      result[t.id] = localStorage.getItem(t.storageKey) === "true";
    }
    return result;
  });

  const handleComplete = (task: (typeof TASKS)[0]) => {
    window.open(task.link, "_blank");
    localStorage.setItem(task.storageKey, "true");
    setDone((prev) => ({ ...prev, [task.id]: true }));
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-display font-bold mb-2">
            টাস্ক সম্পন্ন করুন
          </h1>
          <p className="text-muted-foreground">
            নিচের টাস্কগুলো সম্পন্ন করুন এবং বোনাস রিওয়ার্ড উপার্জন করুন
          </p>
        </motion.div>

        <section data-ocid="tasks.section" className="flex flex-col gap-5">
          {TASKS.map((task, i) => (
            <motion.div
              key={task.id}
              data-ocid={task.itemOcid}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.45 }}
              className={`bg-card border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 transition-all ${
                done[task.id]
                  ? "border-success/50 bg-success/5"
                  : "border-border/60"
              }`}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${task.color}18`,
                  border: `1.5px solid ${task.color}40`,
                }}
              >
                {task.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-lg">{task.title}</span>
                  <Badge className="bg-primary/15 text-primary border-0 font-bold">
                    {task.reward}
                  </Badge>
                  {done[task.id] && (
                    <Badge className="bg-success/15 text-success border-0 gap-1">
                      <CheckCircle2 className="w-3 h-3" /> সম্পন্ন
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
              </div>
              <div className="flex-shrink-0 w-full sm:w-auto">
                {done[task.id] ? (
                  <Button
                    data-ocid={task.ocid}
                    variant="outline"
                    className="w-full sm:w-auto border-success/40 text-success hover:bg-success/10 gap-2"
                    onClick={() => window.open(task.link, "_blank")}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    হয়ে গেছে ✓
                  </Button>
                ) : (
                  <Button
                    data-ocid={task.ocid}
                    className="w-full sm:w-auto gap-2"
                    onClick={() => handleComplete(task)}
                  >
                    <ExternalLink className="w-4 h-4" />
                    সম্পন্ন করুন
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 bg-card border border-border/60 rounded-2xl p-5 text-center"
        >
          <p className="text-sm text-muted-foreground">
            ✅ টাস্ক সম্পন্ন করার পর{" "}
            <span className="text-foreground font-medium">"সম্পন্ন করুন"</span>{" "}
            বাটনে ক্লিক করুন। রিওয়ার্ড ২৪ ঘণ্টার মধ্যে আপনার অ্যাকাউন্টে যোগ হবে।
          </p>
        </motion.div>
      </div>
    </main>
  );
}
