import { useEffect, useRef, useState } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { useAuth } from "../hooks/auth/useAuth";

type DashboardData = {
  userId: string;
  email: string | null;
  displayName: string;
  appwriteSynced: boolean;
};

type Report = {
  id: string;
  userId: string;
  title: string;
  fileId: string | null;
  fileName: string | null;
  fileUrl: string | null;
  status: string;
  createdDate: string;
};

type AgentChatResponse = {
  success: boolean;
  agent: string;
  reply: string;
  timestamp: string;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const payload = await response.json();
    if (typeof payload.detail === "string") {
      return payload.detail;
    }
  } catch {
    // Keep the fallback when the backend returns a non-JSON error.
  }

  return fallback;
}

export function DashboardPage() {
  const { user } = useUser();
  const { getToken } = useClerkAuth();
  const { logout, loading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [uploadingReport, setUploadingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentReply, setAgentReply] = useState<AgentChatResponse | null>(null);
  const [agentError, setAgentError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setDashboardLoading(true);
      setDashboardError(null);

      try {
        const token = await getToken();
        if (!token) {
          throw new Error("Authentication token is not available.");
        }

        const [dashboardResponse, reportsResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/api/users/dashboard`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${apiBaseUrl}/api/reports`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!dashboardResponse.ok) {
          throw new Error("Dashboard data could not be loaded.");
        }

        const data = (await dashboardResponse.json()) as DashboardData;
        if (isMounted) {
          setDashboardData(data);
        }

        if (reportsResponse.ok) {
          const reportsData = (await reportsResponse.json()) as { reports: Report[] };
          if (isMounted) {
            setReports(reportsData.reports);
          }
        } else if (isMounted) {
          setReportError("Reports are not available yet.");
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setDashboardError("Using local dashboard preview until backend is connected.");
        }
      } finally {
        if (isMounted) {
          setDashboardLoading(false);
          setReportsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [getToken]);

  const uploadReport = async (file: File) => {
    setUploadingReport(true);
    setReportError(null);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token is not available.");
      }

      const formData = new FormData();
      formData.append("title", file.name.replace(/\.[^/.]+$/, "") || file.name);
      formData.append("file", file);

      const response = await fetch(`${apiBaseUrl}/api/reports`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response, "Report upload failed."));
      }

      const report = (await response.json()) as Report;
      setReports((currentReports) => [report, ...currentReports]);
    } catch (error) {
      console.error(error);
      setReportError(error instanceof Error ? error.message : "Report upload failed.");
    } finally {
      setUploadingReport(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const askClinicalAI = async () => {
    setAgentLoading(true);
    setAgentError(null);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token is not available.");
      }

      const response = await fetch(`${apiBaseUrl}/api/agents/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: `Review the current VAYU dashboard context for ${displayName} and confirm the next safe coordination step.`,
        }),
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response, "Clinical AI request failed."));
      }

      const result = (await response.json()) as AgentChatResponse;
      setAgentReply(result);
    } catch (error) {
      console.error(error);
      setAgentError(error instanceof Error ? error.message : "Clinical AI is not available yet.");
    } finally {
      setAgentLoading(false);
    }
  };

  const displayName = dashboardData?.displayName || user?.firstName || "Patient";
  const email = dashboardData?.email || user?.primaryEmailAddress?.emailAddress || "patient@vayu.com";
  const hasReports = reports.length > 0;
  const hasInteractions = Boolean(agentReply);
  const hasStartedJourney = hasReports || hasInteractions;

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
                  {displayName}
                </p>
                <p className="text-xs text-slate-500">
                  {email}
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
              Hello, {displayName.split(" ")[0] || "Patient"}.
            </h1>
            <p className="mt-1 text-slate-600">
              {hasStartedJourney
                ? "Review your records and recent VAYU interactions."
                : "Start your healing journey with VAYU today."}
            </p>
            {dashboardError && (
              <p className="mt-2 text-xs font-medium text-amber-700">{dashboardError}</p>
            )}
          </div>
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/80 bg-white/40 p-3 shadow-sm backdrop-blur-md">
            <span className={`h-3.5 w-3.5 rounded-full ${dashboardLoading ? "bg-sky-500" : dashboardData?.appwriteSynced ? "bg-emerald-500" : "bg-amber-500"} shadow-[0_0_12px_rgba(16,185,129,0.5)]`} />
            <span className="text-xs font-semibold text-slate-700">
              {dashboardLoading ? "Loading Care Portal" : dashboardData?.appwriteSynced ? "Appwrite Sync: Active" : "Care Portal: Preview"}
            </span>
          </div>
        </div>

        {!hasStartedJourney && !reportsLoading && (
          <section className="glass-panel p-8 text-center sm:p-12">
            <span className="material-symbols-outlined text-5xl text-sky-600">air</span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              Start your healing journey with VAYU today.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Upload your first medical record or start a clinical coordination chat when you are ready.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={askClinicalAI}
                disabled={agentLoading}
                className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                {agentLoading ? "Starting..." : "Start Clinical Chat"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    uploadReport(file);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingReport}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                {uploadingReport ? "Uploading..." : "Upload First Record"}
              </button>
            </div>
            {(agentError || reportError) && (
              <div className="mx-auto mt-5 max-w-2xl rounded-2xl border border-slate-200 bg-white/70 p-4 text-xs">
                {agentError && <p className="text-rose-600">{agentError}</p>}
                {reportError && <p className="text-amber-700">{reportError}</p>}
              </div>
            )}
          </section>
        )}

        {hasStartedJourney && (
          <section className="glass-panel p-6 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-600">
                  Current Activity
                </span>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                  Your VAYU workspace is active
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Your dashboard shows only records and interactions created from your account.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={askClinicalAI}
                  disabled={agentLoading}
                  className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  {agentLoading ? "Consulting AI..." : "Consult Clinical AI"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      uploadReport(file);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingReport}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  {uploadingReport ? "Uploading..." : "Upload Records"}
                </button>
              </div>
            </div>
            {(agentReply || agentError || reportError) && (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white/70 p-4 text-xs text-slate-700">
                {agentReply && (
                  <p>
                    <span className="font-semibold text-sky-700">{agentReply.agent}:</span> {agentReply.reply}
                  </p>
                )}
                {agentError && <p className="text-rose-600">{agentError}</p>}
                {reportError && <p className="mt-1 text-amber-700">{reportError}</p>}
              </div>
            )}
          </section>
        )}

        <section className="mt-8 glass-panel p-6 sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-950">Uploaded Medical Records</h2>
              <p className="mt-1 text-sm text-slate-600">Records are scoped to your signed-in account.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {reportsLoading ? "Syncing" : `${reports.length} files`}
            </span>
          </div>

          <div className="mt-5 grid gap-3">
            {reportsLoading ? (
              <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-500">
                Loading records...
              </div>
            ) : reports.length > 0 ? (
              reports.map((report) => (
                <a
                  key={report.id}
                  href={report.fileUrl || undefined}
                  target={report.fileUrl ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm transition hover:border-sky-200 hover:bg-sky-50/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-semibold text-slate-900">{report.title}</span>
                  <span className="text-xs font-medium text-slate-500">
                    {report.status} {report.fileName ? `- ${report.fileName}` : ""}
                  </span>
                </a>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 px-4 py-5 text-sm text-slate-500">
                No records uploaded yet.
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
