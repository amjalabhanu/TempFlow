"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Globe2,
  Heart,
  MapPin,
  PenLine,
  Sparkles,
  UserRound,
} from "lucide-react";
import { demoUser, useDemoAuth } from "@/context/DemoAuthContext";
import { useDemoWorkspace } from "@/context/DemoWorkspaceContext";
import { useFlowShell } from "@/components/layout/AppShell";

function ProfileGuestState() {
  const { requestLogin } = useFlowShell();

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
        <UserRound size={30} />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-gray-900">Sign in to see your profile</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
        The FlowSpace profile is part of this local demo. Sign in to personalize it without sending any data to a server.
      </p>
      <button
        type="button"
        onClick={requestLogin}
        className="mt-7 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        Open demo profile
      </button>
    </div>
  );
}

function ProfileEditor({ profile }) {
  const { updateProfile } = useDemoAuth();
  const [form, setForm] = useState({
    name: profile.name || "",
    username: profile.username || "",
    role: profile.role || "",
    location: profile.location || "",
    website: profile.website || "",
    bio: profile.bio || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSaved(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    await updateProfile({
      ...form,
      name: form.name.trim() || demoUser.name,
      username: form.username.trim() || demoUser.username,
    });
    setIsSaving(false);
    setSaved(true);
  }

  function resetForm() {
    setForm({
      name: profile.name || "",
      username: profile.username || "",
      role: profile.role || "",
      location: profile.location || "",
      website: profile.website || "",
      bio: profile.bio || "",
    });
    setSaved(false);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-indigo-600">Profile details</p>
          <h2 className="mt-1 text-xl font-bold text-gray-900">Make your workspace feel like yours</h2>
        </div>
        {saved && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 size={14} />
            Saved locally
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="profile-name" className="mb-1.5 block text-sm font-semibold text-gray-700">Full name</label>
          <input id="profile-name" name="name" value={form.name} onChange={updateField} className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm text-gray-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        </div>
        <div>
          <label htmlFor="profile-username" className="mb-1.5 block text-sm font-semibold text-gray-700">Username</label>
          <input id="profile-username" name="username" value={form.username} onChange={updateField} className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm text-gray-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        </div>
        <div>
          <label htmlFor="profile-role" className="mb-1.5 block text-sm font-semibold text-gray-700">Role</label>
          <input id="profile-role" name="role" value={form.role} onChange={updateField} placeholder="e.g. Product designer" className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        </div>
        <div>
          <label htmlFor="profile-location" className="mb-1.5 block text-sm font-semibold text-gray-700">Location</label>
          <input id="profile-location" name="location" value={form.location} onChange={updateField} placeholder="City, Country" className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="profile-website" className="mb-1.5 block text-sm font-semibold text-gray-700">Website</label>
          <input id="profile-website" name="website" value={form.website} onChange={updateField} placeholder="your-site.com" className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="profile-bio" className="mb-1.5 block text-sm font-semibold text-gray-700">Bio</label>
          <textarea id="profile-bio" name="bio" rows={4} value={form.bio} onChange={updateField} placeholder="Tell your collaborators a little about yourself" className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-3 text-sm leading-6 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={resetForm} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100">Reset</button>
        <button type="submit" disabled={isSaving} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-70">
          {isSaving ? "Saving..." : "Save profile"}
        </button>
      </div>
    </form>
  );
}

export default function ProfilePage() {
  const { isAuthenticated, user } = useDemoAuth();
  const { diagrams } = useDemoWorkspace();

  if (!isAuthenticated) return <ProfileGuestState />;

  const profile = { ...demoUser, ...user };
  const myDiagrams = diagrams.filter((diagram) => diagram.owner === "me" && !diagram.trashed);
  const publishedCount = myDiagrams.filter((diagram) => diagram.published).length;
  const favoritesCount = diagrams.filter((diagram) => diagram.favorite && !diagram.trashed).length;

  return (
    <div className="mx-auto max-w-6xl space-y-7 p-5 sm:p-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 px-6 py-8 text-white sm:px-9 sm:py-10">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/15" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold text-white shadow-lg backdrop-blur">{profile.name.charAt(0).toUpperCase()}</div>
            <div>
              <p className="inline-flex items-center gap-1.5 text-sm text-indigo-100"><Sparkles size={15} />Local demo profile</p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{profile.name}</h1>
              <p className="mt-1 text-sm text-indigo-100">@{profile.username} · {profile.role || "FlowSpace member"}</p>
            </div>
          </div>
          <Link href="/workspace" className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"><PenLine size={16} />Open workspace</Link>
        </div>
      </section>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_260px]">
        <ProfileEditor key={profile.email} profile={profile} />

        <aside className="space-y-5">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">About</p>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              {profile.location && <p className="flex items-center gap-2"><MapPin size={16} className="text-indigo-600" />{profile.location}</p>}
              {profile.website && <p className="flex items-center gap-2 break-all"><Globe2 size={16} className="shrink-0 text-indigo-600" />{profile.website}</p>}
              <p className="text-xs text-gray-400">Joined {profile.joinedAt}</p>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Workspace snapshot</p>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between"><span className="text-sm text-gray-500">My diagrams</span><span className="text-lg font-bold text-gray-900">{myDiagrams.length}</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-gray-500">Published</span><span className="text-lg font-bold text-gray-900">{publishedCount}</span></div>
              <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5 text-sm text-gray-500"><Heart size={15} />Favorites</span><span className="text-lg font-bold text-gray-900">{favoritesCount}</span></div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
