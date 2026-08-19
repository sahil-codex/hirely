import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  MapPin,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

const popularJobs = [
  {
    title: "Backend Developer",
    description:
      "Build scalable APIs and backend systems.",
    icon: "⚙️",
  },
  {
    title: "Frontend Developer",
    description:
      "Create modern and engaging web experiences.",
    icon: "🎨",
  },
  {
    title: "Full Stack Developer",
    description:
      "Work across frontend, backend and databases.",
    icon: "🚀",
  },
  {
    title: "React Developer",
    description:
      "Build fast and interactive React applications.",
    icon: "⚛️",
  },
];

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Search thousands of opportunities using skills, location and salary.",
  },
  {
    number: "02",
    title: "Apply",
    description:
      "Create your profile, upload your resume and apply with confidence.",
  },
  {
    number: "03",
    title: "Get Hired",
    description:
      "Track your applications and connect with companies looking for you.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden">

        {/* Background glow */}

        <div className="pointer-events-none absolute left-1/2 top-20 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[140px]" />

        <div className="pointer-events-none absolute -left-40 top-80 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pt-28">

          <div className="mx-auto max-w-4xl text-center">

            {/* Small badge */}

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300">
              <Sparkles
                size={15}
                className="text-violet-400"
              />

              Your next opportunity starts here
            </div>

            {/* Heading */}

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Find work that
              <span className="block bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
                moves you forward.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-zinc-400">
              Discover opportunities that match
              your skills, experience and ambitions.
              Apply to your next role without the
              noise.
            </p>

            {/* Search */}

            <form
              action="/jobs"
              method="GET"
              className="mx-auto mt-10 max-w-4xl"
            >
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 shadow-2xl backdrop-blur-xl">

                <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">

                  {/* Job */}

                  <div className="flex items-center gap-3 rounded-xl bg-black/50 px-4">
                    <Search
                      size={20}
                      className="shrink-0 text-zinc-500"
                    />

                    <input
                      name="keyword"
                      placeholder="Job title or keyword"
                      className="w-full bg-transparent py-4 text-white outline-none placeholder:text-zinc-600"
                    />
                  </div>

                  {/* Location */}

                  <div className="flex items-center gap-3 rounded-xl bg-black/50 px-4">
                    <MapPin
                      size={20}
                      className="shrink-0 text-zinc-500"
                    />

                    <input
                      name="location"
                      placeholder="Location"
                      className="w-full bg-transparent py-4 text-white outline-none placeholder:text-zinc-600"
                    />
                  </div>

                  {/* Button */}

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-black transition hover:bg-zinc-200"
                  >
                    Search
                    <ArrowRight size={18} />
                  </button>

                </div>
              </div>
            </form>

            <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm text-zinc-500">
              <span>Popular:</span>

              <Link
                href="/jobs?keyword=React"
                className="transition hover:text-white"
              >
                React
              </Link>

              <span>•</span>

              <Link
                href="/jobs?keyword=Node.js"
                className="transition hover:text-white"
              >
                Node.js
              </Link>

              <span>•</span>

              <Link
                href="/jobs?keyword=Backend"
                className="transition hover:text-white"
              >
                Backend
              </Link>

              <span>•</span>

              <Link
                href="/jobs?keyword=Frontend"
                className="transition hover:text-white"
              >
                Frontend
              </Link>
            </div>
          </div>

          {/* ================= STATS ================= */}

          <div className="mx-auto mt-20 grid max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:grid-cols-3">

            <div className="flex flex-col items-center gap-1 border-b border-white/10 p-7 sm:border-b-0 sm:border-r">
              <span className="text-3xl font-bold">
                1,200+
              </span>

              <span className="text-sm text-zinc-500">
                Job Opportunities
              </span>
            </div>

            <div className="flex flex-col items-center gap-1 border-b border-white/10 p-7 sm:border-b-0 sm:border-r">
              <span className="text-3xl font-bold">
                500+
              </span>

              <span className="text-sm text-zinc-500">
                Companies
              </span>
            </div>

            <div className="flex flex-col items-center gap-1 p-7">
              <span className="text-3xl font-bold">
                10k+
              </span>

              <span className="text-sm text-zinc-500">
                Candidates
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ================= POPULAR JOBS ================= */}

      <section className="border-t border-white/5 bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-wider text-violet-400">
                Explore opportunities
              </p>

              <h2 className="text-3xl font-bold sm:text-4xl">
                Find your kind of work
              </h2>

              <p className="mt-3 max-w-xl text-zinc-500">
                Explore some of the most popular roles
                candidates are looking for.
              </p>
            </div>

            <Link
              href="/jobs"
              className="flex items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-white"
            >
              View all jobs
              <ArrowRight size={17} />
            </Link>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {popularJobs.map((job) => (
              <Link
                key={job.title}
                href={`/jobs?keyword=${encodeURIComponent(
                  job.title
                )}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.05]"
              >

                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-xl">
                  {job.icon}
                </div>

                <h3 className="text-lg font-semibold">
                  {job.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {job.description}
                </p>

                <div className="mt-6 flex items-center gap-1 text-sm text-zinc-400 transition group-hover:text-violet-400">
                  Explore
                  <ArrowRight
                    size={15}
                    className="transition group-hover:translate-x-1"
                  />
                </div>

              </Link>
            ))}

          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">

            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-violet-400">
              Simple by design
            </p>

            <h2 className="text-3xl font-bold sm:text-4xl">
              From searching to hired
            </h2>

            <p className="mt-4 text-zinc-500">
              Everything you need to take the next
              step in your career.
            </p>

          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">

            {steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-8"
              >

                <span className="text-sm font-semibold text-violet-400">
                  {step.number}
                </span>

                <h3 className="mt-5 text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-zinc-500">
                  {step.description}
                </p>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= FOR RECRUITERS ================= */}

      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-transparent p-8 sm:p-12">

            <div className="relative z-10 max-w-2xl">

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <Building2 size={23} />
              </div>

              <h2 className="text-3xl font-bold sm:text-4xl">
                Hiring your next great
                teammate?
              </h2>

              <p className="mt-4 leading-7 text-zinc-400">
                Create a job, discover candidates and
                manage applications from one place.
              </p>

              <Link
                href="/dashboard"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200"
              >
                Start hiring
                <ArrowRight size={17} />
              </Link>

            </div>

            {/* Decorative icons */}

            <div className="pointer-events-none absolute -right-10 -top-10 hidden h-64 w-64 rounded-full border border-violet-400/10 sm:block" />

            <div className="pointer-events-none absolute -bottom-20 -right-20 hidden h-80 w-80 rounded-full bg-violet-500/10 blur-3xl sm:block" />

          </div>

        </div>
      </section>

      {/* ================= FINAL CTA ================= */}

      <section className="border-t border-white/5">
        <div className="mx-auto max-w-4xl px-6 py-28 text-center">

          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
            <Briefcase
              size={26}
              className="text-violet-400"
            />
          </div>

          <h2 className="text-4xl font-bold sm:text-5xl">
            Your next opportunity
            is out there.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-zinc-500">
            Stop scrolling endlessly. Find the role
            that actually fits you.
          </p>

          <Link
            href="/jobs"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-black transition hover:bg-zinc-200"
          >
            Explore Jobs
            <ArrowRight size={18} />
          </Link>

        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between lg:px-8">

          <span>
            © {new Date().getFullYear()} Hirely
          </span>

          <div className="flex gap-5">
            <Link
              href="/jobs"
              className="hover:text-zinc-300"
            >
              Jobs
            </Link>

            <Link
              href="/dashboard"
              className="hover:text-zinc-300"
            >
              Dashboard
            </Link>

            <Link
              href="/profile"
              className="hover:text-zinc-300"
            >
              Profile
            </Link>
          </div>

        </div>
      </footer>

    </main>
  );
}