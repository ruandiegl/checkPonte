import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context';
import { api } from '../../services/api';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import DatePicker from '../../components/ui/DatePicker';
import { PageRoot } from './styles';
import type { DateRange, ExportType, Inspection, ReportData } from '../../types/domain';
import { getErrorMessage } from '../../types/domain';

type ReportPreset = 'today' | 'week' | 'month' | 'custom';

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getPresetRange(preset: ReportPreset): DateRange {
  const to = new Date();
  const from = new Date();
  if (preset === 'week') from.setDate(to.getDate() - 6);
  if (preset === 'month') from.setDate(to.getDate() - 29);
  return { from: formatDate(from), to: formatDate(to) };
}

const ReportsPage = () => {
  const { user, logout } = useAuth();
  const [preset, setPreset] = useState<ReportPreset>('today');
  const [range, setRange] = useState(getPresetRange('today'));
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<ExportType | ''>('');

  const params = useMemo(() => ({ from: range.from, to: range.to }), [range]);

  const loadReport = useCallback(async () => {
    setLoading(true);
    try {
      setReport(await api.getReport(params));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const handlePreset = (nextPreset: ReportPreset) => {
    setPreset(nextPreset);
    if (nextPreset !== 'custom') setRange(getPresetRange(nextPreset));
  };

  const handleDownload = async (type: ExportType) => {
    setDownloading(type);
    try {
      if (type === 'pdf') await api.downloadReportPdf(params);
      if (type === 'excel') await api.downloadReportExcel(params);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDownloading('');
    }
  };

  const presets: Array<{ id: ReportPreset; label: string }> = [
    { id: 'today', label: 'Hoje' },
    { id: 'week', label: 'Semana' },
    { id: 'month', label: 'Mês' },
    { id: 'custom', label: 'Personalizado' },
  ];

  return (
    <PageRoot>
      <Navbar user={user} onLogout={logout} />

      <div className="container">
        <div className="page-header">
          <div>
            <h1>Relatórios</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginTop: '8px' }}>
              Exporte inspeções por período em PDF ou Excel.
            </p>
          </div>
          <div className="page-actions">
            <Button onClick={() => handleDownload('pdf')} loading={downloading === 'pdf'} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} /> PDF
            </Button>
            <Button onClick={() => handleDownload('excel')} loading={downloading === 'excel'} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileSpreadsheet size={16} /> Excel
            </Button>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '20px' }}>
          <label className="section-label">Período</label>
          <div className="tabs-scroll" style={{ marginBottom: '15px' }}>
            {presets.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handlePreset(item.id)}
                style={{
                  backgroundColor: preset === item.id ? 'var(--color-accent)' : 'var(--color-bg-header)',
                  color: preset === item.id ? '#111' : '#fff',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '13px', display: 'block', marginBottom: '5px' }}>Data inicial</label>
              <DatePicker
                value={range.from}
                onChange={(value) => {
                  setPreset('custom');
                  setRange({ ...range, from: value });
                }}
                ariaLabel="Data inicial"
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', display: 'block', marginBottom: '5px' }}>Data final</label>
              <DatePicker
                value={range.to}
                onChange={(value) => {
                  setPreset('custom');
                  setRange({ ...range, to: value });
                }}
                ariaLabel="Data final"
              />
            </div>
            <div style={{ alignSelf: 'end' }}>
              <Button onClick={loadReport} loading={loading} fullWidth>
                <Download size={16} /> Filtrar
              </Button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div className="card">
            <span className="section-label">Registros</span>
            <div style={{ fontSize: '32px', fontWeight: 700 }}>{report?.summary?.total || 0}</div>
          </div>
          <div className="card">
            <span className="section-label">Conformes</span>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-success)' }}>{report?.summary?.conform || 0}</div>
          </div>
          <div className="card">
            <span className="section-label">Não conformes</span>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-danger)' }}>{report?.summary?.nonConform || 0}</div>
          </div>
        </div>

        <div className="card">
          <label className="section-label">Inspeções no período</label>
          <div className="responsive-table">
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg-header)', textAlign: 'left' }}>
                  <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>DATA</th>
                  <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>PONTE</th>
                  <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>OPERADOR</th>
                  <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {(report?.inspections || []).map((inspection: Inspection) => (
                  <tr key={inspection.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{new Date(inspection.created_at).toLocaleString('pt-BR')}</td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{inspection.equipmentName}</td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{inspection.userName}</td>
                    <td style={{ padding: '12px' }}><Badge type={inspection.status}>{inspection.status}</Badge></td>
                  </tr>
                ))}
                {(report?.inspections || []).length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                      Nenhuma inspeção encontrada no período.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mobile-record-list">
            {(report?.inspections || []).map((inspection: Inspection) => (
              <article key={inspection.id} className="mobile-record-card">
                <div className="mobile-record-top">
                  <div>
                    <div className="mobile-record-title">{inspection.equipmentName}</div>
                    <div className="mobile-record-subtitle">{new Date(inspection.created_at).toLocaleString('pt-BR')}</div>
                  </div>
                  <Badge type={inspection.status}>{inspection.status}</Badge>
                </div>

                <div className="mobile-record-grid">
                  <div className="mobile-record-field">
                    <span className="mobile-record-label">Operador</span>
                    <span className="mobile-record-value" title={inspection.userName}>{inspection.userName}</span>
                  </div>
                  <div className="mobile-record-field">
                    <span className="mobile-record-label">Local</span>
                    <span className="mobile-record-value" title={inspection.location || '-'}>{inspection.location || '-'}</span>
                  </div>
                </div>
              </article>
            ))}
            {(report?.inspections || []).length === 0 && (
              <p style={{ padding: '20px 0', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                Nenhuma inspeção encontrada no período.
              </p>
            )}
          </div>
        </div>
      </div>
    </PageRoot>
  );
};

export default ReportsPage;
