import AppShell from "@/components/layout/AppShell";
import ProfilePage from "@/components/account/ProfilePage";

export default function ProfileRoute() {
  return (
    <AppShell activePath="/profile">
      <ProfilePage />
    </AppShell>
  );
}
