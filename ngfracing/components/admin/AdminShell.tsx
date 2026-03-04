import { AdminHeader } from "@/components/admin/AdminHeader";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <AdminHeader />
      <main className="admin-main">{children}</main>
    </div>
  );
}
