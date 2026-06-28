import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        <h3 className="text-lg font-display font-bold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction} className="font-semibold">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
