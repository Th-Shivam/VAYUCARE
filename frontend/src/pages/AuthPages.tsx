import { useState } from 'react';
import { useAuth } from '../hooks/auth/useAuth';

type AuthPageProps = {
  onBack: () => void;
  onSwitch: (mode: 'login' | 'register') => void;
  onSuccess?: () => void;
};

const trustPoints = [
  'End-to-end encrypted patient data',
  'Verified hospitals and specialist matching',
  'Secure travel, visa, and recovery coordination',
];

export function LoginPage({ onBack, onSwitch, onSuccess }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInWithEmail, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const success = await signInWithEmail(email, password);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--app-bg)] text-slate-950">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.14),transparent_32%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.1),transparent_34%)]" />
      <div className="mx-auto grid min-h-screen max-w-[1280px] items-center gap-10 px-4 py-6 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/60 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-10">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="relative z-10 space-y-6">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to home
            </button>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/10 bg-sky-500/6 px-3.5 py-1.5 text-xs font-medium text-sky-700">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                Secure access
              </div>
              <h1 className="max-w-[12ch] text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
                Welcome back to VAYU.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                Sign in to continue your treatment journey, track your workflow, and manage your travel and recovery plan.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {trustPoints.map((point) => (
                <div key={point} className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 text-sm leading-6 text-slate-600 shadow-sm">
                  {point}
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-slate-200 bg-white/80 p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-950">Global care network</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Access curated hospitals, care teams, and patient concierge support.</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-white/80 p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-950">Clinical visibility</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Monitor recommendations, quotes, and recovery milestones in one place.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel relative overflow-hidden p-6 sm:p-8">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sky-500/10 to-transparent" />
          <div className="relative space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Login</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Sign in to your account</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Use your email and password to access your care dashboard.</p>
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-500/10 bg-rose-500/5 p-4 text-sm font-medium text-rose-700 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Email address</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:opacity-60"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Password</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:opacity-60"
                />
              </label>

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                  Remember me
                </label>
                <a href="#" className="font-medium text-sky-600 transition hover:text-sky-700">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(14,165,233,0.22)] transition hover:-translate-y-0.5 hover:bg-sky-700 disabled:translate-y-0 disabled:opacity-70 disabled:hover:bg-sky-600"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign in
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 text-sm text-slate-500">
              <div className="h-px flex-1 bg-slate-200" />
              <span>or</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950">
                Continue with Google
              </button>
              <button className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950">
                Continue with Apple
              </button>
            </div>

            <p className="text-center text-sm text-slate-600">
              New to VAYU?{' '}
              <button type="button" onClick={() => onSwitch('register')} className="font-semibold text-sky-600 transition hover:text-sky-700">
                Create an account
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export function RegisterPage({ onBack, onSwitch, onSuccess }: AuthPageProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'signup' | 'verification'>('signup');
  const [localError, setLocalError] = useState<string | null>(null);

  const { signUpWithEmail, verifyEmailCode, loading, error, clearError } = useAuth();

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    const success = await signUpWithEmail(email, password, firstName, lastName);
    if (success) {
      setStep('verification');
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!verificationCode) {
      setLocalError("Please enter the verification code.");
      return;
    }

    const success = await verifyEmailCode(verificationCode);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--app-bg)] text-slate-950">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.14),transparent_32%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.1),transparent_34%)]" />
      <div className="mx-auto grid min-h-screen max-w-[1280px] items-center gap-10 px-4 py-6 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <section className="glass-panel relative overflow-hidden p-6 sm:p-8">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald-500/10 to-transparent" />
          <div className="relative space-y-6">
            <button
              type="button"
              onClick={step === 'verification' ? () => setStep('signup') : onBack}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              {step === 'verification' ? 'Back to details' : 'Back to home'}
            </button>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/6 px-3.5 py-1.5 text-xs font-medium text-emerald-700">
                <span className="material-symbols-outlined text-[16px]">
                  {step === 'verification' ? 'mark_email_unread' : 'person_add'}
                </span>
                {step === 'verification' ? 'Verify email' : 'Create account'}
              </div>
              <h1 className="max-w-[14ch] text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
                {step === 'verification' ? 'Verify your email address.' : 'Start your care journey with VAYU.'}
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                {step === 'verification'
                  ? `We have sent a verification code to ${email}. Please enter it to complete your account setup.`
                  : 'Register to receive hospital matches, pricing breakdowns, visa help, and a dedicated recovery plan.'}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Verified onboarding', 'Identity and clinical profile capture'],
                ['Safe coordination', 'Consent, planning, and secure messaging'],
                ['Travel support', 'Visa, pickup, and hotel arrangements'],
                ['Recovery plan', 'Follow-up, nutrition, and monitoring'],
              ].map(([title, description]) => (
                <div key={title} className="rounded-[24px] border border-slate-200 bg-white/80 p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-950">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-panel relative overflow-hidden p-6 sm:p-8">
          <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-violet-400/10 blur-3xl" />
          <div className="relative space-y-6">
            {step === 'signup' ? (
              <>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Register</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Create your account</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">A few details and you&apos;re ready to begin.</p>
                </div>

                {(error || localError) && (
                  <div className="rounded-2xl border border-rose-500/10 bg-rose-500/5 p-4 text-sm font-medium text-rose-700 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      <span>{localError || error}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-slate-700">First name</span>
                      <input
                        type="text"
                        placeholder="Rahul"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={loading}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60"
                      />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-slate-700">Last name</span>
                      <input
                        type="text"
                        placeholder="Sharma"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={loading}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60"
                      />
                    </label>
                  </div>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">Email address</span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">Password</span>
                    <input
                      type="password"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">Confirm password</span>
                    <input
                      type="password"
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60"
                    />
                  </label>



                  <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600">
                    <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                    <span>I agree to the privacy framework and clinical coordination terms.</span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(16,185,129,0.22)] transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:translate-y-0 disabled:opacity-70 disabled:hover:bg-emerald-600"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating account...
                      </span>
                    ) : (
                      <>
                        Create account
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-sm text-slate-600">
                  Already have an account?{' '}
                  <button type="button" onClick={() => onSwitch('login')} className="font-semibold text-emerald-600 transition hover:text-emerald-700">
                    Sign in instead
                  </button>
                </p>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Verification</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Verify email</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Enter the 6-digit code sent to your inbox.</p>
                </div>

                {(error || localError) && (
                  <div className="rounded-2xl border border-rose-500/10 bg-rose-500/5 p-4 text-sm font-medium text-rose-700 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      <span>{localError || error}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleVerificationSubmit} className="space-y-4">
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">Verification Code</span>
                    <input
                      type="text"
                      placeholder="123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      disabled={loading}
                      required
                      maxLength={6}
                      className="w-full text-center text-lg tracking-[0.5em] font-semibold rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(16,185,129,0.22)] transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:translate-y-0 disabled:opacity-70 disabled:hover:bg-emerald-600"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      <>
                        Verify & Complete
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="flex flex-col gap-2 items-center text-sm pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('signup')}
                    className="font-medium text-slate-500 transition hover:text-slate-800"
                  >
                    Change email address
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
