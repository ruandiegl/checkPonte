import React, { useEffect, useMemo, useState } from 'react';
import { Edit3, Eye, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context';
import { api } from '../../services/api';
import Navbar from '../../components/Navbar';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Empty from '../../components/ui/Empty';
import { PageRoot } from './styles';
import type { Inspection, InspectionAnswer } from '../../types/domain';
import { getErrorMessage } from '../../types/domain';

function inspectionTotals(inspection: Inspection) {
  return (inspection.results || []).reduce(
    (acc, result) => {
      if (result.answer === 'NC' || result.status === false) acc.nc += 1;
      else acc.c += 1;
      return acc;
    },
    { c: 0, nc: 0 },
  );
}

function wasEdited(inspection: Inspection) {
  if (!inspection.updated_at || !inspection.created_at) return false;
  return Math.abs(new Date(inspection.updated_at).getTime() - new Date(inspection.created_at).getTime()) > 1000;
}

const OperatorHistoryPage = () => {
  const { user, logout } = useAuth();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [editingInspection, setEditingInspection] = useState<Inspection | null>(null);
  const [editResponses, setEditResponses] = useState<Record<string, InspectionAnswer>>({});
  const [editObservations, setEditObservations] = useState<Record<string, string>>({});
  const [generalObservation, setGeneralObservation] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadInspections = async () => {
    setLoading(true);
    try {
      setInspections(await api.getInspections());
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInspections();
  }, []);

  const openDetails = async (inspection: Inspection) => {
    try {
      setSelectedInspection(await api.getInspection(inspection.id));
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const openEdit = async (inspection: Inspection) => {
    try {
      const details = await api.getInspection(inspection.id);
      const responses: Record<string, InspectionAnswer> = {};
      const observations: Record<string, string> = {};
      (details.results || []).forEach((result) => {
        responses[result.item_id] = result.answer === 'NC' ? 'NC' : 'OK';
        observations[result.item_id] = result.observation || '';
      });
      setEditingInspection(details);
      setEditResponses(responses);
      setEditObservations(observations);
      setGeneralObservation(details.observations || '');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const closeEdit = () => {
    setEditingInspection(null);
    setEditResponses({});
    setEditObservations({});
    setGeneralObservation('');
  };

  const saveEdit = async () => {
    if (!editingInspection) return;
    const results = editingInspection.results || [];
    const missing = results.some((result) => !editResponses[result.item_id]);
    if (missing) {
      toast.error('Responda todos os itens antes de salvar.');
      return;
    }

    setSaving(true);
    try {
      await api.updateInspection(editingInspection.id, {
        equipment_id: editingInspection.equipment_id,
        observations: generalObservation,
        results: results.map((result) => ({
          check_item_id: result.item_id,
          status: editResponses[result.item_id] === 'OK',
          observation: editObservations[result.item_id] || '',
        })),
      });
      toast.success('Checklist atualizado.');
      closeEdit();
      await loadInspections();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const selectedTotals = useMemo(
    () => (selectedInspection ? inspectionTotals(selectedInspection) : { c: 0, nc: 0 }),
    [selectedInspection],
  );

  return (
    <PageRoot>
      <Navbar user={user} onLogout={logout} />

      <div className="container">
        <div className="page-header">
          <div>
            <h1>Meu histórico</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginTop: '8px' }}>
              Checklists criados por você, com data de criação e última edição.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="responsive-table">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg-header)', textAlign: 'left' }}>
                  <th style={{ padding: '12px', fontSize: '11px', fontWeight: 700 }}>CRIADO EM</th>
                  <th style={{ padding: '12px', fontSize: '11px', fontWeight: 700 }}>ÚLTIMA EDIÇÃO</th>
                  <th style={{ padding: '12px', fontSize: '11px', fontWeight: 700 }}>EQUIPAMENTO</th>
                  <th style={{ padding: '12px', fontSize: '11px', fontWeight: 700 }}>STATUS</th>
                  <th style={{ padding: '12px', fontSize: '11px', fontWeight: 700 }}>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {inspections.map((inspection) => (
                  <tr key={inspection.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{new Date(inspection.created_at).toLocaleString('pt-BR')}</td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>
                      {wasEdited(inspection) ? new Date(inspection.updated_at).toLocaleString('pt-BR') : 'Sem edição'}
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{inspection.equipmentName}</td>
                    <td style={{ padding: '12px' }}><Badge type={inspection.status}>{inspection.status}</Badge></td>
                    <td style={{ padding: '12px' }}>
                      <div className="action-group">
                        <button type="button" className="icon-action" onClick={() => openDetails(inspection)} aria-label="Visualizar checklist">
                          <Eye size={16} />
                        </button>
                        <button type="button" className="icon-action" onClick={() => openEdit(inspection)} aria-label="Editar checklist">
                          <Edit3 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && inspections.length === 0 && (
                  <tr>
                    <td colSpan={5}>
                      <Empty
                        title="Nenhum checklist encontrado"
                        description="Quando voce finalizar uma inspecao, ela aparecera aqui com datas de criacao e edicao."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mobile-record-list">
            {inspections.map((inspection) => (
              <article key={inspection.id} className="mobile-record-card">
                <div className="mobile-record-top">
                  <div>
                    <div className="mobile-record-title">{inspection.equipmentName}</div>
                    <div className="mobile-record-subtitle">Criado em {new Date(inspection.created_at).toLocaleString('pt-BR')}</div>
                    <div className="mobile-record-subtitle">
                      {wasEdited(inspection) ? `Editado em ${new Date(inspection.updated_at).toLocaleString('pt-BR')}` : 'Sem edição'}
                    </div>
                  </div>
                  <Badge type={inspection.status}>{inspection.status}</Badge>
                </div>
                <div className="mobile-record-grid">
                  <button type="button" className="mobile-record-action operator-action-primary" onClick={() => openDetails(inspection)}>
                    <Eye size={15} /> Visualizar
                  </button>
                  <button type="button" className="mobile-record-action operator-action-secondary" onClick={() => openEdit(inspection)}>
                    <Edit3 size={15} /> Editar
                  </button>
                </div>
              </article>
            ))}
            {!loading && inspections.length === 0 && (
              <Empty
                title="Nenhum checklist encontrado"
                description="Quando voce finalizar uma inspecao, ela aparecera aqui com datas de criacao e edicao."
              />
            )}
          </div>
        </div>
      </div>

      {selectedInspection && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="operator-details-title"
          onPointerDown={(event: React.PointerEvent<HTMLDivElement>) => {
            if (event.target === event.currentTarget) setSelectedInspection(null);
          }}
        >
          <div className="modal-panel">
            <div className="modal-header">
              <div>
                <h2 id="operator-details-title" style={{ fontSize: '18px' }}>Checklist #{selectedInspection.id}</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                  Criado em {new Date(selectedInspection.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
              <button type="button" className="icon-action" onClick={() => setSelectedInspection(null)} aria-label="Fechar">
                <X size={17} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid" style={{ marginBottom: '16px' }}>
                <div className="detail-field">
                  <span className="detail-label">Equipamento</span>
                  <span className="detail-value">{selectedInspection.equipmentName}</span>
                </div>
                <div className="detail-field">
                  <span className="detail-label">Última edição</span>
                  <span className="detail-value">{wasEdited(selectedInspection) ? new Date(selectedInspection.updated_at).toLocaleString('pt-BR') : 'Sem edição'}</span>
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
                  <span className="detail-label">Status</span>
                  <Badge type={selectedInspection.status}>{selectedInspection.status}</Badge>
                </div>
              </div>
              <label className="section-label">Itens</label>
              <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
                {(selectedInspection.results || []).map((result) => (
                  <div key={result.id || result.item_id} style={{ border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: 'var(--color-bg-header)', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'flex-start' }}>
                      <strong style={{ fontSize: '13px', lineHeight: 1.35 }}>{result.itemDescription}</strong>
                      <Badge type={result.answer === 'NC' ? 'NC' : 'OK'}>{result.answer === 'NC' ? 'NC' : 'C'}</Badge>
                    </div>
                    {result.observation && <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', lineHeight: 1.45, marginTop: '8px' }}>{result.observation}</p>}
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <Button type="button" variant="secondary" onClick={() => setSelectedInspection(null)}>Fechar</Button>
            </div>
          </div>
        </div>
      )}

      {editingInspection && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="operator-edit-title"
          onPointerDown={(event: React.PointerEvent<HTMLDivElement>) => {
            if (event.target === event.currentTarget) closeEdit();
          }}
        >
          <div className="modal-panel">
            <div className="modal-header">
              <div>
                <h2 id="operator-edit-title" style={{ fontSize: '18px' }}>Editar checklist</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                  {editingInspection.equipmentName}
                </p>
              </div>
              <button type="button" className="icon-action" onClick={closeEdit} aria-label="Fechar edição">
                <X size={17} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-field is-full" style={{ marginBottom: '16px' }}>
                <label>Observações gerais</label>
                <textarea value={generalObservation} onChange={(event) => setGeneralObservation(event.target.value)} style={{ minHeight: '76px' }} />
              </div>

              <label className="section-label">Itens</label>
              <div style={{ display: 'grid', gap: '12px', marginTop: '10px' }}>
                {(editingInspection.results || []).map((result) => (
                  <div key={result.id || result.item_id} style={{ border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: 'var(--color-bg-header)', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '13px', lineHeight: 1.35, flex: '1 1 220px' }}>{result.itemDescription}</strong>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {(['OK', 'NC'] as InspectionAnswer[]).map((answer) => (
                          <button
                            key={answer}
                            type="button"
                            onClick={() => setEditResponses({ ...editResponses, [result.item_id]: answer })}
                            style={{
                              minWidth: '48px',
                              backgroundColor: editResponses[result.item_id] === answer ? (answer === 'OK' ? 'var(--color-success)' : 'var(--color-warning)') : 'var(--color-bg-card)',
                              color: '#fff',
                              border: '1px solid var(--color-border)',
                            }}
                          >
                            {answer}
                          </button>
                        ))}
                      </div>
                    </div>
                    {editResponses[result.item_id] === 'NC' && (
                      <textarea
                        placeholder="Descreva a não conformidade..."
                        value={editObservations[result.item_id] || ''}
                        onChange={(event) => setEditObservations({ ...editObservations, [result.item_id]: event.target.value })}
                        style={{ marginTop: '10px', minHeight: '64px' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <Button type="button" variant="secondary" onClick={closeEdit}>Cancelar</Button>
              <Button type="button" onClick={saveEdit} loading={saving}>Salvar edição</Button>
            </div>
          </div>
        </div>
      )}
    </PageRoot>
  );
};

export default OperatorHistoryPage;
