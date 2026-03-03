import { LoginFormBlock } from "@/components/blocks/auth/login-form";
import { PublicGuard } from "../public-guard";

export default async function LoginPage() {
  return (
    <PublicGuard redirectAuthenticatedTo="/products">
      <div className="flex justify-center items-center h-screen">
        <LoginFormBlock />
      </div>
    </PublicGuard>
  );
}

