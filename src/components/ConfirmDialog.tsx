import type { ReactNode } from 'react';
import { Button } from './Button';
import { Card } from './Card';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Так',
  cancelLabel = 'Скасувати',
  onConfirm,
  onCancel,
  destructive,
}: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex animate-fadeIn items-center justify-center bg-zinc-900/40 p-4">
      <Card className="w-full max-w-sm">
        <h2 className="mb-1 font-display text-lg font-bold">{title}</h2>
        {body ? <div className="mb-4 text-sm text-zinc-600">{body}</div> : null}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={destructive ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </Card>
    </div>
  );
}
