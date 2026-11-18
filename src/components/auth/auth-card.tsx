import { Card } from "@/components/ui/card";

export function AuthCard({ title, description, children, footer }: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Card className="gap-6 p-6 sm:p-8">
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
      {footer && <div className="text-center text-sm text-muted-foreground">{footer}</div>}
    </Card>
  );
}
