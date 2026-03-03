import { AppGuard } from "./app-guard";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppGuard>
      {children}
    </AppGuard>
  );
}
