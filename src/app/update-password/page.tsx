import { fetchAuthQuery, preloadAuthQuery } from "@/lib/auth-server";
import { api } from "../../../convex/_generated/api";
import { redirect } from "next/navigation";

import { UpdatePasswordBlock } from "@/components/blocks/auth/update-password";

export default async function UpdatePasswordPage() {
  preloadAuthQuery(api.functions.auth.getCurrentUser);
  const user = await fetchAuthQuery(api.functions.auth.getCurrentUser);

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <UpdatePasswordBlock />
    </div>
  );
}

