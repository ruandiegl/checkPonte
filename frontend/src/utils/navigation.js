import { BarChart3, ClipboardCheck, FileText, History, Settings } from 'lucide-react';

export function getNavigationLinks(user) {
  return [
    { to: '/checklist', label: 'Checklist', shortLabel: 'Checklist', icon: ClipboardCheck, show: true },
    { to: '/my-history', label: 'Meu histórico', shortLabel: 'Histórico', icon: History, show: user?.role === 'operator' },
    { to: '/dashboard', label: 'Dashboard', shortLabel: 'Painel', icon: BarChart3, show: user?.role === 'master' },
    { to: '/history', label: 'Histórico', shortLabel: 'Histórico', icon: History, show: user?.role === 'master' },
    { to: '/reports', label: 'Relatórios', shortLabel: 'Relatórios', icon: FileText, show: user?.role === 'master' },
    { to: '/management', label: 'Gestão', shortLabel: 'Gestão', icon: Settings, show: user?.role === 'master' },
  ].filter((link) => link.show);
}
