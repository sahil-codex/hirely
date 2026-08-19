import Link from "next/link";
import {
  ArrowUpRight,
  Search,
  MapPin,
  Briefcase,
  Activity,
} from "lucide-react";

const jobs = [
  {
    title: "Backend Developer",
    company: "Tech Company",
    location: "Hyderabad",
    salary: "₹60,000",
    skills: ["Node.js", "PostgreSQL", "React"],
  },
  {
    title: "Frontend Developer",
    company: "Product Startup",
    location: "Remote",
    salary: "₹70,000",
    skills: ["React", "TypeScript", "Next.js"],
  },
  {
    title: "Full Stack Developer",
    company: "SaaS Company",
    location: "Bangalore",
    salary: "₹80,000",
    skills: ["Next.js", "PostgreSQL", "Node.js"],
  },
];

const trending = [
  "Backend",
  "Frontend",
  "Full Stack",
  "React",
  "Node.js",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* HERO */}

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">

          <div className="grid min-h-[720px] items-center gap-16 py-20 lg:grid-cols-[1.35fr_0.65fr]">

            {/* LEFT */}

            <div>

              <div className="mb-8 flex items-center gap-3 text-sm text-zinc-500">
                <span className="flex h-2 w-2 rounded-full bg-violet-500" />
                <span>THE MODERN JOB MARKETPLACE</span>
              </div>

              <h1 className="max-w-4xl text-[clamp(4rem,8vw,8rem)] font-semibold leading-[0.88] tracking-[-0.07em]">
                Your next
                <br />
                <span className="text-zinc-500">
                  move starts
                </span>
                <br />
                here.
              </h1>

              <p className="mt-10 max-w-xl text-lg leading-8 text-zinc-400">
                Search jobs, discover companies and
                build your next career move — without
                getting lost in the noise.
              </p>

              {/* SEARCH */}

              <form
                action="/jobs"
                method="GET"
                className="mt-10 max-w-3xl"
              >
                <div className="flex flex-col border border-white/20 bg-white/[0.03] sm:flex-row">

                  <div className="flex flex-1 items-center border-b border-white/10 px-5 sm:border-b-0 sm:border-r">
                    <Search
                      size={19}
                      className="mr-3 text-zinc-500"
                    />

                    <input
                      name="keyword"
                      placeholder="Search job title, skill..."
                      className="w-full bg-transparent py-5 text-white outline-none placeholder:text-zinc-600"
                    />
                  </div>

                  <div className="flex items-center border-b border-white/10 px-5 sm:w-52 sm:border-b-0">
                    <MapPin
                      size={18}
                      className="mr-3 text-zinc-500"
                    />

                    <input
                      name="location"
                      placeholder="Location"
                      className="w-full bg-transparent py-5 text-white outline-none placeholder:text-zinc-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-white px-7 py-5 font-medium text-black transition hover:bg-violet-400"
                  >
                    Search
                    <ArrowUpRight size={18} />
                  </button>

                </div>
              </form>

              {/* STATS */}

              <div className="mt-12 flex gap-10">
                <div>
                  <p className="text-2xl font-semibold">
                    1,200+
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-zinc-600">
                    Open roles
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-semibold">
                    500+
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-zinc-600">
                    Companies
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT — LIVE JOB BOARD */}

            <div className="relative hidden lg:block">

              <div className="absolute -inset-10 bg-violet-500/[0.04] blur-3xl" />

              <div className="relative border border-white/10 bg-[#0d0d0f]">

                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

                  <div className="flex items-center gap-3">
                    <Activity
                      size={16}
                      className="text-violet-400"
                    />

                    <span className="text-sm font-medium">
                      LIVE JOBS
                    </span>
                  </div>

                  <span className="text-xs text-zinc-600">
                    UPDATED NOW
                  </span>

                </div>

                <div className="p-6">

                  <div className="mb-8">
                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      New opportunities
                    </p>

                    <p className="mt-2 text-4xl font-semibold tracking-tight">
                      24
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      jobs added today
                    </p>
                  </div>

                  <div className="space-y-3">

                    {jobs.slice(0, 2).map((job, index) => (
                      <Link
                        key={job.title}
                        href="/jobs"
                        className="group block border border-white/10 p-5 transition hover:border-violet-500/40 hover:bg-white/[0.03]"
                      >

                        <div className="flex justify-between gap-4">

                          <div>
                            <p className="font-medium">
                              {job.title}
                            </p>

                            <p className="mt-2 text-sm text-zinc-500">
                              {job.company}
                            </p>
                          </div>

                          <ArrowUpRight
                            size={17}
                            className="text-zinc-600 transition group-hover:text-violet-400"
                          />

                        </div>

                        <div className="mt-5 flex items-center gap-4 text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                            <MapPin size={13} />
                            {job.location}
                          </span>

                          <span>
                            {job.salary}
                          </span>
                        </div>

                      </Link>
                    ))}

                  </div>

                  <Link
                    href="/jobs"
                    className="mt-5 flex items-center justify-between border-t border-white/10 pt-5 text-sm text-zinc-400 hover:text-white"
                  >
                    View all opportunities

                    <ArrowUpRight size={16} />
                  </Link>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TRENDING */}

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">

          <div className="flex flex-col gap-6 py-7 lg:flex-row lg:items-center">

            <span className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
              Trending roles
            </span>

            <div className="flex flex-wrap gap-2">
              {trending.map((item) => (
                <Link
                  key={item}
                  href={`/jobs?keyword=${encodeURIComponent(
                    item
                  )}`}
                  className="border border-white/10 px-4 py-2 text-sm text-zinc-400 transition hover:border-violet-500/40 hover:text-white"
                >
                  {item}
                </Link>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* JOB DISCOVERY */}

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-28 lg:px-10">

          <div className="grid gap-20 lg:grid-cols-[0.35fr_1fr]">

            {/* SIDE TITLE */}

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-violet-400">
                Find your fit
              </p>

              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight">
                Opportunities
                <br />
                worth your
                <br />
                attention.
              </h2>

              <p className="mt-6 max-w-xs text-sm leading-6 text-zinc-600">
                A few roles from the Hirely
                marketplace. Search all available
                positions to find yours.
              </p>

              <Link
                href="/jobs"
                className="mt-8 inline-flex items-center gap-2 border-b border-white/30 pb-2 text-sm"
              >
                Explore all jobs
                <ArrowUpRight size={15} />
              </Link>
            </div>

            {/* JOB LIST */}

            <div className="border-t border-white/10">

              {jobs.map((job, index) => (
                <Link
                  key={job.title}
                  href="/jobs"
                  className="group grid gap-5 border-b border-white/10 py-8 transition hover:px-4 hover:bg-white/[0.02] md:grid-cols-[60px_1fr_auto]"
                >

                  <span className="text-sm text-zinc-700">
                    0{index + 1}
                  </span>

                  <div>

                    <h3 className="text-xl font-medium transition group-hover:text-violet-400">
                      {job.title}
                    </h3>

                    <p className="mt-2 text-sm text-zinc-600">
                      {job.company}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="border border-white/10 px-3 py-1 text-xs text-zinc-500"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                  </div>

                  <div className="flex flex-col items-start justify-between md:items-end">

                    <span className="text-sm text-zinc-400">
                      {job.salary} / year
                    </span>

                    <span className="mt-4 flex items-center gap-1 text-sm text-zinc-600 transition group-hover:text-white">
                      View role
                      <ArrowUpRight size={15} />
                    </span>

                  </div>

                </Link>
              ))}

            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}

      <section className="border-y border-white/10 bg-[#0b0b0c]">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">

          <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-violet-400">
                The Hirely way
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight">
                Less searching.
                <br />
                More moving.
              </h2>
            </div>

            <div className="grid md:grid-cols-3">

              {[
                [
                  "01",
                  "Discover",
                  "Find roles using the skills, location and salary that matter to you.",
                ],
                [
                  "02",
                  "Apply",
                  "Keep your profile ready and apply without repeating yourself.",
                ],
                [
                  "03",
                  "Move forward",
                  "Track your applications and know where you stand.",
                ],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="border-t border-white/10 p-6 first:md:border-l"
                >
                  <span className="text-xs text-violet-400">
                    {number}
                  </span>

                  <h3 className="mt-12 text-lg font-medium">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    {description}
                  </p>
                </div>
              ))}

            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-32 text-center lg:px-10">

          <p className="text-xs uppercase tracking-[0.25em] text-violet-400">
            Ready?
          </p>

          <h2 className="mx-auto mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.04em] sm:text-7xl">
            Don't just find a job.
            <span className="text-zinc-600">
              {" "}
              find what's next.
            </span>
          </h2>

          <Link
            href="/jobs"
            className="mt-10 inline-flex items-center gap-3 bg-white px-7 py-4 font-medium text-black transition hover:bg-violet-400"
          >
            Explore jobs
            <ArrowUpRight size={18} />
          </Link>

        </div>
      </section>

      {/* FOOTER */}

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-8 lg:px-10">

          <span className="text-sm font-semibold">
            Hirely
          </span>

          <span className="text-xs text-zinc-700">
            Find what's next.
          </span>

        </div>
      </footer>

    </main>
  );
}