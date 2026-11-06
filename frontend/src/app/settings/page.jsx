import AppShell from "@/components/layout/AppShell";
import SettingsPage from "@/components/account/SettingsPage";

export default function SettingsRoute() {
  return (
    <AppShell activePath="/settings">
      <SettingsPage />
    </AppShell>
  );
}
