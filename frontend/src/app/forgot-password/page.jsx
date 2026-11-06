
"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Workflow,
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  

async function handleSubmit(e) {
  e.preventDefault();

  setError("");
  setMessage("");

  if (!email.trim()) {
    setError("Email address is required");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("Please enter a valid email address");
    return;
  }

  setLoading(true);

  window.setTimeout(() => {
    setMessage("Demo reset link prepared. In a production build, this would be sent to your inbox.");
    setLoading(false);
  }, 450);
}


  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">

      <div className="w-full max-w-md">

        {/* Logo */}
        <Link
          href="/"
          className="mb-10 flex items-center justify-center gap-2 text-2xl font-bold text-gray-900"
        >
          <Workflow className="h-8 w-8 text-indigo-600" />
          FlowSpace
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">

          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-indigo-50 p-4">
              <Mail className="h-8 w-8 text-indigo-600" />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Forgot your password?
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              No worries! Enter the email address associated with your
              FlowSpace account. We&apos;ll send you a password reset link.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                    setMessage("");
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {error && (
                <p className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              )}
            </div>

            {/* Response message */}
            {message && (
              <div className="flex gap-3 rounded-xl border border-green-100 bg-green-50 p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />

                <p className="text-sm leading-5 text-green-700">
                  {message}
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-7 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-indigo-600"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} FlowSpace. All rights reserved.
        </p>
      </div>
    </main>
  );
}
