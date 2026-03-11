import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Code2,
  Database,
  DollarSign,
  Megaphone,
  Palette,
  PenLine,
  Search,
  Star,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";

const stats = [
  { label: "Total Paid Out", value: "$2.4M+", icon: Wallet },
  { label: "Active Jobs", value: "1,200+", icon: Briefcase },
  { label: "Happy Earners", value: "18,500+", icon: Users },
  { label: "Avg. Rating", value: "4.9/5", icon: Star },
];

const steps = [
  {
    step: "01",
    title: "Create Your Account",
    description:
      "Sign in with Internet Identity in seconds. No forms, no passwords.",
    icon: UserPlus,
  },
  {
    step: "02",
    title: "Browse & Apply",
    description:
      "Explore hundreds of opportunities across writing, design, dev, and more.",
    icon: Search,
  },
  {
    step: "03",
    title: "Get Paid",
    description:
      "Complete jobs and receive payments directly. Fast, transparent, secure.",
    icon: DollarSign,
  },
];

const categories = [
  {
    name: "Writing",
    icon: PenLine,
    count: "340 jobs",
    color: "from-blue-500/20 to-blue-600/5",
  },
  {
    name: "Design",
    icon: Palette,
    count: "210 jobs",
    color: "from-pink-500/20 to-pink-600/5",
  },
  {
    name: "Development",
    icon: Code2,
    count: "520 jobs",
    color: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    name: "Data Entry",
    icon: Database,
    count: "180 jobs",
    color: "from-amber-500/20 to-amber-600/5",
  },
  {
    name: "Marketing",
    icon: Megaphone,
    count: "290 jobs",
    color: "from-violet-500/20 to-violet-600/5",
  },
];

const testimonials = [
  {
    name: "Sarah K.",
    role: "Content Writer",
    text: "EarnPro changed how I work. I earned $3,200 last month just from writing articles.",
    earnings: "$38k+ earned",
  },
  {
    name: "Marcus T.",
    role: "Frontend Developer",
    text: "The quality of jobs here is incredible. Real projects, real pay, zero hassle.",
    earnings: "$92k+ earned",
  },
  {
    name: "Priya M.",
    role: "UI Designer",
    text: "I switched from Upwork to EarnPro and never looked back. Community is amazing.",
    earnings: "$45k+ earned",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/earnpro-hero-bg.dim_1400x700.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-background/75" />
        <div className="absolute inset-0 grid-pattern opacity-30" />

        {/* Floating glow orbs */}
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-accent/8 blur-3xl"
          style={{ animationDelay: "2s" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-primary/15 text-primary border border-primary/30 hover:bg-primary/20 mb-6 text-xs font-medium px-4 py-1.5">
                🚀 Join 18,500+ earners worldwide
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
            >
              Earn Money Doing
              <br />
              <span className="text-primary glow-text">What You Love</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              The world's most trusted platform for freelancers. Browse premium
              jobs, showcase your skills, and get paid — all on-chain.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                asChild
                size="lg"
                data-ocid="hero.primary_button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 h-12 shadow-glow"
              >
                <Link to="/jobs">
                  Browse Jobs <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                data-ocid="hero.secondary_button"
                className="text-base px-8 h-12 border-border/60 hover:bg-secondary"
              >
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border/50 bg-card/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-0.5">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <Badge className="bg-secondary text-muted-foreground border border-border mb-4">
                How it works
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Three steps to your first paycheck
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {steps.map((step, i) => (
                <motion.div
                  key={step.step}
                  variants={itemVariants}
                  className="relative bg-card border border-border/60 rounded-2xl p-8 hover:border-primary/30 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-display text-4xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors">
                      {step.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  {i < steps.length - 1 && (
                    <CheckCircle2 className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-primary/20 hidden md:block z-10" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <Badge className="bg-secondary text-muted-foreground border border-border mb-4">
                Categories
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Find your field
              </h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                From creative writing to technical development — every skillset
                has a home.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <motion.div key={cat.name} variants={itemVariants}>
                  <Link to="/jobs">
                    <div
                      className={`rounded-2xl p-6 bg-gradient-to-br ${cat.color} border border-border/40 hover:border-primary/30 transition-all hover:-translate-y-1 cursor-pointer group`}
                    >
                      <cat.icon className="w-7 h-7 mb-3 text-foreground/70 group-hover:text-foreground transition-colors" />
                      <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {cat.count}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <Badge className="bg-secondary text-muted-foreground border border-border mb-4">
                Testimonials
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Earners love us
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <motion.div
                  key={t.name}
                  variants={itemVariants}
                  className="bg-card border border-border/60 rounded-2xl p-6 hover:border-primary/30 transition-colors"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={String(i)}
                        className="w-4 h-4 fill-accent text-accent"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    "{t.text}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.role}
                      </div>
                    </div>
                    <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs">
                      {t.earnings}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-12 text-center glow-emerald"
          >
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to start earning?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Join thousands of professionals already making money on EarnPro.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
              >
                <Link to="/jobs">
                  Start Browsing Jobs <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
