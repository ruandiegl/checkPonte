import React, { useEffect, useMemo, useState } from 'react';
import { FileSpreadsheet, FileText, Search, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context';
import { api } from '../../services/api';
import Navbar from '../../components/Navbar';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { PageRoot } from './styles';
import type { ExportType, Inspection } from '../../types/domain';
import { getErrorMessage } from '../../types/domain';

function formatDate(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function inspectionTotals(inspection: Inspection) {
  const results = inspection.results || [];
  return results.reduce(
    (acc, result) => {
      if (result.answer === 'NC' || result.status === false) acc.nc += 1;
      else acc.c += 1;
      return acc;
    },
    { c: 0, nc: 0 },
  );
}

const HistoryPage = () => {
  const { user, logout } = useAuth();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [downloading, setDownloading] = useState<ExportType | ''>('');
  const hasExportableInspections = inspections.length > 0;

  useEffect(() => {
    const loadInspections = async () => {
      try {
        setInspections(await api.getInspections());
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    };

    loadInspections();
  }, []);

  const filteredInspections = inspections.filter((inspection) =>
    inspection.equipmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inspection.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inspection.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedTotals = selectedInspection ? inspectionTotals(selectedInspection) : { c: 0, nc: 0 };

  const exportParams = useMemo(() => {
    const source = filteredInspections.length > 0 ? filteredInspections : inspections;
    if (source.length === 0) return {};

    const dates = source
      .map((inspection) => new Date(inspection.created_at))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    if (dates.length === 0) return {};
    return { from: formatDate(dates[0]), to: formatDate(dates[dates.length - 1]) };
  }, [filteredInspections, inspections]);

  const handleDownload = async (type: ExportType) => {
    setDownloading(type);
    try {
      if (type === 'pdf') await api.downloadReportPdf(exportParams);
      if (type === 'excel') await api.downloadReportExcel(exportParams);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDownloading('');
    }
  };

  const openDetails = async (inspection: Inspection) => {
    try {
      setSelectedInspection(await api.getInspection(inspection.id));
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <PageRoot>
      <Navbar user={user} onLogout={logout} />

      <div className="container">
        <div className="page-header">
          <h1>Histórico de inspeções</h1>
          <div className="page-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleDownload('pdf')}
              loading={downloading === 'pdf'}
              disabled={!hasExportableInspections}
              style={{ alignItems: 'center', gap: '8px', border: '1px solid var(--color-border)' }}
            >
              <FileText size={16} /> PDF
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleDownload('excel')}
              loading={downloading === 'excel'}
              disabled={!hasExportableInspections}
              style={{ alignItems: 'center', gap: '8px', border: '1px solid var(--color-border)' }}
            >
              <FileSpreadsheet size={16} /> Excel
            </Button>
          </div>
        </div>

        <div className="card search-card" style={{ marginBottom: '20px', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Search size={18} color="var(--color-text-secondary)" />
          <input
            type="text"
            placeholder="Buscar por equipamento, operador ou status..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            style={{ border: 'none', background: 'none', padding: '5px' }}
          />
        </div>

        <div className="card">
          <div className="responsive-table">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg-header)', textAlign: 'left' }}>
                  <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>DATA</th>
                  <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>EQUIPAMENTO</th>
                  <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>OPERADOR</th>
                  <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>STATUS</th>
                  <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {filteredInspections.map((inspection) => (
                  <tr key={inspection.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{new Date(inspection.created_at).toLocaleString('pt-BR')}</td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{inspection.equipmentName}</td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{inspection.userName}</td>
                    <td style={{ padding: '12px' }}><Badge type={inspection.status}>{inspection.status}</Badge></td>
                    <td style={{ padding: '12px' }}>
                      <button
                        type="button"
                        onClick={() => openDetails(inspection)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                      >
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredInspections.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                      Nenhuma inspeção encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mobile-record-list">
            {filteredInspections.map((inspection) => (
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
                    <span className="mobile-record-label">Status</span>
                    <span className="mobile-record-value">{inspection.status}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="mobile-record-action"
                  onClick={() => openDetails(inspection)}
                  style={{ display: 'flex', background: 'var(--color-bg-header)', border: '1px solid var(--color-border)', color: 'var(--color-accent)', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}
                >
                  Ver detalhes
                </button>
              </article>
            ))}
            {filteredInspections.length === 0 && (
              <p style={{ padding: '20px 0', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                Nenhuma inspeção encontrada.
              </p>
            )}
          </div>
        </div>
      </div>

      {selectedInspection && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="inspection-modal-title"
          onPointerDown={(event: React.PointerEvent<HTMLDivElement>) => {
            if (event.target === event.currentTarget) setSelectedInspection(null);
          }}
        >
          <div className="modal-panel">
            <div className="modal-header">
              <div>
                <h2 id="inspection-modal-title" style={{ fontSize: '18px' }}>Detalhes da inspeção</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                  {new Date(selectedInspection.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
              <button type="button" className="icon-action" onClick={() => setSelectedInspection(null)} aria-label="Fechar detalhes">
                <X size={17} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid" style={{ marginBottom: '16px' }}>
                <div className="detail-field">
                  <span className="detail-label">Equipamento</span>
                  <span className="detail-value">{selectedInspection.equipmentName || '-'}</span>
                </div>
                <div className="detail-field">
                  <span className="detail-label">Operador</span>
                  <span className="detail-value">{selectedInspection.userName || '-'}</span>
                </div>
                <div className="detail-field">
                  <span className="detail-label">Local</span>
                  <span className="detail-value">{selectedInspection.location || '-'}</span>
                </div>
                <div className="detail-field">
                  <span className="detail-label">Status</span>
                  <Badge type={selectedInspection.status}>{selectedInspection.status}</Badge>
                </div>
                <div className="detail-field">
                  <span className="detail-label">Resultado</span>
                  <span className="detail-value">
                    <span style={{ color: 'var(--color-success)' }}>{selectedTotals.c} C</span>
                    {' / '}
                    <span style={{ color: selectedTotals.nc > 0 ? 'var(--color-danger)' : 'var(--color-text-primary)' }}>{selectedTotals.nc} NC</span>
                  </span>
                </div>
                <div className="detail-field">
                  <span className="detail-label">Data da inspeção</span>
                  <span className="detail-value">{new Date(selectedInspection.inspection_date || selectedInspection.created_at).toLocaleString('pt-BR')}</span>
                </div>
                <div className="detail-field">
                  <span className="detail-label">Última edição</span>
                  <span className="detail-value">
                    {selectedInspection.updated_at && Math.abs(new Date(selectedInspection.updated_at).getTime() - new Date(selectedInspection.created_at).getTime()) > 1000
                      ? new Date(selectedInspection.updated_at).toLocaleString('pt-BR')
                      : 'Sem edição'}
                  </span>
                </div>
              </div>

              {selectedInspection.observations && (
                <div className="detail-field" style={{ marginBottom: '16px' }}>
                  <span className="detail-label">Observações</span>
                  <span className="detail-value">{selectedInspection.observations}</span>
                </div>
              )}

              <label className="section-label">Itens verificados</label>
              <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
                {(selectedInspection.results || []).map((result) => (
                  <div
                    key={result.id || result.item_id}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      backgroundColor: 'var(--color-bg-header)',
                      padding: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'flex-start' }}>
                      <strong style={{ fontSize: '13px', lineHeight: 1.35 }}>{result.itemDescription || `Item #${result.item_id}`}</strong>
                      <Badge type={result.answer === 'NC' ? 'NC' : 'OK'}>{result.answer === 'NC' ? 'NC' : 'C'}</Badge>
                    </div>
                    {result.is_imperative && (
                      <div style={{ color: 'var(--color-warning)', fontSize: '11px', fontWeight: 700, marginTop: '8px', textTransform: 'uppercase' }}>
                        Item impeditivo
                      </div>
                    )}
                    {result.observation && (
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', lineHeight: 1.45, marginTop: '8px' }}>
                        {result.observation}
                      </p>
                    )}
                  </div>
                ))}
                {(selectedInspection.results || []).length === 0 && (
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Nenhum item encontrado para esta inspeção.</p>
                )}
              </div>

              <div style={{ marginTop: '18px' }}>
                <label className="section-label">Auditoria</label>
                <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
                  {(selectedInspection.audits || []).map((audit) => (
                    <div
                      key={audit.id}
                      style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        backgroundColor: 'var(--color-bg-header)',
                        padding: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: '13px' }}>{audit.actorName || `Usuário #${audit.actor_id}`}</strong>
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
                          {new Date(audit.created_at).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', marginTop: '8px', lineHeight: 1.45 }}>
                        Status: {audit.before?.status || '-'} → {audit.after?.status || '-'}
                      </p>
                      {(audit.after?.observations || audit.before?.observations) && (
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', marginTop: '6px', lineHeight: 1.45 }}>
                          Observações: {audit.before?.observations || '-'} → {audit.after?.observations || '-'}
                        </p>
                      )}
                    </div>
                  ))}
                  {(selectedInspection.audits || []).length === 0 && (
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Nenhuma edição registrada.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <Button type="button" variant="secondary" onClick={() => setSelectedInspection(null)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageRoot>
  );
};

export default HistoryPage;
