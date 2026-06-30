import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockApi } from '../services/mockApi';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Banner from '../components/Banner';
import Badge from '../components/Badge';

const ChecklistPage = () => {
  const { user, logout } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [responses, setResponses] = useState({});
  const [observations, setObservations] = useState({});
  const [showImperativeAlert, setShowImperativeAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setEquipment(mockApi.getEquipment().filter(e => e.active));
    setItems(mockApi.getItems().filter(i => i.active));
  }, []);

  const handleResponseChange = (itemId, status) => {
    const newResponses = { ...responses, [itemId]: status };
    setResponses(newResponses);

    // Check if any imperative item is NC
    const hasImperativeNC = items.some(item =>
      item.is_imperative && newResponses[item.id] === 'NC'
    );
    setShowImperativeAlert(hasImperativeNC);
  };

  const handleObservationChange = (itemId, value) => {
    setObservations({ ...observations, [itemId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEquipment) return alert('Selecione um equipamento');
    if (Object.keys(responses).length < items.length) return alert('Responda a todos os itens');

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
      mockApi.saveInspection(inspection);
      setSubmitted(true);
    } catch (err) {
      alert('Erro ao salvar inspeção');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '100vh' }}>
        <Navbar user={user} onLogout={logout} />
        <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <Badge type="OK" style={{ padding: '10px 20px', fontSize: '18px', marginBottom: '20px' }}>Inpeção Realizada</Badge>
            <h2 style={{ marginTop: '20px' }}>Checklist enviado com sucesso!</h2>
            <p style={{ color: 'var(--color-text-secondary)', margin: '20px 0' }}>
              Os dados foram registrados e estão disponíveis para consulta da gestão.
            </p>
            <Button onClick={() => window.location.reload()} fullWidth>Nova Inspeção</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '100vh' }}>
      <Navbar user={user} onLogout={logout} />

      <div className="container">
        <div className="form-container">
          <div style={{ marginBottom: '30px' }}>
            <h1>Checklist de Inspeção Diária</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
              Preencha todos os itens abaixo para liberar o equipamento.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="card" style={{ marginBottom: '20px' }}>
              <label className="section-label">Dados da Inspeção</label>
              <div style={{ marginTop: '15px' }}>
                <label style={{ fontSize: '13px', display: 'block', marginBottom: '5px' }}>Equipamento</label>
                <select
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
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

                      <div style={{ display: 'flex', gap: '5px' }}>
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
    </div>
  );
};

export default ChecklistPage;
