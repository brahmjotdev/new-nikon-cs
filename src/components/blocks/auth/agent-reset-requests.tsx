"use client";

import type { Id } from "../../../../convex/betterAuth/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBackdrop,
  DialogBody,
  DialogCard,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormGroup,
  FormLabel,
  FormSubmit,
  useFormError,
} from "@/components/ui/form";

import { useState } from "react";
import {
  useAdminAuth,
  useAdminUserByName,
  useAgentPasswordResetRequests,
} from "@/hooks/db/use-auth";
import { useForm } from "@/hooks/use-form";
import { z } from "zod";

type RequestRow = {
  _id: Id<"agentPasswordResetRequests">;
  username: string;
  status: "pending" | "resolved";
  createdAt: number;
  _creationTime: number;
};

const setPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export function AgentResetRequestsBlock() {
  const requests = useAgentPasswordResetRequests();
  const { setUserPassword, resolveAgentPasswordResetRequest } = useAdminAuth();
  const [selectedRequest, setSelectedRequest] = useState<RequestRow | null>(
    null,
  );
  const user = useAdminUserByName(selectedRequest?.username ?? null);

  const form = useForm({
    schema: setPasswordSchema,
    defaultValues: { newPassword: "" },
  });
  const { errorMessages } = useFormError(form);

  const pending = requests ?? [];

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedRequest(null);
      form.reset();
    }
  };

  const handleSetPassword = async (request: RequestRow) => {
    setSelectedRequest(request);
  };

  const onSubmit = async (data: { newPassword: string }) => {
    if (!selectedRequest || !user) return;
    try {
      const { error } = await setUserPassword({
        userId: user._id,
        newPassword: data.newPassword,
      });
      if (error) {
        form.setError("root", {
          message:
            (error as { message?: string })?.message ??
            "Failed to set password",
        });
        return;
      }
      await resolveAgentPasswordResetRequest({
        requestId: selectedRequest._id,
      });
      setSelectedRequest(null);
      form.reset();
    } catch (e) {
      form.setError("root", {
        message: e instanceof Error ? e.message : "Something went wrong",
      });
    }
  };

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Agent password reset requests</h2>
      {pending.length === 0 ? (
        <p className="text-muted-foreground text-sm">No pending requests.</p>
      ) : (
        <ul className="space-y-2">
          {pending.map((req) => (
            <li
              key={req._id}
              className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
            >
              <span className="font-medium">{req.username}</span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleSetPassword(req)}
              >
                Set password
              </Button>
            </li>
          ))}
        </ul>
      )}
      <Dialog open={selectedRequest !== null} onOpenChange={handleOpenChange}>
        <DialogBackdrop />
        <DialogCard>
          <DialogHeader>
            <DialogTitle>
              Set password for {selectedRequest?.username ?? ""}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            {!selectedRequest ? null : user === undefined ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : user === null ? (
              <p className="text-sm text-muted-foreground">User not found.</p>
            ) : (
              <Form
                id="set-password-form"
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormGroup>
                  <FormLabel htmlFor="newPassword">New password</FormLabel>
                  <FormField
                    type="password"
                    form={form}
                    name="newPassword"
                    id="newPassword"
                  />
                </FormGroup>
                {errorMessages.length > 0 && (
                  <p className="text-sm text-destructive mt-1">
                    {errorMessages[0]}
                  </p>
                )}
                <DialogFooter className="mt-4">
                  <DialogClose variant="secondary">Cancel</DialogClose>
                  <FormSubmit
                    type="submit"
                    variant="primary"
                    loading={form.formState.isSubmitting}
                    loadingText="Setting password..."
                  >
                    Set password & resolve
                  </FormSubmit>
                </DialogFooter>
              </Form>
            )}
          </DialogBody>
        </DialogCard>
      </Dialog>
    </section>
  );
}
