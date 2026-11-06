
"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Workflow,
    LockKeyhole,
    Eye,
    EyeOff,
    ArrowRight,
    CheckCircle2,
    ArrowLeft,
} from "lucide-react";

export default function ResetPasswordPage() {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);


    // Validate password fields
    function validateForm() {
        const newErrors = {};

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must contain at least 8 characters";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    // Submit new password
    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");

        if (!validateForm()) return;

        setLoading(true);
        window.setTimeout(() => {
            setSuccess(true);
            setMessage(
                "Your demo password has been updated locally. No server request was made."
            );
            setPassword("");
            setConfirmPassword("");
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
                            {success ? (
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            ) : (
                                <LockKeyhole className="h-8 w-8 text-indigo-600" />
                            )}
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {success ? "Password Updated!" : "Reset Your Password"}
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-gray-500">
                            {success
                                ? "Your password has been changed successfully. You can now sign in using your new password."
                                : "Create a new password for your FlowSpace account. Make sure it is secure and easy for you to remember."}
                        </p>
                    </div>

                    {/* Success screen */}
                    {success ? (
                        <div className="space-y-5">
                            <div className="rounded-xl border border-green-100 bg-green-50 p-4 text-center text-sm text-green-700">
                                {message}
                            </div>

                            <Link
                                href="/login"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
                            >
                                Go to Login
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    ) : (
                        <>
                            <form onSubmit={handleSubmit} className="space-y-5">

                                    {/* New Password */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            New Password
                                        </label>

                                        <div className="relative">
                                            <LockKeyhole className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />

                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        password: "",
                                                        form: "",
                                                    }));
                                                }}
                                                placeholder="Enter new password"
                                                autoComplete="new-password"
                                                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-12 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3.5 text-gray-400"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={20} />
                                                ) : (
                                                    <Eye size={20} />
                                                )}
                                            </button>
                                        </div>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Minimum 8 characters.
                                        </p>

                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Confirm New Password
                                        </label>

                                        <div className="relative">
                                            <LockKeyhole className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />

                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => {
                                                    setConfirmPassword(e.target.value);
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        confirmPassword: "",
                                                        form: "",
                                                    }));
                                                }}
                                                placeholder="Confirm new password"
                                                autoComplete="new-password"
                                                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-12 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(!showConfirmPassword)
                                                }
                                                className="absolute right-3 top-3.5 text-gray-400"
                                                aria-label={
                                                    showConfirmPassword
                                                        ? "Hide confirm password"
                                                        : "Show confirm password"
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff size={20} />
                                                ) : (
                                                    <Eye size={20} />
                                                )}
                                            </button>
                                        </div>

                                        {errors.confirmPassword && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.confirmPassword}
                                            </p>
                                        )}
                                    </div>

                                    {/* API Error */}
                                    {errors.form && (
                                        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                                            {errors.form}
                                        </p>
                                    )}

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading ? "Updating Password..." : "Reset Password"}
                                        {!loading && <ArrowRight size={18} />}
                                    </button>
                            </form>
                        </>
                    )}

                    {/* Back to login */}
                    {!success && (
                        <div className="mt-7 text-center">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600"
                            >
                                <ArrowLeft size={16} />
                                Back to Login
                            </Link>
                        </div>
                    )}
                </div>

                <p className="mt-8 text-center text-xs text-gray-400">
                    © {new Date().getFullYear()} FlowSpace. All rights reserved.
                </p>
            </div>
        </main>
    );
}
