import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell>{children}</AdminShell>;
}
