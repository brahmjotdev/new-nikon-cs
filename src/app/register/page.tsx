import { RegisterFormBlock } from "@/components/blocks/auth/register-form";
import { PublicGuard } from "../public-guard";

export default async function RegisterPage() {
  return (
    <PublicGuard>
      <div className="flex justify-center items-center h-screen">
        <RegisterFormBlock />
      </div>
    </PublicGuard>
  );
}