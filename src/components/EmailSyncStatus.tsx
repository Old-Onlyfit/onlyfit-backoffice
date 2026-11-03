import { AlertTriangle, Check } from 'lucide-react';

type EmailSyncStatusProps = {
  failed: boolean;
  errors: number | null;
};

export function EmailSyncStatus({ failed, errors }: EmailSyncStatusProps) {
  if (failed) {
    return <div className="inline-alert danger" role="alert"><AlertTriangle size={16} /> Não foi possível sincronizar com o Resend. As mensagens já salvas continuam disponíveis; aguarde dois minutos e tente novamente.</div>;
  }
  if (errors === null) return null;
  if (errors > 0) {
    return <div className="inline-alert danger" role="alert"><AlertTriangle size={16} /> Algumas mensagens não puderam ser sincronizadas. As mensagens já salvas continuam disponíveis; aguarde dois minutos e tente novamente.</div>;
  }
  return <div className="email-sync-ok" role="status"><Check size={14} /> Sincronização concluída</div>;
}
