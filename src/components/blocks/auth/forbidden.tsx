import { Card, CardBody } from "@/components/ui/card";

const ForbiddenBlock = () => {
  return (
    <Card className="max-w-sm">
      <CardBody>
        <p>
          You do not have access to this page. Your account may be pending
          approval or access may have been revoked.
        </p>
        <p>Please contact the administrator to request access.</p>
      </CardBody>
    </Card>
  );
};

export { ForbiddenBlock };
