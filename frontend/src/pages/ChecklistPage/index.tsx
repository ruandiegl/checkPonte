import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context';
import { api } from '../../services/api';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import Banner from '../../components/Banner';
import Badge from '../../components/Badge';
import { PageRoot } from './styles';
import type { CheckItem, EntityId, Equipment, InspectionAnswer } from '../../types/domain';
import { getErrorMessage } from '../../types/domain';

const ChecklistPage = () => {
  const { user, logout } = useAuth();
  const equipmentSectionRef = useRef<HTMLDivElement | null>(null);
  const equipmentSelectRef = useRef<HTMLSelectElement | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [items, setItems] = useState<CheckItem[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [responses, setResponses] = useState<Record<string, InspectionAnswer>>({});
  const [observations, setObservations] = useState<Record<string, string>>({});
  const [showImperativeAlert, setShowImperativeAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadChecklistData = async () => {
      try {
        const [equipmentData, itemData] = await Promise.all([
          api.getActiveEquipment(),
          api.getItems(),
        ]);
        setEquipment(equipmentData.filter(e => e.active));
        setItems(itemData.filter(i => i.active));
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    };

    loadChecklistData();
  }, []);

  const handleResponseChange = (itemId: EntityId, status: InspectionAnswer) => {
    const newResponses = { ...responses, [itemId]: status };
    setResponses(newResponses);

    // Check if any imperative item is NC
    const hasImperativeNC = items.some(item =>
      item.is_imperative && newResponses[item.id] === 'NC'
    );
    setShowImperativeAlert(hasImperativeNC);
  };

  const handleObservationChange = (itemId: EntityId, value: string) => {
    setObservations({ ...observations, [itemId]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEquipment) {
      toast.warning('Selecione um equipamento para continuar.');
      equipmentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(() => equipmentSelectRef.current?.focus(), 350);
      return;
    }
    if (Object.keys(responses).length < items.length) {
      toast.warning('Responda todos os itens antes de finalizar.');
      return;
    }

    const missingNcObservation = items.find((item) => responses[item.id] === 'NC' && !observations[item.id]?.trim());
    if (missingNcObservation) {
      toast.warning('Descreva a não conformidade dos itens marcados como NC.');
      return;
    }

    setLoading(true);

    // Determine overall status
    let status = 'OK';
    const hasImperativeNC = items.some(item => item.is_imperative && responses[item.id] === 'NC');
    const hasAnyNC = Object.values(responses).includes('NC');

    if (hasImperativeNC) status = 'IMP';
    else if (hasAnyNC) status = 'NC';

    const inspection = {
      equipment_id: selectedEquipment,
      user_id: user.id,
      status,
      results: items.map(item => ({
        check_item_id: item.id,
        status: responses[item.id] === 'OK',
        observation: observations[item.id] || ''
      }))
    };

    try {
      await api.saveInspection(inspection);
      toast.success('Checklist enviado com sucesso.');
      setSubmitted(true);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Erro ao salvar inspeção.'));
    } finally {
      setLoading(false);
    }
  };

  const resetChecklist = () => {
    setSelectedEquipment('');
    setResponses({});
    setObservations({});
    setShowImperativeAlert(false);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <PageRoot>
        <Navbar user={user} onLogout={logout} />
        <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <Badge type="OK" style={{ padding: '10px 20px', fontSize: '18px', marginBottom: '20px' }}>Inpeção Realizada</Badge>
            <h2 style={{ marginTop: '20px' }}>Checklist enviado com sucesso!</h2>
            <p style={{ color: 'var(--color-text-secondary)', margin: '20px 0' }}>
              Os dados foram registrados e estão disponíveis para consulta da gestão.
            </p>
            <Button onClick={resetChecklist} fullWidth>Nova Inspeção</Button>
          </div>
        </div>
      </PageRoot>
    );
  }

  return (
    <PageRoot>
      <Navbar user={user} onLogout={logout} />

      <div className="container">
        <div className="form-container">
          <div style={{ marginBottom: '30px' }}>
            <h1>Checklist de Inspeção Diária</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
              Preencha todos os itens abaixo para liberar o equipamento.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div ref={equipmentSectionRef} className="card" style={{ marginBottom: '20px' }}>
              <label className="section-label">Dados da Inspeção</label>
              <div style={{ marginTop: '15px' }}>
                <label style={{ fontSize: '13px', display: 'block', marginBottom: '5px' }}>Equipamento</label>
                <select
                  ref={equipmentSelectRef}
                  value={selectedEquipment}
                  onChange={(e) => setSelectedEquipment(e.target.value)}
                  required
                >
                  <option value="">Selecione o equipamento...</option>
                  {equipment.map(e => (
                    <option key={e.id} value={e.id}>{e.name} - {e.description}</option>
                  ))}
                </select>
              </div>
            </div>

            {showImperativeAlert && (
              <Banner>
                Itens impeditivos — com NC a ponte não poderá ser utilizada.
              </Banner>
            )}

            <div className="card">
              <label className="section-label">Itens de Verificação</label>

              <div style={{ marginTop: '20px' }}>
                {items.map((item, index) => (
                  <div key={item.id} style={{
                    padding: '15px 0',
                    borderBottom: index === items.length - 1 ? 'none' : '1px solid var(--color-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.description}</span>
                        {item.is_imperative && (
                          <span style={{
                            marginLeft: '8px',
                            fontSize: '10px',
                            color: 'var(--color-danger)',
                            fontWeight: '700',
                            textTransform: 'uppercase'
                          }}>* Impeditivo</span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '5px', flex: '0 0 auto' }}>
                        <button
                          type="button"
                          onClick={() => handleResponseChange(item.id, 'OK')}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: responses[item.id] === 'OK' ? 'var(--color-success)' : 'var(--color-bg-header)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          OK
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResponseChange(item.id, 'NC')}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: responses[item.id] === 'NC' ? 'var(--color-warning)' : 'var(--color-bg-header)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          NC
                        </button>
                      </div>
                    </div>

                    {responses[item.id] === 'NC' && (
                      <textarea
                        placeholder="Descreva a não conformidade..."
                        value={observations[item.id] || ''}
                        onChange={(e) => handleObservationChange(item.id, e.target.value)}
                        style={{ marginTop: '5px', height: '60px' }}
                        required
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
              <Button type="submit" fullWidth loading={loading}>
                FINALIZAR INSPEÇÃO
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageRoot>
  );
};

export default ChecklistPage;
