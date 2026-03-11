import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, LogIn, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";

const PAYMENT_METHODS = [
  { id: "bkash", label: "bKash", color: "#E2136E" },
  { id: "nagad", label: "Nagad", color: "#F26522" },
  { id: "rocket", label: "Rocket", color: "#8B2FC9" },
];

interface PaymentRequest {
  id: string;
  method: string;
  account: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  date: string;
}

function loadHistory(): PaymentRequest[] {
  try {
    return JSON.parse(localStorage.getItem("payment_requests") || "[]");
  } catch {
    return [];
  }
}

function saveHistory(requests: PaymentRequest[]) {
  localStorage.setItem("payment_requests", JSON.stringify(requests));
}

export default function PaymentPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const { data: profile, isLoading: profileLoading } =
    useGetCallerUserProfile();

  const [method, setMethod] = useState("bkash");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [history, setHistory] = useState<PaymentRequest[]>(loadHistory);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const totalEarnings = profile ? Number(profile.totalEarnings) : 0;
  const parsedAmount = Number.parseFloat(amount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!account.trim()) {
      setError("অ্যাকাউন্ট নম্বর দিন");
      return;
    }
    if (Number.isNaN(parsedAmount) || parsedAmount < 50) {
      setError("সর্বনিম্ন উইথড্র পরিমাণ ৳50");
      return;
    }
    if (parsedAmount > totalEarnings) {
      setError("পর্যাপ্ত ব্যালেন্স নেই");
      return;
    }

    const newRequest: PaymentRequest = {
      id: Date.now().toString(),
      method,
      account: account.trim(),
      amount: parsedAmount,
      status: "pending",
      date: new Date().toLocaleDateString("bn-BD"),
    };

    const updated = [newRequest, ...history];
    saveHistory(updated);
    setHistory(updated);
    setAmount("");
    setAccount("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const statusLabel = (s: PaymentRequest["status"]) => {
    if (s === "pending")
      return {
        label: "পেন্ডিং",
        cls: "bg-yellow-500/15 text-yellow-600 border-0",
      };
    if (s === "approved")
      return { label: "অনুমোদিত", cls: "bg-success/15 text-success border-0" };
    return {
      label: "বাতিল",
      cls: "bg-destructive/15 text-destructive border-0",
    };
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/60 rounded-2xl p-10 text-center max-w-sm w-full"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">লগইন প্রয়োজন</h2>
          <p className="text-muted-foreground text-sm mb-6">
            পেমেন্ট করতে আপনার অ্যাকাউন্টে লগইন করুন।
          </p>
          <Button
            data-ocid="payment.login_button"
            className="w-full gap-2"
            onClick={() => login()}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {isLoggingIn ? "লগইন হচ্ছে..." : "লগইন করুন"}
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-display font-bold mb-2">
            পেমেন্ট ও উইথড্র
          </h1>
          <p className="text-muted-foreground">আপনার উপার্জন উইথড্র করুন</p>
        </motion.div>

        {/* Balance card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border/60 rounded-2xl p-6 mb-6 flex items-center gap-5"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
            <Wallet className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-0.5">মোট উপার্জন</p>
            {profileLoading ? (
              <div
                data-ocid="payment.loading_state"
                className="h-8 w-24 bg-muted rounded animate-pulse"
              />
            ) : (
              <p className="text-3xl font-bold text-primary">
                ৳{totalEarnings.toFixed(2)}
              </p>
            )}
          </div>
        </motion.div>

        {/* Withdrawal form */}
        <motion.section
          data-ocid="payment.section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border/60 rounded-2xl p-6 mb-6"
        >
          <h2 className="text-lg font-semibold mb-5">উইথড্র রিকোয়েস্ট</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Payment method */}
            <div>
              <Label className="mb-3 block text-sm">পেমেন্ট মেথড</Label>
              <div data-ocid="payment.method.select" className="flex gap-3">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                      method === m.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 text-muted-foreground hover:border-border"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Account number */}
            <div>
              <Label htmlFor="account" className="mb-2 block text-sm">
                অ্যাকাউন্ট নম্বর
              </Label>
              <Input
                id="account"
                data-ocid="payment.account.input"
                type="tel"
                placeholder="01XXXXXXXXX"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
              />
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="amount" className="mb-2 block text-sm">
                পরিমাণ (সর্বনিম্ন ৳50)
              </Label>
              <Input
                id="amount"
                data-ocid="payment.amount.input"
                type="number"
                min={50}
                max={totalEarnings}
                step={1}
                placeholder="পরিমাণ লিখুন"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {error && (
              <p
                data-ocid="payment.error_state"
                className="text-sm text-destructive"
              >
                {error}
              </p>
            )}

            {submitted && (
              <p
                data-ocid="payment.success_state"
                className="text-sm text-success"
              >
                ✅ রিকোয়েস্ট সফলভাবে জমা হয়েছে!
              </p>
            )}

            <Button
              data-ocid="payment.submit_button"
              type="submit"
              className="w-full"
              disabled={profileLoading}
            >
              উইথড্র করুন
            </Button>
          </form>
        </motion.section>

        {/* History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card border border-border/60 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold mb-4">পেমেন্ট ইতিহাস</h2>
          {history.length === 0 ? (
            <div
              data-ocid="payment.history.empty_state"
              className="text-center py-8 text-muted-foreground text-sm"
            >
              এখনো কোনো উইথড্র রিকোয়েস্ট নেই
            </div>
          ) : (
            <Table data-ocid="payment.history.table">
              <TableHeader>
                <TableRow>
                  <TableHead>মেথড</TableHead>
                  <TableHead>অ্যাকাউন্ট</TableHead>
                  <TableHead>পরিমাণ</TableHead>
                  <TableHead>তারিখ</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((req, i) => {
                  const st = statusLabel(req.status);
                  return (
                    <TableRow
                      key={req.id}
                      data-ocid={`payment.history.row.${i + 1}`}
                    >
                      <TableCell className="font-medium capitalize">
                        {req.method}
                      </TableCell>
                      <TableCell>{req.account}</TableCell>
                      <TableCell>৳{req.amount}</TableCell>
                      <TableCell>{req.date}</TableCell>
                      <TableCell>
                        <Badge className={st.cls}>{st.label}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </motion.div>
      </div>
    </main>
  );
}
