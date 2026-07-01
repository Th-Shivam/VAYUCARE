import { useUser } from "@clerk/clerk-react";
import { useAuth } from "../hooks/auth/useAuth";

export function DashboardPage() {
  const { user } = useUser();
  const { logout, loading } = useAuth();

  const steps = [
    { id: "01", name: "Clinical Intake", desc: "Medical records uploaded & analyzed", status: "complete" },
    { id: "02", name: "Hospital Match", desc: "Apollo Heights, Mumbai selected", status: "complete" },
    { id: "03", name: "Visa Processing", desc: "E-Medical Visa application submitted", status: "active" },
    { id: "04", name: "Travel & Booking", desc: "Flight & recovery villa reservation", status: "pending" },
    { id: "05", name: "Clinical Recovery", desc: "14-day post-op monitoring", status: "pending" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--app-bg)] text-slate-950 selection:bg-sky-500/15">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.14),transparent_32%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.1),transparent_34%)]" />

      {/* Header */}
      <header className="site-nav site-nav--scrolled">
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold tracking-tight text-slate-950">VAYU</span>
            <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-sky-700">
              Care Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-3 text-right sm:flex">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Patient Portal"}
                </p>
                <p className="text-xs text-slate-500">
                  {user?.primaryEmailAddress?.emailAddress || "patient@vayu.com"}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-rose-200 hover:text-rose-600 disabled:opacity-50"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
              ) : (
                <span className="material-symbols-outlined text-[18px]">logout</span>
              )}
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1240px] px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Hello, {user?.firstName || "Patient"}.
            </h1>
            <p className="mt-1 text-slate-600">
              Track your active medical journey and clinical coordination.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/80 bg-white/40 p-3 shadow-sm backdrop-blur-md">
            <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
            <span className="text-xs font-semibold text-slate-700">
              AI Concierge Service: Active
            </span>
          </div>
        </div>

        {/* Top Grid: Journey Summary & Specialist Card */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Case Details */}
          <section className="glass-panel p-6 sm:p-7 lg:col-span-2">
            <div className="flex flex-col justify-between h-full gap-6">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-600">
                  Active Treatment File
                </span>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                  Orthopedics: Complex Knee Assessment
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Patient file successfully synced with Apollo Heights, Mumbai. Special clinical protocols applied for recovery.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-slate-200 py-4 sm:grid-cols-4">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Destination</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">Mumbai, India</p>
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Est. Travel Date</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">July 18, 2026</p>
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Success Rate</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-600">99.2% (AI Est.)</p>
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Recovery Period</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">14 Days</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-sky-700">
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  Consult Clinical AI
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  Upload Records
                </button>
              </div>
            </div>
          </section>

          {/* Assigned Specialist & Hospital */}
          <section className="glass-panel p-6 sm:p-7">
            <div className="flex flex-col justify-between h-full gap-6">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-600">
                  Assigned Specialist
                </span>
                <div className="mt-4 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-sky-500 to-emerald-400 p-0.5 shadow-sm">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white font-bold text-slate-700">
                      DS
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-950">Dr. Devendra Sharma</h3>
                    <p className="text-xs text-slate-500">Chief Joint Replacement Surgeon</p>
                    <p className="text-[10px] font-semibold text-emerald-600">22+ Years Experience</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-[20px] text-sky-600">corporate_fare</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-950">Apollo Heights</p>
                    <p className="text-[11px] text-slate-500">JCI & NABH Accredited Center, Mumbai</p>
                  </div>
                </div>
              </div>

              <button className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                <span className="material-symbols-outlined text-[16px]">videocam</span>
                Schedule Video Call
              </button>
            </div>
          </section>
        </div>

        {/* Bottom Section: Clinical Journey Tracker */}
        <div className="mt-8">
          <h2 className="mb-6 text-lg font-semibold tracking-tight text-slate-950">
            Your VAYU Clinical Journey
          </h2>

          <div className="grid gap-6 lg:grid-cols-5">
            {steps.map((step) => {
              const isComplete = step.status === "complete";
              const isActive = step.status === "active";

              return (
                <div
                  key={step.id}
                  className={`glass-panel relative p-5 transition duration-300 ${
                    isActive ? "border-sky-500/40 bg-white/90 shadow-md ring-1 ring-sky-500/15" : "opacity-85"
                  }`}
                >
                  {/* Status Indicator Bar */}
                  <div
                    className={`absolute inset-x-0 top-0 h-1 rounded-t-[24px] ${
                      isComplete ? "bg-emerald-500" : isActive ? "bg-sky-500 animate-pulse" : "bg-slate-200"
                    }`}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                        isComplete
                          ? "bg-emerald-100 text-emerald-700"
                          : isActive
                          ? "bg-sky-100 text-sky-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {isComplete ? (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      ) : (
                        step.id
                      )}
                    </span>

                    {isActive && (
                      <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[9px] font-semibold text-sky-700">
                        In Progress
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-950">{step.name}</h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{step.desc}</p>

                  {isActive && (
                    <div className="mt-4 rounded-xl bg-sky-50 px-3 py-2 text-[10px] font-medium text-sky-700">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                        <span>Waiting for Consulate approval</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
