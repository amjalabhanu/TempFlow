"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BellRing,
  CheckCircle2,
  Eye,
  LockKeyhole,
  LogOut,
  MonitorSmartphone,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { useDemoAuth } from "@/context/DemoAuthContext";
import { useFlowShell } from "@/components/layout/AppShell";

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition ${checked ? "bg-indigo-600" : "bg-gray-200"}`}
    >
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${checked ? "left-6" : "left-1"}`} />
    </button>
  );
}

function SettingsGuestState() {
  const { requestLogin } = useFlowShell();

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600"><SlidersHorizontal size={30} /></div>
      <h1 className="mt-6 text-2xl font-bold text-gray-900">Sign in to adjust settings</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">These demo controls are stored only while this local browser session is active.</p>
      <button type="button" onClick={requestLogin} className="mt-7 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">Open demo settings</button>
    </div>
  );
}

function SettingRow({ icon: Icon, title, description, checked, onChange }) {
  return (
    <div className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Icon size={19} /></div>
      <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-gray-900">{title}</p><p className="mt-1 text-sm leading-5 text-gray-500">{description}</p></div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, signOut } = useDemoAuth();
  const [settings, setSettings] = useState({
    activityEmail: true,
    collaborationAlerts: true,
    publicProfile: false,
    compactCards: false,
  });
  const [saved, setSaved] = useState(false);

  if (!isAuthenticated) return <SettingsGuestState />;

  function updateSetting(key, value) {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function saveSettings() {
    setSaved(true);
  }

  function handleSignOut() {
    signOut();
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7 p-5 sm:p-8">
      <div>
        <p className="text-sm font-semibold text-indigo-600">Local workspace</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">Settings</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">Tune the FlowSpace demo to your preferences. These controls never call a backend.</p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <div><p className="text-sm font-semibold text-indigo-600">Notifications</p><h2 className="mt-1 text-xl font-bold text-gray-900">Stay in the loop</h2></div>
        <div className="mt-5 divide-y divide-gray-100">
          <SettingRow icon={BellRing} title="Activity summaries" description="Receive a local demo summary when a workspace view changes." checked={settings.activityEmail} onChange={(value) => updateSetting("activityEmail", value)} />
          <SettingRow icon={MonitorSmartphone} title="Collaboration alerts" description="Show visual alerts for new shares and comments in the interface." checked={settings.collaborationAlerts} onChange={(value) => updateSetting("collaborationAlerts", value)} />
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <div><p className="text-sm font-semibold text-indigo-600">Privacy & display</p><h2 className="mt-1 text-xl font-bold text-gray-900">Control what you see</h2></div>
        <div className="mt-5 divide-y divide-gray-100">
          <SettingRow icon={Eye} title="Public profile" description="Allow your profile card to appear on published demo diagrams." checked={settings.publicProfile} onChange={(value) => updateSetting("publicProfile", value)} />
          <SettingRow icon={SlidersHorizontal} title="Compact cards" description="Use a denser card layout on future workspace screens." checked={settings.compactCards} onChange={(value) => updateSetting("compactCards", value)} />
        </div>
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-gray-100 pt-5">
          <p className="text-xs text-gray-400">{saved ? "Preferences saved locally for this demo." : "Changes are ready to save locally."}</p>
          <button type="button" onClick={saveSettings} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"><CheckCircle2 size={16} />Save preferences</button>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600"><ShieldCheck size={20} /></div><div><h2 className="text-sm font-semibold text-gray-900">Demo session</h2><p className="mt-1 max-w-lg text-sm leading-5 text-gray-500">Your demo session uses browser storage only. It is not connected to a real FlowSpace account.</p></div></div>
          <button type="button" onClick={handleSignOut} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"><LogOut size={16} />Log out</button>
        </div>
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-50 px-3.5 py-3 text-sm text-indigo-700"><LockKeyhole size={16} />No passwords, API calls, or server-side settings are stored here.</div>
      </section>
    </div>
  );
}
