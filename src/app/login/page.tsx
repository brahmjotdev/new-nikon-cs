import { LoginFormBlock } from "@/components/blocks/auth/login-form";
import { PublicGuard } from "../public-guard";

export default async function LoginPage() {
  return (
    <PublicGuard>
      <div className="flex justify-center items-center h-screen">
        <LoginFormBlock />
      </div>
    </PublicGuard>
  );
}

