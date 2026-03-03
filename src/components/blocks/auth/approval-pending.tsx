"use client";

import { Card, CardBody } from "@/components/ui/card";

const ApprovalPendingBlock = () => {
  return (
    <Card className="max-w-sm">
      <CardBody>
        <p>
          Your registration was successful but is pending approval. You will be
          contacted by the administrator when your account is activated.
        </p>
      </CardBody>
    </Card>
  );
};

export { ApprovalPendingBlock };
