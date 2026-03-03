import { AdminGuard } from "./admin-guard";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminGuard>{children}</AdminGuard>;
}
