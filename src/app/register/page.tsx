import { RegisterFormBlock } from "@/components/blocks/auth/register-form";
import { PublicGuard } from "../public-guard";

export default async function RegisterPage() {
  return (
    <PublicGuard redirectAuthenticatedTo="/approval-pending">
      <div className="flex justify-center items-center h-screen">
        <RegisterFormBlock />
      </div>
    </PublicGuard>
  );
}